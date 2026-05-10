// ═══════════════════════════════════════════════════════════
//  storage.js — Historial, estadísticas y datos persistentes
// ═══════════════════════════════════════════════════════════

const Storage = {
  KEY_HISTORY: "quiz-history",
  KEY_WEAK:    "quiz-weak-questions",
  KEY_THEME:   "quiz-theme",

  // ── Historial de sesiones ──────────────────────────────
  getHistory() {
    try { return JSON.parse(localStorage.getItem(this.KEY_HISTORY) || "[]"); }
    catch { return []; }
  },

  saveSession(session) {
    const h = this.getHistory();
    h.unshift({ ...session, date: new Date().toISOString() });
    const trimmed = h.slice(0, CONFIG.history.maxSessions);
    localStorage.setItem(this.KEY_HISTORY, JSON.stringify(trimmed));
  },

  clearHistory() {
    localStorage.removeItem(this.KEY_HISTORY);
  },

  // ── Preguntas débiles (adaptativo) ─────────────────────
  getWeak() {
    try { return JSON.parse(localStorage.getItem(this.KEY_WEAK) || "{}"); }
    catch { return {}; }
  },

  // Registrar resultado de una pregunta por su índice y modo
  recordAnswer(mode, questionIndex, correct) {
    const weak = this.getWeak();
    const key = `${mode}-${questionIndex}`;
    if (!weak[key]) weak[key] = { correct: 0, wrong: 0 };
    if (correct) weak[key].correct++;
    else weak[key].wrong++;
    localStorage.setItem(this.KEY_WEAK, JSON.stringify(weak));
  },

  // Retorna el "peso" de error de cada pregunta (mayor = más difícil para el usuario)
  getErrorWeights(mode, bank) {
    const weak = this.getWeak();
    return bank.map((_, i) => {
      const key = `${mode}-${i}`;
      const d = weak[key];
      if (!d) return 1; // sin datos = peso neutro
      const total = d.correct + d.wrong;
      if (total === 0) return 1;
      return 1 + (d.wrong / total) * 3; // hasta 4x más probable si siempre fallás
    });
  },

  clearWeak() {
    localStorage.removeItem(this.KEY_WEAK);
  },

  // ── Tema ───────────────────────────────────────────────
  getTheme() { return localStorage.getItem(this.KEY_THEME) || CONFIG.defaultTheme; },
  saveTheme(t) { localStorage.setItem(this.KEY_THEME, t); },
};
