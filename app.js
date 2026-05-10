// ═══════════════════════════════════════════════════════════
//  app.js — Lógica principal del Quiz Programación III
// ═══════════════════════════════════════════════════════════

// ── Utilidades ──────────────────────────────────────────────
const $ = id => document.getElementById(id);

function shuffle(a) {
  let b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

// Shuffle ponderado: preguntas con más errores aparecen antes
function weightedShuffle(arr, weights) {
  const paired = arr.map((item, i) => ({ item, w: weights[i] || 1 }));
  paired.sort(() => Math.random() - 0.5); // base shuffle
  paired.sort((a, b) => b.w - a.w + (Math.random() - 0.5) * 0.5);
  return paired.map(p => p.item);
}

function escapeHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-AR", { day:"2-digit", month:"2-digit", year:"2-digit",
    hour:"2-digit", minute:"2-digit" });
}

// ── Estado global ────────────────────────────────────────────
let S = {
  screen: "home",
  mode: null,           // "teoria" | "practica"
  quizMode: "simple",   // "simple" | "timed" | "study"
  topicList: [], selectedTopics: [],
  questions: [], current: 0,
  answered: false, selected: [],
  score: 0,
  hintsUsed: 0,
  hintShownForCurrent: false,
  theme: "dark",
  // Timer
  timerInterval: null,
  timerSeconds: 0,
  // Búsqueda
  searchQuery: "",
  // Para modo repaso: qué preguntas del último quiz se fallaron
  wrongQuestions: [],
  // Para estadísticas adaptativas: índice global de la pregunta en el banco
  questionBankIndices: [],
};

// ── Tema ─────────────────────────────────────────────────────
function initTheme() {
  S.theme = Storage.getTheme();
  document.documentElement.setAttribute("data-theme", S.theme);
}
function toggleTheme() {
  S.theme = S.theme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", S.theme);
  Storage.saveTheme(S.theme);
  updateThemeBtn();
}
function updateThemeBtn() {
  const btn = $("theme-toggle");
  if (btn) btn.textContent = S.theme === "dark" ? "☀️" : "🌙";
}

// ── Render ────────────────────────────────────────────────────
const render = () => { $("main").innerHTML = ""; SCREENS[S.screen](); };

