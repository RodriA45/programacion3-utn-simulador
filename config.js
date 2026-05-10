// ═══════════════════════════════════════════════════════════
//  CONFIGURACIÓN DE LA APP — Programación III Quiz
// ═══════════════════════════════════════════════════════════

const CONFIG = {
  hints: {
    enabled: true,
    maxPerQuiz: 3,
    maxPerQuestion: 1,
  },
  defaultTheme: "dark",
  quiz: {
    shuffleQuestions: true,
    shuffleOptions: false,
  },
  timer: {
    secondsPerQuestion: 30,
    warningAt: 10,
  },
  history: {
    maxSessions: 20,
  },
  search: {
    enabled: true,
    minChars: 2,
  },
  app: {
    name: "Programación III",
    subtitle: "Simulador de parcial",
    version: "3.0.0",
  }
};
