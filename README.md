# 📚 Programación III — Simulador de Parcial

Simulador de preguntas de múltiple opción para prepararse para los parciales de **Programación III**. Incluye teoría de redes/HTTP y práctica de desarrollo web.

🚀 **[¡Probar la Demo Online aquí!](https://RodriA45.github.io/programacion3-utn-simulador/)**

## ✨ Características

- **50 preguntas de Teoría** — HTTP, DNS, TCP/UDP, REST, TLS, Cookies, JWT, CORS y más
- **30 preguntas de Práctica** — HTML semántico, CSS, Flexbox, DOM, JavaScript, Node.js / Express
- 🪤 **Preguntas trampa** de Verdadero/Falso diseñadas para el parcial
- ⚠️ **Preguntas de múltiple respuesta** (más de una opción correcta)
- 💡 **Sistema de pistas** — cantidad limitada y configurable por quiz
- 🌙 / ☀️ **Modo oscuro y claro** con persistencia
- 📸 **Código real y capturas** en las preguntas de práctica
- 🎯 **3 modos de juego** — Simple, Cronometrado (⏱) y Estudio (📖)
- 📊 **Estadísticas históricas** — gráfico de progreso y sesiones anteriores
- 🔁 **Modo repaso de errores** — al terminar un quiz, podés repasar solo las que fallaste
- 🧠 **Dificultad adaptativa** — el sistema prioriza las preguntas que más solés fallar
- 🔍 **Búsqueda de preguntas** — encontrá cualquier pregunta por tema o palabra clave
- 🎯 **Selección de temas** — practicá solo los temas que necesitás

## 🚀 Cómo usar

### Opción 1 — Servidor local (recomendado)
```bash
# Con Python
python3 -m http.server 3000

# Con Node.js / npx
npx serve .

# Con VS Code: instalar extensión "Live Server" y hacer clic en "Go Live"
```
Luego abrí `http://localhost:3000` en el navegador.

> ⚠️ No abrir `index.html` directamente con doble clic — los navegadores bloquean la carga de archivos `.js` externos por seguridad (CORS).

### Opción 2 — GitHub Pages
El proyecto ya está configurado para desplegarse automáticamente. Podés acceder a la versión en línea directamente desde aquí:
👉 **[Link a la Demo en GitHub Pages](https://RodriA45.github.io/programacion3-utn-simulador/)**

## 🎮 Modos de juego

| Modo | Descripción |
|------|-------------|
| 🎯 **Simple** | Sin presión de tiempo. Respondé a tu ritmo. |
| ⏱ **Cronometrado** | Tiempo límite por pregunta (configurable). Si se acaba el tiempo, la pregunta cuenta como incorrecta. |
| 📖 **Estudio** | Las respuestas correctas se muestran al instante con su explicación. No cuenta para el historial. |

## 📁 Estructura del proyecto

```
quiz-prog3/
├── index.html          # Punto de entrada
├── styles.css          # Estilos (temas claro/oscuro + todos los componentes)
├── app.js              # Lógica principal de la app
├── storage.js          # Historial, estadísticas y persistencia (localStorage)
├── config.js           # ⚙️ Configuración editable
├── data/
│   └── questions.js    # 🗃️ Banco de preguntas (50 teoría + 30 práctica)
└── README.md
```

## ⚙️ Configuración

Editá `config.js` para personalizar el comportamiento:

```js
const CONFIG = {
  hints: {
    enabled: true,      // Activar/desactivar pistas
    maxPerQuiz: 3,      // Pistas disponibles por quiz (configurable)
    maxPerQuestion: 1,  // Máximo de pistas por pregunta
  },
  defaultTheme: "dark", // "dark" | "light"
  timer: {
    secondsPerQuestion: 30,  // Segundos por pregunta en modo cronometrado
    warningAt: 10,           // A partir de cuántos segundos se pone en rojo
  },
  history: {
    maxSessions: 20,  // Cuántas sesiones guardar en el historial
  },
  search: {
    minChars: 2,  // Mínimo de caracteres para activar la búsqueda
  },
};
```

## ➕ Agregar preguntas

Las preguntas están en `data/questions.js`. Cada pregunta tiene este formato:

```js
{
  topic: "Nombre del tema",
  type: "single",    // "single" | "multi"
  trap: true,        // Marca como 🪤 trampa
  q: "Texto de la pregunta (acepta HTML, ej: <code>)",
  opts: ["Opción A", "Opción B", "Opción C", "Opción D"],
  ans: [0],          // Índices correctos (base 0). Multi: [0, 2]
  exp: "Explicación que se muestra al revelar la respuesta",
  hint: "Pista para el botón 💡",  // Opcional

  // Código inline:
  image: { type: "code", content: "let x = 5;\nconsole.log(x);" },

  // Captura / imagen:
  image: { type: "screenshot", url: "img/captura.png", alt: "Descripción", caption: "Texto" }
}
```

## 📊 Estadísticas y adaptativo

El sistema guarda automáticamente en `localStorage`:
- Historial de sesiones (puntaje, modo, fecha)
- Cantidad de veces que respondiste bien o mal cada pregunta

Con esos datos, el modo adaptativo **prioriza las preguntas que más fallás** al mezclar (hasta 4x más probabilidad de aparecer si siempre fallás).

## 📋 Temas cubiertos

### 🧠 Teoría (50 preguntas)
HTTP/URL · Métodos HTTP · Códigos HTTP · DNS · TCP/UDP · REST/APIs · TLS/Seguridad · Cookies/Sesiones · CORS · Autenticación/JWT · Cache/Performance · Protocolos (HTTP/2, HTTP/3)

### 💻 Práctica (30 preguntas)
HTML Semántico · Formularios HTML · CSS Especificidad · CSS Box Model · CSS Flexbox · DOM · JavaScript · Node/Express · Responsive/Media Queries

---

Hecho con ❤️ para estudiantes de Programación III