function renderHeader() {
  document.querySelector(".site-header").innerHTML = `
    <div class="logo-mark">📚</div>
    <div>
      <h1>${CONFIG.app.name}</h1>
      <p>${CONFIG.app.subtitle}</p>
    </div>
    <div class="header-right">
      <button class="icon-btn" id="search-nav-btn" onclick="goSearch()" title="Buscar preguntas">🔍</button>
      <button class="icon-btn" id="stats-nav-btn" onclick="goStats()" title="Estadísticas">📊</button>
      <button class="icon-btn" id="theme-toggle" onclick="toggleTheme()" title="Cambiar tema">
        ${S.theme === "dark" ? "☀️" : "🌙"}
      </button>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
//  PANTALLAS
// ═══════════════════════════════════════════════════════════
const SCREENS = {

  // ── HOME ──────────────────────────────────────────────────
  home() {
    const history = Storage.getHistory();
    const lastSession = history[0];
    $("main").innerHTML = `
      <div class="mode-grid">
        <button class="mode-card teoria" onclick="pickMode('teoria')">
          <span class="mode-icon">🧠</span>
          <div class="mode-title">Teoría</div>
          <div class="mode-sub">HTTP, DNS, TCP/UDP, REST, TLS, Cookies, JWT, CORS y más. Preguntas trampa y múltiple respuesta.</div>
          <span class="mode-tag">50 PREGUNTAS</span>
        </button>
        <button class="mode-card practica" onclick="pickMode('practica')">
          <span class="mode-icon">💻</span>
          <div class="mode-title">Práctica</div>
          <div class="mode-sub">HTML, CSS, Flexbox, DOM, JavaScript, Node.js / Express. Con código real.</div>
          <span class="mode-tag">30 PREGUNTAS</span>
        </button>
      </div>

      <div class="info-row">
        <div class="info-chip">
          <div class="n">${TEORIA.length + PRACTICA.length}</div>
          <div class="l">preguntas totales</div>
        </div>
        <div class="info-chip">
          <div class="n">${[...TEORIA,...PRACTICA].filter(q=>q.trap).length}</div>
          <div class="l">trampas 🪤</div>
        </div>
        <div class="info-chip">
          <div class="n">${history.length}</div>
          <div class="l">sesiones jugadas</div>
        </div>
      </div>

      ${lastSession ? `
      <div class="card last-session" onclick="goStats()" style="cursor:pointer">
        <div class="last-session-inner">
          <span class="last-icon">🕐</span>
          <div>
            <div class="last-title">Última sesión — ${lastSession.mode === "teoria" ? "🧠 Teoría" : "💻 Práctica"} 
              ${lastSession.quizMode === "timed" ? "⏱" : lastSession.quizMode === "study" ? "📖" : ""}</div>
            <div class="last-sub">${lastSession.score}/${lastSession.total} correctas 
              (${Math.round(lastSession.score/lastSession.total*100)}%) · ${formatDate(lastSession.date)}</div>
          </div>
          <span class="last-arrow">→</span>
        </div>
      </div>` : ""}

      <div class="card tip-card">
        <strong>💡 Cómo funciona</strong><br>
        Elegí modo → temas → forma de juego → preguntas.
        Tenés <strong>${CONFIG.hints.maxPerQuiz} pistas</strong> por quiz. Las preguntas <span class="trap-label">🪤 trampa</span> están diseñadas para confundirte.
        El sistema aprende cuáles fallás más y las prioriza.
      </div>
    `;
  },

  // ── TOPIC SELECT ──────────────────────────────────────────
  "topic-select"() {
    const bank = S.mode === "teoria" ? TEORIA : PRACTICA;
    S.topicList = [...new Set(bank.map(q => q.topic))];
    if (S.selectedTopics.length === 0) S.selectedTopics = [...S.topicList];
    const selClass = S.mode === "teoria" ? "sel-t" : "sel-p";
    const totalQ = bank.filter(q => S.selectedTopics.includes(q.topic)).length;
    const btnClass = S.mode === "teoria" ? "btn-primary" : "btn-teal";

    $("main").innerHTML = `
      <div class="card">
        <div class="section-label">Temas — ${S.mode === "teoria" ? "🧠 Teoría" : "💻 Práctica"}</div>
        <div class="topic-grid" id="tgrid"></div>
        <div class="row" style="margin-bottom:1rem">
          <button onclick="toggleAll()">Todo / Ninguno</button>
        </div>

        <div class="section-label" style="margin-top:.5rem">Modo de juego</div>
        <div class="quiz-mode-grid">
          <button class="quiz-mode-btn ${S.quizMode==='simple'?'qm-active':''}" onclick="setQuizMode('simple')">
            <span class="qm-icon">🎯</span>
            <div class="qm-title">Simple</div>
            <div class="qm-sub">Sin presión de tiempo</div>
          </button>
          <button class="quiz-mode-btn ${S.quizMode==='timed'?'qm-active':''}" onclick="setQuizMode('timed')">
            <span class="qm-icon">⏱</span>
            <div class="qm-title">Cronometrado</div>
            <div class="qm-sub">${CONFIG.timer.secondsPerQuestion}s por pregunta</div>
          </button>
          <button class="quiz-mode-btn ${S.quizMode==='study'?'qm-active':''}" onclick="setQuizMode('study')">
            <span class="qm-icon">📖</span>
            <div class="qm-title">Modo estudio</div>
            <div class="qm-sub">Ver respuestas al instante</div>
          </button>
        </div>

        <div class="row" style="margin-top:1rem">
          <button class="${btnClass}" onclick="startQuiz()" ${totalQ===0?"disabled":""}>
            Comenzar (${totalQ} preguntas)
          </button>
          <button onclick="goHome()">← Volver</button>
        </div>
      </div>
    `;

    const grid = $("tgrid");
    S.topicList.forEach(t => {
      const cnt = bank.filter(q => q.topic === t).length;
      const sel = S.selectedTopics.includes(t);
      const btn = document.createElement("button");
      btn.className = "topic-btn" + (sel ? " " + selClass : "");
      btn.innerHTML = `${t}<span class="cnt">${cnt} preguntas</span>`;
      btn.onclick = () => {
        if (S.selectedTopics.includes(t)) S.selectedTopics = S.selectedTopics.filter(x=>x!==t);
        else S.selectedTopics.push(t);
        SCREENS["topic-select"]();
      };
      grid.appendChild(btn);
    });
  },

  // ── QUIZ ──────────────────────────────────────────────────
  quiz() {
    const q = S.questions[S.current];
    const pct = Math.round((S.current / S.questions.length) * 100);
    const isT = S.mode === "teoria";
    const bc = isT ? "badge-t" : "badge-p";
    const fillC = isT ? "fill-t" : "fill-p";
    const letters = ["A","B","C","D","E","F"];
    const hintsLeft = CONFIG.hints.maxPerQuiz - S.hintsUsed;

    // Código / imagen
    let mediaHTML = "";
    if (q.image && q.image.type === "code") {
      mediaHTML = `<div class="code-block">${escapeHtml(q.image.content)}</div>`;
    } else if (q.image && q.image.type === "screenshot") {
      mediaHTML = `<div class="q-image">
        <img src="${q.image.url}" alt="${q.image.alt||''}" />
        ${q.image.caption?`<div class="q-image-label">${q.image.caption}</div>`:""}
      </div>`;
    } else if (q.code) {
      mediaHTML = `<div class="code-block">${escapeHtml(q.code)}</div>`;
    }

    // Timer bar (solo modo cronometrado)
    const timerHTML = S.quizMode === "timed" ? `
      <div class="timer-wrap">
        <div class="timer-track">
          <div class="timer-fill" id="timer-fill" style="width:100%"></div>
        </div>
        <span class="timer-num" id="timer-num">${S.timerSeconds}s</span>
      </div>` : "";

    // Modo estudio: mostrar respuesta directamente
    const isStudy = S.quizMode === "study";

    $("main").innerHTML = `
      <div class="progress-wrap">
        <div class="progress-info">
          <span>Pregunta ${S.current+1} / ${S.questions.length}</span>
          <span>✓ ${S.score} · 💡 ${hintsLeft}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill ${fillC}" style="width:${pct}%"></div>
        </div>
      </div>
      ${timerHTML}
      <div class="card">
        <div class="badges-row">
          <span class="q-badge ${bc}">${q.topic}</span>
          ${q.type==="multi"?'<span class="q-badge badge-multi">⚠ Múltiple</span>':""}
          ${q.trap?'<span class="q-badge badge-trap">🪤 Trampa</span>':""}
          ${isStudy?'<span class="q-badge badge-study">📖 Estudio</span>':""}
        </div>
        ${q.type==="multi"&&!isStudy?'<div class="multi-hint">⚠️ Marcá TODAS las correctas antes de confirmar.</div>':""}
        <div class="q-text">${q.q}</div>
        ${mediaHTML}

        ${q.hint && CONFIG.hints.enabled && !isStudy ? `
        <div class="hint-section">
          ${S.hintShownForCurrent
            ? `<div class="hint-reveal">💡 ${q.hint}</div>`
            : `<button class="hint-btn" onclick="showHint()" ${hintsLeft<=0?"disabled":""}>
                 💡 Pedir pista <span class="hint-counter">(${hintsLeft} restante${hintsLeft!==1?"s":""})</span>
               </button>`}
        </div>` : ""}

        <div class="options" id="opts"></div>
        ${q.type==="multi"&&!S.answered&&!isStudy
          ?`<div class="confirm-wrap">
               <button id="cbtn" class="${isT?"btn-primary":"btn-teal"}" onclick="confirmMulti()" disabled>
                 Confirmar
               </button>
             </div>`:""}
        <div id="feedback"></div>
      </div>
      <div class="nav-row">
        <button onclick="goHome()">← Menú</button>
        <span id="nxtwrap"></span>
      </div>
    `;

    const opts = $("opts");
    q.opts.forEach((o, i) => {
      const btn = document.createElement("button");
      const locked = S.answered || isStudy;
      btn.className = "option" + (locked ? " locked" : "");
      btn.innerHTML = `<span class="opt-box">${letters[i]}</span><span>${o}</span>`;
      if (isStudy) {
        // Modo estudio: marcar correctas directamente
        if (q.ans.includes(i)) btn.classList.add("correct");
      } else if (S.answered) {
        const isCorrect = q.ans.includes(i);
        const wasSel = S.selected.includes(i);
        if (isCorrect && wasSel) btn.classList.add("correct");
        else if (!isCorrect && wasSel) btn.classList.add("wrong");
        else if (isCorrect && !wasSel) btn.classList.add("missed");
      } else {
        btn.onclick = () => { q.type==="single" ? selectSingle(i) : toggleMulti(i); };
      }
      opts.appendChild(btn);
    });

    if (S.answered || isStudy) renderFeedback();

    // Iniciar timer si es modo cronometrado y aún no respondió
    if (S.quizMode === "timed" && !S.answered) startTimer();
  },

  // ── SCORE ──────────────────────────────────────────────────
  score() {
    stopTimer();
    const total = S.questions.length, sc = S.score;
    const pct = Math.round((sc / total) * 100);
    const isT = S.mode === "teoria";
    const clr = pct>=80?"var(--green)":pct>=60?"var(--amber)":"var(--red)";
    const r=52, circ=2*Math.PI*r, dash=(circ*(pct/100)).toFixed(1);
    const msg = pct>=80?"¡Excelente! Estás listo 🎯":pct>=60?"Bien, repasá los que fallaste 📚":"Seguí practicando, vas a mejorar 💪";
    const bc = isT ? "btn-primary" : "btn-teal";
    const modeLabel = S.quizMode==="timed"?"⏱ Cronometrado":S.quizMode==="study"?"📖 Estudio":"🎯 Simple";
    const hasWrong = S.wrongQuestions.length > 0;

    $("main").innerHTML = `
      <div class="card">
        <div class="score-wrap">
          <div class="score-ring">
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r="${r}" fill="none" stroke="var(--bg3)" stroke-width="8"/>
              <circle cx="65" cy="65" r="${r}" fill="none" stroke="${clr}" stroke-width="8"
                stroke-dasharray="${dash} ${circ.toFixed(1)}" stroke-linecap="round"/>
            </svg>
            <div class="score-num">
              <span class="score-pct" style="color:${clr}">${pct}%</span>
              <span class="score-lbl">${sc}/${total}</span>
            </div>
          </div>
          <div class="score-msg">${msg}</div>
          <div class="score-sub">${isT?"🧠 Teoría":"💻 Práctica"} · ${modeLabel} · 💡 ${S.hintsUsed} pistas</div>
          <div class="stats-grid">
            <div class="stat-chip"><div class="sn c-green">${sc}</div><div class="sl">Correctas</div></div>
            <div class="stat-chip"><div class="sn c-red">${total-sc}</div><div class="sl">Incorrectas</div></div>
            <div class="stat-chip"><div class="sn c-text">${total}</div><div class="sl">Total</div></div>
          </div>
          <div class="row" style="justify-content:center;flex-wrap:wrap">
            <button class="${bc}" onclick="startQuiz()">Repetir</button>
            ${hasWrong?`<button onclick="retryWrong()">🔁 Repasar errores (${S.wrongQuestions.length})</button>`:""}
            <button onclick="S.screen='topic-select';render()">Cambiar temas</button>
            <button onclick="goStats()">📊 Historial</button>
            <button onclick="goHome()">Menú</button>
          </div>
        </div>
      </div>
    `;
  },

  // ── ESTADÍSTICAS ──────────────────────────────────────────
  stats() {
    const history = Storage.getHistory();
    const weak = Storage.getWeak();

    // Calcular estadísticas globales
    const teoriaH = history.filter(h=>h.mode==="teoria");
    const practicaH = history.filter(h=>h.mode==="practica");
    const avgPct = h => h.length===0 ? null : Math.round(h.reduce((a,s)=>a+s.score/s.total*100,0)/h.length);

    // Top preguntas más falladas
    const allQ = [...TEORIA.map((q,i)=>({...q,gIdx:`teoria-${i}`})),
                  ...PRACTICA.map((q,i)=>({...q,gIdx:`practica-${i}`}))];
    const weakEntries = Object.entries(weak)
      .map(([k,v])=>({key:k, errorRate: v.wrong/(v.correct+v.wrong), total:v.correct+v.wrong, wrong:v.wrong}))
      .filter(e=>e.total>=2)
      .sort((a,b)=>b.errorRate-a.errorRate)
      .slice(0,5);

    // Gráfico de últimas 10 sesiones
    const last10 = history.slice(0,10).reverse();
    const maxBars = 10;

    $("main").innerHTML = `
      <div class="card">
        <div class="section-label">📊 Estadísticas</div>

        <div class="stats-overview">
          <div class="stat-big">
            <div class="sb-num">${history.length}</div>
            <div class="sb-label">Sesiones</div>
          </div>
          <div class="stat-big">
            <div class="sb-num ${(avgPct(teoriaH)||0)>=70?'c-green':'c-amber'}">${avgPct(teoriaH)!==null?avgPct(teoriaH)+"%":"—"}</div>
            <div class="sb-label">🧠 Promedio teoría</div>
          </div>
          <div class="stat-big">
            <div class="sb-num ${(avgPct(practicaH)||0)>=70?'c-green':'c-amber'}">${avgPct(practicaH)!==null?avgPct(practicaH)+"%":"—"}</div>
            <div class="sb-label">💻 Promedio práctica</div>
          </div>
        </div>

        ${last10.length>0?`
        <div class="section-label" style="margin-top:1.25rem">Últimas sesiones</div>
        <div class="history-chart">
          ${last10.map(s=>{
            const pct=Math.round(s.score/s.total*100);
            const clr=pct>=80?"var(--green)":pct>=60?"var(--amber)":"var(--red)";
            const icon=s.mode==="teoria"?"🧠":"💻";
            const modeIcon=s.quizMode==="timed"?"⏱":s.quizMode==="study"?"📖":"";
            return `<div class="hbar-wrap" title="${icon} ${pct}% — ${formatDate(s.date)}">
              <div class="hbar" style="height:${Math.max(8,pct)}%;background:${clr}"></div>
              <div class="hbar-pct">${pct}%</div>
              <div class="hbar-icon">${icon}${modeIcon}</div>
            </div>`;
          }).join("")}
        </div>` : ""}

        ${weakEntries.length>0?`
        <div class="section-label" style="margin-top:1.25rem">🎯 Preguntas más difíciles para vos</div>
        <div class="weak-list">
          ${weakEntries.map(e=>{
            // Buscar la pregunta en los bancos
            const [mode, idx] = e.key.split("-");
            const bank = mode==="teoria"?TEORIA:PRACTICA;
            const q = bank[+idx];
            if(!q) return "";
            const errPct = Math.round(e.errorRate*100);
            return `<div class="weak-item">
              <div class="weak-q">${q.q.replace(/<[^>]*>/g,"").slice(0,80)}${q.q.length>80?"…":""}</div>
              <div class="weak-meta">
                <span class="weak-topic">${q.topic}</span>
                <span class="weak-err" style="color:var(--red)">${errPct}% de error (${e.wrong}/${e.total})</span>
              </div>
            </div>`;
          }).join("")}
        </div>` : ""}

        ${history.length>0?`
        <div class="section-label" style="margin-top:1.25rem">Historial completo</div>
        <div class="history-list">
          ${history.slice(0,15).map(s=>{
            const pct=Math.round(s.score/s.total*100);
            const clr=pct>=80?"c-green":pct>=60?"c-amber":"c-red";
            const modeIcon=s.quizMode==="timed"?"⏱":s.quizMode==="study"?"📖":"🎯";
            return `<div class="history-row">
              <span>${s.mode==="teoria"?"🧠":"💻"} ${modeIcon}</span>
              <span class="hr-score ${clr}">${s.score}/${s.total} (${pct}%)</span>
              <span class="hr-date">${formatDate(s.date)}</span>
            </div>`;
          }).join("")}
        </div>
        <div class="row" style="margin-top:1rem">
          <button onclick="confirmClear()" style="color:var(--red);border-color:var(--red-border)">🗑 Borrar historial</button>
        </div>` : '<div style="color:var(--text3);font-size:13px;margin-top:.5rem">Aún no hay sesiones registradas.</div>'}

        <div class="row" style="margin-top:1.25rem">
          <button onclick="goHome()">← Volver</button>
        </div>
      </div>
    `;
  },

  // ── BÚSQUEDA ──────────────────────────────────────────────
  search() {
    const all = [
      ...TEORIA.map((q,i)=>({...q, mode:"teoria", idx:i})),
      ...PRACTICA.map((q,i)=>({...q, mode:"practica", idx:i}))
    ];

    const results = S.searchQuery.length >= CONFIG.search.minChars
      ? all.filter(q => {
          const text = (q.q + " " + q.topic + " " + (q.exp||"") + " " + q.opts.join(" ")).toLowerCase();
          return text.includes(S.searchQuery.toLowerCase());
        })
      : [];

    $("main").innerHTML = `
      <div class="card">
        <div class="section-label">🔍 Buscar preguntas</div>
        <div class="search-wrap">
          <input id="search-input" class="search-input" type="text"
            placeholder="Buscar por tema, palabra clave..."
            value="${escapeHtml(S.searchQuery)}"
            oninput="updateSearch(this.value)" autofocus />
        </div>
        ${S.searchQuery.length>=CONFIG.search.minChars
          ? `<div class="search-count">${results.length} resultado${results.length!==1?"s":""}</div>`
          : `<div class="search-count" style="color:var(--text3)">Escribí al menos ${CONFIG.search.minChars} caracteres</div>`}
        <div id="search-results">
          ${results.map(q => renderSearchResult(q)).join("")}
        </div>
        <div class="row" style="margin-top:1rem">
          <button onclick="goHome()">← Volver</button>
        </div>
      </div>
    `;

    // Focus en el input
    const inp = $("search-input");
    if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
  }
};

// ── Render de resultado de búsqueda ─────────────────────────
function renderSearchResult(q) {
  const letters = ["A","B","C","D","E","F"];
  const isT = q.mode === "teoria";
  const bc = isT ? "badge-t" : "badge-p";
  let mediaHTML = "";
  if (q.image && q.image.type === "code") {
    mediaHTML = `<div class="code-block" style="font-size:12px">${escapeHtml(q.image.content)}</div>`;
  } else if (q.code) {
    mediaHTML = `<div class="code-block" style="font-size:12px">${escapeHtml(q.code)}</div>`;
  }
  return `
    <div class="search-result">
      <div class="badges-row" style="margin-bottom:.5rem">
        <span class="q-badge ${bc}">${q.topic}</span>
        ${q.trap?'<span class="q-badge badge-trap">🪤 Trampa</span>':""}
        ${q.type==="multi"?'<span class="q-badge badge-multi">⚠ Múltiple</span>':""}
      </div>
      <div class="sr-q">${q.q}</div>
      ${mediaHTML}
      <div class="sr-opts">
        ${q.opts.map((o,i)=>`
          <div class="sr-opt ${q.ans.includes(i)?"sr-correct":""}">
            <span class="sr-letter">${letters[i]}</span> ${o}
            ${q.ans.includes(i)?'<span class="sr-check">✓</span>':""}
          </div>`).join("")}
      </div>
      <div class="sr-exp">${q.exp}</div>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════════
//  TIMER
// ═══════════════════════════════════════════════════════════
function startTimer() {
  stopTimer();
  S.timerSeconds = CONFIG.timer.secondsPerQuestion;
  updateTimerUI();
  S.timerInterval = setInterval(() => {
    S.timerSeconds--;
    updateTimerUI();
    if (S.timerSeconds <= 0) {
      stopTimer();
      // Tiempo agotado: respuesta vacía = incorrecta
      if (!S.answered) {
        S.answered = true;
        S.selected = [];
        // Registrar como incorrecta
        const bankIdx = S.questionBankIndices[S.current];
        Storage.recordAnswer(S.mode, bankIdx, false);
        S.wrongQuestions.push(S.questions[S.current]);
        render();
      }
    }
  }, 1000);
}

function stopTimer() {
  if (S.timerInterval) { clearInterval(S.timerInterval); S.timerInterval = null; }
}

function updateTimerUI() {
  const fill = $("timer-fill");
  const num = $("timer-num");
  if (!fill || !num) return;
  const max = CONFIG.timer.secondsPerQuestion;
  const pct = (S.timerSeconds / max) * 100;
  fill.style.width = pct + "%";
  num.textContent = S.timerSeconds + "s";
  const isWarn = S.timerSeconds <= CONFIG.timer.warningAt;
  fill.className = "timer-fill" + (isWarn ? " timer-warn" : "");
  num.className = "timer-num" + (isWarn ? " timer-warn-text" : "");
}

// ═══════════════════════════════════════════════════════════
//  ACCIONES
// ═══════════════════════════════════════════════════════════
function pickMode(m) {
  S.mode = m; S.selectedTopics = []; S.screen = "topic-select"; render();
}

function setQuizMode(m) {
  S.quizMode = m; SCREENS["topic-select"]();
}

function toggleAll() {
  const bank = S.mode==="teoria"?TEORIA:PRACTICA;
  const topics = [...new Set(bank.map(q=>q.topic))];
  S.selectedTopics = S.selectedTopics.length===topics.length?[]:[...topics];
  SCREENS["topic-select"]();
}

function startQuiz() {
  const bank = S.mode==="teoria"?TEORIA:PRACTICA;
  const filtered = bank.map((q,i)=>({...q,_bankIdx:i}))
                       .filter(q=>S.selectedTopics.includes(q.topic));

  // Shuffle adaptativo: peso por errores históricos
  const weights = Storage.getErrorWeights(S.mode, bank);
  const filteredWithWeights = filtered.map(q=>({q, w:weights[q._bankIdx]||1}));
  filteredWithWeights.sort(()=>Math.random()-0.5);
  if (CONFIG.quiz.shuffleQuestions) {
    filteredWithWeights.sort((a,b)=>b.w-a.w+(Math.random()-0.5)*0.8);
  }

  S.questions = filteredWithWeights.map(fw=>fw.q);
  S.questionBankIndices = filteredWithWeights.map(fw=>fw.q._bankIdx);
  S.current = 0; S.score = 0; S.answered = false; S.selected = [];
  S.hintsUsed = 0; S.hintShownForCurrent = false;
  S.wrongQuestions = [];
  S.timerSeconds = CONFIG.timer.secondsPerQuestion;
  S.screen = "quiz";
  render();
}

// Modo repaso de errores
function retryWrong() {
  if (S.wrongQuestions.length === 0) return;
  S.questions = shuffle(S.wrongQuestions);
  S.questionBankIndices = S.questions.map(q => {
    const bank = S.mode==="teoria"?TEORIA:PRACTICA;
    return bank.findIndex(b=>b.q===q.q);
  });
  S.current = 0; S.score = 0; S.answered = false; S.selected = [];
  S.hintsUsed = 0; S.hintShownForCurrent = false;
  S.wrongQuestions = [];
  S.quizMode = "simple"; // repaso siempre en modo simple
  S.screen = "quiz";
  render();
}

function goHome() {
  stopTimer();
  S.screen="home"; S.mode=null; S.selectedTopics=[]; render();
}
function goStats() { stopTimer(); S.screen="stats"; render(); }
function goSearch() { stopTimer(); S.screen="search"; render(); }

function selectSingle(i) {
  if (S.answered) return;
  stopTimer();
  S.selected = [i]; S.answered = true;
  const q = S.questions[S.current];
  const correct = q.ans.includes(i);
  if (correct) S.score++;
  else S.wrongQuestions.push(q);
  // Estadísticas adaptativas
  Storage.recordAnswer(S.mode, S.questionBankIndices[S.current], correct);
  render();
}

function toggleMulti(i) {
  const idx = S.selected.indexOf(i);
  if (idx===-1) S.selected.push(i); else S.selected.splice(idx,1);
  document.querySelectorAll(".option").forEach((el,j)=>{
    el.classList.toggle("sel-pending", S.selected.includes(j));
  });
  const cb = $("cbtn");
  if (cb) cb.disabled = S.selected.length===0;
}

function confirmMulti() {
  if (S.answered) return;
  stopTimer();
  S.answered = true;
  const q = S.questions[S.current];
  const correct = JSON.stringify([...S.selected].sort())===JSON.stringify([...q.ans].sort());
  if (correct) S.score++;
  else S.wrongQuestions.push(q);
  Storage.recordAnswer(S.mode, S.questionBankIndices[S.current], correct);
  render();
}

function renderFeedback() {
  const q = S.questions[S.current];
  const isStudy = S.quizMode === "study";
  let ok;
  if (isStudy) {
    ok = null; // en modo estudio no hay "correcto/incorrecto"
  } else if (S.answered && S.selected.length === 0 && S.quizMode==="timed") {
    ok = false; // tiempo agotado
  } else {
    ok = q.type==="single"
      ? q.ans.includes(S.selected[0])
      : JSON.stringify([...S.selected].sort())===JSON.stringify([...q.ans].sort());
  }

  const fb = $("feedback");
  if (isStudy) {
    fb.className = "feedback study-feedback";
    fb.innerHTML = `<strong>📖 Explicación</strong> — ${q.exp}`;
  } else if (S.selected.length===0 && !isStudy) {
    fb.className = "feedback wrong";
    fb.innerHTML = `<strong>⏱ Tiempo agotado</strong> — ${q.exp}`;
  } else {
    fb.className = "feedback " + (ok?"correct":"wrong");
    fb.innerHTML = `<strong>${ok?"✓ Correcto":"✗ Incorrecto"}</strong> — ${q.exp}`;
  }

  const nw = $("nxtwrap");
  const isLast = S.current===S.questions.length-1;
  const isT = S.mode==="teoria";
  const btn = document.createElement("button");
  btn.className = isT?"btn-primary":"btn-teal";
  btn.textContent = isLast ? "Ver resultados →" : "Siguiente →";
  btn.onclick = () => {
    if (isLast) {
      // Guardar sesión en historial (excepto modo estudio)
      if (!isStudy) {
        Storage.saveSession({
          mode: S.mode,
          quizMode: S.quizMode,
          score: S.score,
          total: S.questions.length,
          hintsUsed: S.hintsUsed,
        });
      }
      S.screen="score"; render();
    } else {
      S.current++;
      S.answered=false;
      S.selected=[];
      S.hintShownForCurrent=false;
      render();
    }
  };
  nw.appendChild(btn);
}

function showHint() {
  if (S.hintShownForCurrent) return;
  if (CONFIG.hints.maxPerQuiz - S.hintsUsed <= 0) return;
  S.hintsUsed++;
  S.hintShownForCurrent = true;
  render();
}

function updateSearch(val) {
  S.searchQuery = val;
  // Actualizar solo resultados sin re-render completo
  const all = [
    ...TEORIA.map((q,i)=>({...q, mode:"teoria", idx:i})),
    ...PRACTICA.map((q,i)=>({...q, mode:"practica", idx:i}))
  ];
  const results = val.length >= CONFIG.search.minChars
    ? all.filter(q=>{
        const text=(q.q+" "+q.topic+" "+(q.exp||"")+" "+q.opts.join(" ")).toLowerCase();
        return text.includes(val.toLowerCase());
      })
    : [];
  const container = $("search-results");
  const count = document.querySelector(".search-count");
  if (count) count.textContent = val.length>=CONFIG.search.minChars
    ? `${results.length} resultado${results.length!==1?"s":""}`
    : `Escribí al menos ${CONFIG.search.minChars} caracteres`;
  if (container) container.innerHTML = results.map(q=>renderSearchResult(q)).join("");
}

function confirmClear() {
  if (confirm("¿Borrar todo el historial y estadísticas? Esta acción no se puede deshacer.")) {
    Storage.clearHistory();
    Storage.clearWeak();
    render();
  }
}

// ── Init ─────────────────────────────────────────────────────
initTheme();
renderHeader();
render();
