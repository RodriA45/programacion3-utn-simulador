// ═══════════════════════════════════════════════════════════
//  BANCO DE PREGUNTAS — Programación III
//  Teoría: 50 preguntas | Práctica: 30 preguntas
// ═══════════════════════════════════════════════════════════

const TEORIA = [
  // ── HTTP / URL ──────────────────────────────────────────
  {topic:"HTTP / URL", type:"single", trap:true,
   q:"¿El fragmento (#) de una URL se envía al servidor?",
   opts:["Sí, siempre","Solo con HTTPS","No, el navegador lo usa localmente","Depende del servidor"],
   ans:[2], exp:"El fragmento (#) NUNCA llega al servidor. El navegador lo procesa localmente para anclas y scroll.",
   hint:"Pensá en qué parte de la URL es visible en los logs del servidor."},

  {topic:"HTTP / URL", type:"single", trap:false,
   q:"¿Qué parte de la URL <code>https://tienda.com:443/productos?id=5</code> representa el path?",
   opts:["https","tienda.com","443","/productos"],
   ans:[3], exp:"El path es la ruta del recurso dentro del servidor. https = protocolo, tienda.com = dominio, 443 = puerto.",
   hint:"El path es lo que viene después del dominio (y puerto), antes del ?"},

  {topic:"HTTP / URL", type:"multi", trap:false,
   q:"¿Cuáles de las siguientes afirmaciones sobre HTTPS son CORRECTAS?",
   opts:["Usa TLS/SSL para cifrar la comunicación","Es un protocolo completamente distinto a HTTP","Usa el puerto 443 por defecto","El path y los datos viajan cifrados"],
   ans:[0,2,3], exp:"HTTPS = HTTP + TLS. NO es otro protocolo diferente. Usa puerto 443. El path y el body sí van cifrados (el dominio es visible en SNI del handshake TLS).",
   hint:"¿Es HTTPS realmente un protocolo nuevo o una mejora de HTTP?"},

  {topic:"HTTP / URL", type:"single", trap:true,
   q:"HTTP cifra los datos que envía entre cliente y servidor. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. HTTP plano NO cifra nada. Para cifrar se necesita HTTPS (HTTP + TLS/SSL).",
   hint:"HTTP tiene solo 4 letras... ¿le falta algo para cifrar?"},

  {topic:"HTTP / URL", type:"single", trap:false,
   q:"¿Qué puerto usa HTTP por defecto?",
   opts:["443","8080","80","22"],
   ans:[2], exp:"HTTP → puerto 80. HTTPS → puerto 443. SSH → 22. 8080 es común para desarrollo local.",
   hint:"Es un número redondo de 2 dígitos."},

  {topic:"HTTP / URL", type:"single", trap:false,
   q:"¿Cuál es la diferencia entre query params y el path de una URL?",
   opts:["No hay diferencia, son lo mismo","El path identifica el recurso, los query params lo filtran/modifican","Los query params van antes del path","El path solo acepta números"],
   ans:[1], exp:"El path identifica el recurso (/productos/123). Los query params (?color=rojo) modifican, filtran o paginan el resultado.",
   hint:"Pensá en /libros vs /libros?genero=terror"},

  {topic:"HTTP / URL", type:"single", trap:true,
   q:"La URL <code>https://api.ejemplo.com/v1/users#config</code> envía 'config' al servidor. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. El fragmento (#config) nunca llega al servidor. El servidor solo recibe /v1/users.",
   hint:"¿El servidor puede ver lo que está después del #?"},

  // ── Métodos HTTP ────────────────────────────────────────
  {topic:"Métodos HTTP", type:"multi", trap:false,
   q:"¿Cuáles de estos métodos HTTP son IDEMPOTENTES?",
   opts:["GET","POST","PUT","DELETE"],
   ans:[0,2,3], exp:"GET, PUT y DELETE son idempotentes (llamarlos N veces da el mismo resultado). POST NO es idempotente porque cada llamada puede crear un recurso nuevo.",
   hint:"Idempotente = mismo resultado al repetirlo. ¿POST crea uno o muchos?"},

  {topic:"Métodos HTTP", type:"single", trap:true,
   q:"PATCH reemplaza el recurso COMPLETO en el servidor. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. PATCH hace una actualización PARCIAL. PUT es el que reemplaza el recurso completo.",
   hint:"PATCH viene de 'parchear'... ¿un parche reemplaza todo o solo parte?"},

  {topic:"Métodos HTTP", type:"single", trap:true,
   q:"POST es idempotente. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. POST NO es idempotente. Llamarlo dos veces puede crear dos recursos distintos.",
   hint:"Si enviás el mismo formulario dos veces con POST, ¿qué pasa?"},

  {topic:"Métodos HTTP", type:"single", trap:false,
   q:"¿Qué método HTTP se usa para obtener los métodos disponibles en un endpoint?",
   opts:["GET","HEAD","OPTIONS","FETCH"],
   ans:[2], exp:"OPTIONS devuelve los métodos HTTP permitidos para ese recurso. HEAD devuelve solo los headers sin body.",
   hint:"Su nombre describe exactamente lo que hace: te da las opciones disponibles."},

  {topic:"Métodos HTTP", type:"single", trap:false,
   q:"¿Cuál es la diferencia principal entre PUT y PATCH?",
   opts:["PUT usa JSON, PATCH usa XML","PUT reemplaza todo el recurso, PATCH actualiza parcialmente","PUT es más seguro que PATCH","No hay diferencia real"],
   ans:[1], exp:"PUT reemplaza el recurso COMPLETO (si omitís campos se borran). PATCH actualiza solo los campos enviados.",
   hint:"¿Qué pasa con los campos que NO mandás en cada caso?"},

  {topic:"Métodos HTTP", type:"single", trap:true,
   q:"DELETE es un método HTTP seguro (safe). ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. Safe significa que NO modifica el estado del servidor. DELETE claramente modifica (borra). Solo GET y HEAD son 'safe'.",
   hint:"'Safe' en HTTP significa que no cambia nada en el servidor."},

  // ── Códigos HTTP ────────────────────────────────────────
  {topic:"Códigos HTTP", type:"single", trap:true,
   q:"Un usuario autenticado intenta acceder a un recurso que NO le pertenece. ¿Qué código corresponde?",
   opts:["401 Unauthorized","403 Forbidden","404 Not Found","500 Internal Server Error"],
   ans:[1], exp:"403 = el servidor SABE quién sos pero NO te permite. 401 = no sabe quién sos (sin autenticar). ¡Trampa clásica de examen!",
   hint:"¿Está autenticado o no? ¿El servidor lo conoce?"},

  {topic:"Códigos HTTP", type:"multi", trap:false,
   q:"¿Cuáles de los siguientes son códigos de error del CLIENTE (4xx)?",
   opts:["400 Bad Request","401 Unauthorized","404 Not Found","503 Service Unavailable","504 Gateway Timeout"],
   ans:[0,1,2], exp:"4xx = errores del cliente. 5xx = errores del servidor. 503 y 504 son errores de servidor.",
   hint:"4xx = algo hizo mal el cliente. 5xx = algo hizo mal el servidor."},

  {topic:"Códigos HTTP", type:"single", trap:true,
   q:"El código 404 significa que el servidor está caído. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. 404 = recurso NO ENCONTRADO en esa URL. Si el servidor estuviera caído sería 503 o directamente no habría respuesta.",
   hint:"Si el servidor estuviera caído, ¿podrías recibir CUALQUIER respuesta de él?"},

  {topic:"Códigos HTTP", type:"single", trap:false,
   q:"¿Qué código HTTP indica que un recurso fue creado exitosamente?",
   opts:["200 OK","201 Created","204 No Content","202 Accepted"],
   ans:[1], exp:"201 Created es la respuesta al crear un recurso (por ejemplo con POST). 200 es para respuestas exitosas genéricas.",
   hint:"200 = OK genérico. ¿Cuál tiene el nombre exacto de lo que pasó?"},

  {topic:"Códigos HTTP", type:"single", trap:false,
   q:"¿Qué significa el código 304 Not Modified?",
   opts:["El recurso fue borrado","Redirección permanente","El recurso no cambió desde la última vez (usar caché)","Solicitud mal formada"],
   ans:[2], exp:"304 = el recurso no cambió. El navegador puede usar la versión en caché y evita descargar de nuevo.",
   hint:"¿Para qué sirve saber que algo NO cambió?"},

  {topic:"Códigos HTTP", type:"single", trap:false,
   q:"¿Cuál es la diferencia entre 301 y 302?",
   opts:["301 es error, 302 es éxito","301 es permanente, 302 es temporal","301 redirige con GET, 302 mantiene el método","No hay diferencia"],
   ans:[1], exp:"301 Moved Permanently = redirección definitiva (los bots actualizan sus índices). 302 Found = temporal, el recurso volverá.",
   hint:"¿Cuál le dice al navegador que guarde la nueva URL para siempre?"},

  {topic:"Códigos HTTP", type:"single", trap:true,
   q:"El código 200 siempre significa que la operación se completó con éxito. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. 200 OK significa que el servidor procesó la solicitud, pero el body puede contener un error lógico de la aplicación. El código HTTP y el éxito del negocio son cosas distintas.",
   hint:"¿Puede un servidor responder 200 con {error: 'usuario no encontrado'} en el body?"},

  // ── DNS ─────────────────────────────────────────────────
  {topic:"DNS", type:"multi", trap:false,
   q:"¿Cuáles de estas afirmaciones sobre registros DNS son CORRECTAS?",
   opts:["A → mapea dominio a IPv4","MX → gestiona el correo electrónico","CNAME → es un alias de otro dominio","TXT → almacena páginas web","NS → indica el servidor de nombres autoritativo"],
   ans:[0,1,2,4], exp:"TXT almacena texto/verificación, NO páginas web. Los demás son correctos. DNS nunca almacena páginas, solo resuelve nombres.",
   hint:"¿Qué es lo que DNS NUNCA hace? Servir contenido web."},

  {topic:"DNS", type:"single", trap:true,
   q:"DNS almacena y sirve páginas web. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. DNS solo traduce nombres de dominio a IPs. Las páginas web las sirven los servidores HTTP.",
   hint:"DNS = directorio telefónico. ¿Un directorio te da las páginas o solo el número?"},

  {topic:"DNS", type:"single", trap:false,
   q:"¿Cuál es el proceso cuando escribís 'google.com' en el navegador por primera vez?",
   opts:["El navegador se conecta directamente a Google","El sistema consulta el caché, luego DNS resolver, luego servidores raíz","El router resuelve el nombre directamente","El ISP bloquea la consulta"],
   ans:[1], exp:"Proceso: caché local → DNS resolver del ISP → servidores raíz → servidor autoritativo del dominio → IP devuelta.",
   hint:"Hay varios niveles de caché antes de llegar al servidor raíz."},

  {topic:"DNS", type:"single", trap:false,
   q:"¿Qué es el TTL en DNS?",
   opts:["El tiempo que tarda en responder el servidor","El tiempo que una respuesta DNS puede ser cacheada","El límite de tamaño del registro DNS","La versión del protocolo DNS"],
   ans:[1], exp:"TTL (Time To Live) indica cuánto tiempo puede un cliente guardar en caché la respuesta DNS. Vencido el TTL, debe consultar de nuevo.",
   hint:"TTL = 'Tiempo de Vida'. ¿Vida de qué exactamente?"},

  // ── TCP / UDP ───────────────────────────────────────────
  {topic:"TCP / UDP", type:"multi", trap:false,
   q:"¿Cuáles son características de TCP?",
   opts:["Orientado a conexión con Three-Way Handshake","Garantiza entrega y orden de paquetes","Es más rápido que UDP","Ideal para streaming de video en tiempo real"],
   ans:[0,1], exp:"TCP es confiable y ordenado pero más lento. UDP es más rápido pero sin garantías. Streaming prefiere UDP por velocidad.",
   hint:"TCP = confiable pero pesado. ¿El streaming puede esperar reenvíos?"},

  {topic:"TCP / UDP", type:"single", trap:true,
   q:"UDP garantiza la entrega de todos los paquetes. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. UDP no garantiza entrega, orden ni integridad. Por eso es más rápido: no espera confirmaciones.",
   hint:"Si UDP garantizara entrega, ¿para qué existiría TCP?"},

  {topic:"TCP / UDP", type:"single", trap:false,
   q:"¿Cuál es el orden correcto del Three-Way Handshake de TCP?",
   opts:["ACK → SYN → SYN-ACK","SYN → SYN-ACK → ACK","SYN-ACK → SYN → ACK","SYN → ACK → SYN-ACK"],
   ans:[1], exp:"SYN (cliente inicia) → SYN-ACK (servidor acepta) → ACK (cliente confirma). Así se establece la conexión TCP.",
   hint:"SYN = sincronizar. ¿Quién da el primer paso?"},

  {topic:"TCP / UDP", type:"single", trap:false,
   q:"¿Qué protocolo usa DNS para sus consultas por defecto?",
   opts:["TCP","UDP","HTTP","FTP"],
   ans:[1], exp:"DNS usa UDP por defecto (puerto 53) porque es más rápido para consultas cortas. Usa TCP solo para transferencias de zona o respuestas muy grandes.",
   hint:"Las consultas DNS son cortas. ¿Qué protocolo es más eficiente para mensajes pequeños?"},

  {topic:"TCP / UDP", type:"single", trap:false,
   q:"¿Qué aplicación es más adecuada para UDP?",
   opts:["Transferencia de archivos","Videollamadas en tiempo real","Descarga de páginas web","Envío de emails"],
   ans:[1], exp:"Las videollamadas prefieren UDP: es mejor perder un frame que esperar el reenvío y causar delay. La confiabilidad importa menos que la velocidad.",
   hint:"¿Qué es peor en una videollamada: un frame perdido o un segundo de lag?"},

  // ── REST / APIs ─────────────────────────────────────────
  {topic:"REST / APIs", type:"single", trap:true,
   q:"REST utiliza XML de forma OBLIGATORIA. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. REST generalmente usa JSON pero no lo impone. SOAP sí usa XML. REST es flexible en el formato.",
   hint:"¿REST impone un formato o es una arquitectura flexible?"},

  {topic:"REST / APIs", type:"multi", trap:false,
   q:"¿Cuáles son características de una API REST?",
   opts:["Es stateless (sin estado)","Usa HTTP como protocolo","Generalmente usa JSON","Requiere conexión persistente","Orientada a recursos (URL = recurso)"],
   ans:[0,1,2,4], exp:"REST es stateless, usa HTTP, suele usar JSON y se orienta a recursos. NO requiere conexión persistente, eso es WebSocket.",
   hint:"Stateless = sin memoria de sesión entre requests. ¿Necesita conexión permanente?"},

  {topic:"REST / APIs", type:"single", trap:false,
   q:"¿En qué se diferencia WebSocket de HTTP?",
   opts:["WebSocket usa XML, HTTP usa JSON","WebSocket mantiene conexión bidireccional persistente; HTTP es request/response","WebSocket no soporta texto","No hay diferencia real"],
   ans:[1], exp:"WebSocket abre una conexión persistente bidireccional ideal para tiempo real (chats, juegos). HTTP es request/response y cierra.",
   hint:"¿Puede el servidor enviar mensajes sin que el cliente los solicite en HTTP?"},

  {topic:"REST / APIs", type:"single", trap:false,
   q:"¿Qué significa que una API REST sea 'stateless'?",
   opts:["No guarda datos en base de datos","Cada request contiene toda la información necesaria (sin sesión en el servidor)","No tiene estado HTTP","No puede manejar usuarios autenticados"],
   ans:[1], exp:"Stateless = el servidor no guarda estado de sesión. Cada request es independiente y lleva toda la info necesaria (ej: token en header).",
   hint:"¿Cómo sabe el servidor quién sos si no guarda sesión?"},

  {topic:"REST / APIs", type:"single", trap:true,
   q:"GraphQL es simplemente otra forma de nombrar a REST. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. GraphQL es una tecnología diferente. En REST cada endpoint devuelve datos fijos; en GraphQL el cliente especifica exactamente qué campos quiere.",
   hint:"¿En REST podés pedir solo los campos que necesitás?"},

  {topic:"REST / APIs", type:"single", trap:false,
   q:"En una API REST, ¿cuál es la forma correcta de obtener un usuario específico?",
   opts:["GET /getUser?id=5","POST /users/get","GET /users/5","GET /fetch/users/5"],
   ans:[2], exp:"REST usa substantivos (recursos) en las URLs, no verbos. GET /users/5 es el estándar: verbo HTTP (GET) + recurso (/users/5).",
   hint:"REST no usa verbos en la URL. El método HTTP ya es el verbo."},

  // ── TLS / Seguridad ─────────────────────────────────────
  {topic:"TLS / Seguridad", type:"single", trap:true,
   q:"TLS reemplaza completamente a HTTP. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. TLS es una capa de seguridad que PROTEGE a HTTP. Trabajan juntos (HTTPS). TLS no reemplaza HTTP.",
   hint:"HTTPS = HTTP + TLS. ¿Puede existir TLS sin HTTP debajo?"},

  {topic:"TLS / Seguridad", type:"multi", trap:false,
   q:"¿Qué ocurre durante el handshake TLS?",
   opts:["El cliente envía ClientHello","Se verifica el certificado del servidor","Se intercambian claves de cifrado","Se transfieren los datos de la página","Se establece un canal seguro cifrado"],
   ans:[0,1,2,4], exp:"La transferencia de datos ocurre DESPUÉS del handshake. El handshake solo establece el canal seguro (negociación + verificación).",
   hint:"El handshake es la 'negociación'. Los datos vienen después."},

  {topic:"TLS / Seguridad", type:"single", trap:false,
   q:"¿Qué es un certificado SSL/TLS?",
   opts:["Un archivo que cifra los datos automáticamente","Un documento digital que verifica la identidad del servidor y contiene su clave pública","Un protocolo de autenticación de usuarios","Una versión mejorada de HTTP"],
   ans:[1], exp:"El certificado vincula una clave pública con la identidad del servidor (dominio). Lo emite una CA (Autoridad Certificadora) de confianza.",
   hint:"¿Cómo sabe tu navegador que está hablando con el servidor correcto?"},

  {topic:"TLS / Seguridad", type:"single", trap:true,
   q:"Con HTTPS, nadie puede saber a qué dominio te estás conectando. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. El dominio es visible en el campo SNI del handshake TLS y en el certificado. Solo el contenido (path, body) va cifrado.",
   hint:"¿El servidor necesita saber tu destino ANTES de establecer la conexión cifrada?"},

  // ── Cookies / Sesiones ──────────────────────────────────
  {topic:"Cookies / Sesiones", type:"single", trap:true,
   q:"Las cookies con el atributo HttpOnly pueden ser leídas por JavaScript. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. HttpOnly impide que JavaScript acceda a la cookie. Es una medida de seguridad contra ataques XSS.",
   hint:"¿Para qué sirve HttpOnly si JavaScript pudiera leerla de todas formas?"},

  {topic:"Cookies / Sesiones", type:"single", trap:false,
   q:"¿Cuál es la diferencia entre cookies de sesión y cookies persistentes?",
   opts:["No hay diferencia","Las de sesión se borran al cerrar el navegador; las persistentes tienen fecha de expiración","Las persistentes son más seguras","Las de sesión duran más tiempo"],
   ans:[1], exp:"Session cookies = sin fecha de expiración, se borran al cerrar el navegador. Persistentes = tienen Max-Age o Expires, sobreviven al cierre.",
   hint:"¿Qué le dice al navegador cuándo debe borrar la cookie?"},

  {topic:"Cookies / Sesiones", type:"multi", trap:false,
   q:"¿Cuáles de estos atributos de cookie mejoran la seguridad?",
   opts:["HttpOnly","Secure","SameSite","Domain","Path"],
   ans:[0,1,2], exp:"HttpOnly: no accesible por JS. Secure: solo sobre HTTPS. SameSite: previene CSRF. Domain y Path controlan el alcance pero no son atributos de seguridad per se.",
   hint:"¿Cuáles protegen contra ataques como XSS o CSRF?"},

  // ── CORS ────────────────────────────────────────────────
  {topic:"CORS", type:"single", trap:true,
   q:"CORS es una medida de seguridad del CLIENTE (navegador). ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[0], exp:"VERDADERO. CORS es implementado por el NAVEGADOR. La política Same-Origin es del navegador. El servidor solo indica los orígenes permitidos en los headers.",
   hint:"¿Quién bloquea la respuesta cuando el origen no está permitido?"},

  {topic:"CORS", type:"single", trap:false,
   q:"¿Qué header envía el servidor para permitir acceso desde cualquier origen?",
   opts:["Access-Control-Allow-All: true","Access-Control-Allow-Origin: *","CORS-Enable: true","Allow-Origin: all"],
   ans:[1], exp:"Access-Control-Allow-Origin: * permite requests desde cualquier origen. En producción se reemplaza * por el dominio específico.",
   hint:"El nombre del header describe exactamente qué está controlando."},

  // ── Autenticación / JWT ─────────────────────────────────
  {topic:"Autenticación / JWT", type:"single", trap:true,
   q:"JWT cifra el payload para que nadie pueda leerlo. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. JWT solo FIRMA el payload (para verificar integridad), NO lo cifra. El payload está en Base64 y cualquiera puede decodificarlo. Nunca guardes datos sensibles en el payload.",
   hint:"Base64 es codificación, no cifrado. ¿Podés decodificar Base64 fácilmente?"},

  {topic:"Autenticación / JWT", type:"single", trap:false,
   q:"¿Cuáles son las 3 partes de un JWT?",
   opts:["Usuario, Contraseña, Token","Header, Payload, Signature","Inicio, Medio, Fin","ID, Datos, Expiración"],
   ans:[1], exp:"JWT = Header (algoritmo) . Payload (datos) . Signature (firma). Separados por puntos, cada parte en Base64URL.",
   hint:"Se separan por puntos. ¿Podés verlo en jwt.io?"},

  {topic:"Autenticación / JWT", type:"single", trap:false,
   q:"¿Cuál es la diferencia entre autenticación y autorización?",
   opts:["Son sinónimos","Autenticación = quién sos; Autorización = qué podés hacer","Autorización = quién sos; Autenticación = qué podés hacer","Autenticación es solo para APIs"],
   ans:[1], exp:"Autenticación verifica identidad (login). Autorización verifica permisos (¿puede este usuario hacer esto?).",
   hint:"Autenticar = identificarse. Autorizar = tener permiso."},

  // ── Cache / Performance ─────────────────────────────────
  {topic:"Cache / Performance", type:"single", trap:false,
   q:"¿Qué header HTTP controla cuánto tiempo un recurso puede ser cacheado?",
   opts:["Cache","Store-Time","Cache-Control","Expires-After"],
   ans:[2], exp:"Cache-Control es el header estándar moderno (ej: Cache-Control: max-age=3600). El antiguo header Expires también existe pero Cache-Control tiene prioridad.",
   hint:"El nombre del header es casi literal a lo que hace."},

  {topic:"Cache / Performance", type:"single", trap:true,
   q:"Un request GET con Cache-Control: no-store nunca va al servidor. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. no-store indica que NO se debe guardar en caché. Cada request va al servidor. Es lo opuesto de cachear.",
   hint:"'no-store' = no almacenar. Si no se almacena, ¿de dónde va a responder?"},

  // ── Protocolos adicionales ──────────────────────────────
  {topic:"Protocolos", type:"single", trap:false,
   q:"¿Cuál es la diferencia entre HTTP/1.1 y HTTP/2?",
   opts:["HTTP/2 usa UDP en vez de TCP","HTTP/2 permite multiplexing (varias requests en una conexión TCP)","HTTP/2 no soporta HTTPS","No hay diferencias prácticas"],
   ans:[1], exp:"HTTP/2 introduce multiplexing: múltiples requests/responses en paralelo sobre una sola conexión TCP. HTTP/1.1 necesita una conexión por request (o pipelining limitado).",
   hint:"¿Qué problema de rendimiento de HTTP/1.1 resuelve HTTP/2?"},

  {topic:"Protocolos", type:"single", trap:false,
   q:"¿Qué es una API?",
   opts:["Un lenguaje de programación para backends","Una interfaz que define cómo dos sistemas se comunican","Un tipo de base de datos","Un servidor web"],
   ans:[1], exp:"API (Application Programming Interface) = contrato que define cómo dos sistemas se comunican: qué pedir, cómo pedirlo y qué esperar como respuesta.",
   hint:"'Interface' es la palabra clave: define la forma de comunicación."},

  {topic:"Protocolos", type:"single", trap:true,
   q:"HTTP/3 usa TCP como protocolo de transporte. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. HTTP/3 usa QUIC, que está sobre UDP (no TCP). QUIC resuelve el problema del head-of-line blocking de TCP.",
   hint:"HTTP/3 fue diseñado para superar limitaciones de TCP..."},
];

// ─────────────────────────────────────────────────────────────
//  PRÁCTICA — 30 preguntas
// ─────────────────────────────────────────────────────────────

const PRACTICA = [
  // ── HTML Semántico ──────────────────────────────────────
  {topic:"HTML Semántico", type:"single", trap:true,
   q:"La etiqueta &lt;main&gt; puede aparecer múltiples veces en una página HTML. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. Solo puede haber UN &lt;main&gt; por página. Representa el contenido principal único del documento.",
   hint:"¿Puede una página tener varios 'contenidos principales'?"},

  {topic:"HTML Semántico", type:"multi", trap:false,
   q:"¿Cuáles de estas son etiquetas HTML SEMÁNTICAS?",
   opts:["&lt;div&gt;","&lt;header&gt;","&lt;nav&gt;","&lt;span&gt;","&lt;article&gt;","&lt;section&gt;"],
   ans:[1,2,4,5], exp:"&lt;div&gt; y &lt;span&gt; son contenedores genéricos SIN semántica. &lt;header&gt;, &lt;nav&gt;, &lt;article&gt; y &lt;section&gt; tienen significado semántico.",
   hint:"¿'div' y 'span' le dicen algo al navegador sobre QUÉ contienen?"},

  {topic:"HTML Semántico", type:"single", trap:true,
   q:"&lt;img&gt; es un elemento de bloque (block). ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. &lt;img&gt; es un elemento INLINE aunque visualmente ocupe espacio. Otros inline: &lt;span&gt;, &lt;a&gt;, &lt;button&gt;.",
   hint:"¿Una imagen se comporta como un párrafo o como texto dentro de un párrafo?"},

  {topic:"HTML Semántico", type:"multi", trap:false,
   q:"¿Cuáles de estos son elementos INLINE?",
   opts:["&lt;span&gt;","&lt;div&gt;","&lt;a&gt;","&lt;img&gt;","&lt;section&gt;","&lt;p&gt;"],
   ans:[0,2,3], exp:"Inline: span, a, img, button, strong, em. Block: div, p, section, article, header, footer, h1-h6.",
   hint:"Inline = fluye con el texto. Block = ocupa toda la línea."},

  {topic:"HTML Semántico", type:"single", trap:false,
   q:"¿Cuál es la diferencia entre &lt;strong&gt; y &lt;b&gt;?",
   opts:["No hay diferencia","&lt;strong&gt; tiene significado semántico (importancia); &lt;b&gt; es solo visual","&lt;b&gt; es semántico; &lt;strong&gt; es solo visual","&lt;strong&gt; solo funciona en formularios"],
   ans:[1], exp:"&lt;strong&gt; indica importancia semántica (los lectores de pantalla lo enfatizan). &lt;b&gt; es solo negrita visual sin significado.",
   hint:"¿Los lectores de pantalla para personas con discapacidad visual leen diferente &lt;strong&gt; y &lt;b&gt;?",
   image:{type:"code", content:"<!-- Semántico -->\n<strong>¡Atención!</strong>\n\n<!-- Solo visual -->\n<b>Texto en negrita</b>"}},

  // ── Formularios HTML ────────────────────────────────────
  {topic:"Formularios HTML", type:"single", trap:true,
   q:"Enviar contraseñas mediante method='GET' en un formulario es seguro. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. GET manda los datos en la URL (visible en historial, logs del servidor). Las contraseñas SIEMPRE deben ir por POST en el body.",
   hint:"¿Dónde aparecen los datos de un formulario GET?"},

  {topic:"Formularios HTML", type:"single", trap:false,
   q:"¿Dónde envía los datos un formulario con method='GET'?",
   opts:["En el body de la request","En los headers HTTP","En la URL como query params","Cifrado automáticamente"],
   ans:[2], exp:"GET adjunta los datos a la URL (?usuario=Juan&clave=123). POST los envía en el body, sin exponerlos en la URL.",
   hint:"¿Viste alguna vez una URL con ? y = después de hacer una búsqueda?",
   image:{type:"code", content:"<!-- GET: datos en la URL -->\n<form method=\"GET\" action=\"/buscar\">\n  <input name=\"q\" />\n  <!-- URL resultante: /buscar?q=valor -->\n</form>\n\n<!-- POST: datos en el body -->\n<form method=\"POST\" action=\"/login\">\n  <input type=\"password\" name=\"pass\" />\n  <!-- URL: /login (sin datos visibles) -->\n</form>"}},

  // ── CSS Especificidad ───────────────────────────────────
  {topic:"CSS Especificidad", type:"single", trap:false,
   q:"Dado este CSS, ¿qué color tendrá el elemento?",
   opts:["Azul (.titulo)","Verde (p)","Rojo (#titulo)","Depende del orden en el CSS"],
   ans:[2], exp:"Especificidad: #id > .clase > elemento. #titulo SIEMPRE gana sin importar el orden en que aparezcan.",
   hint:"¿Quién tiene mayor especificidad: ID, clase o elemento?",
   image:{type:"code", content:"#titulo { color: red; }\n.titulo  { color: blue; }\np        { color: green; }"}},

  {topic:"CSS Especificidad", type:"single", trap:true,
   q:"Un selector de clase (.clase) siempre gana sobre un selector de ID (#id). ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. #id tiene MAYOR especificidad que .clase. Para que .clase gane necesitarías !important.",
   hint:"Recordá la jerarquía: !important > inline > #id > .clase > elemento"},

  {topic:"CSS Especificidad", type:"multi", trap:false,
   q:"¿Cuál es el orden correcto de especificidad CSS, de MAYOR a MENOR?",
   opts:["!important","Estilos inline (style='')","Selectores #id","Selectores .clase","Selectores de elemento (p, div)"],
   ans:[0,1,2,3,4], exp:"Orden exacto: !important > inline > #id > .clase > elemento. ¡Todos están en el orden correcto en la lista!",
   hint:"¡Mirá bien el orden de las opciones antes de responder!"},

  // ── CSS Box Model ────────────────────────────────────────
  {topic:"CSS Box Model", type:"single", trap:false,
   q:"¿Cuál es el ancho REAL que ocupa este elemento en pantalla (box-model por defecto)?",
   opts:["200px","240px","244px","222px"],
   ans:[2], exp:"Ancho real = content(200) + padding-left(20) + padding-right(20) + border-left(2) + border-right(2) = 244px. Con box-sizing: border-box sería 200px.",
   hint:"El box-model por defecto (content-box) suma todo: content + padding + border",
   image:{type:"code", content:"width:   200px;\npadding: 20px;   /* todos los lados */\nborder:  2px solid black;\n\n/* Ancho total = ??? */"}},

  {topic:"CSS Box Model", type:"single", trap:true,
   q:"El margin de un elemento tiene el color de fondo (background-color) del elemento. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. El margin es EXTERIOR y transparente. El padding sí toma el background-color del elemento.",
   hint:"¿El margin está dentro o fuera del elemento?"},

  {topic:"CSS Box Model", type:"single", trap:false,
   q:"¿Qué hace box-sizing: border-box?",
   opts:["Elimina el border del elemento","Hace que width incluya padding y border (no solo el content)","Agrega un borde automático","Cambia el modelo de margen"],
   ans:[1], exp:"Con border-box, si ponés width:200px el elemento mide 200px en total (el contenido se reduce para acomodar padding y border).",
   hint:"¿Qué 'incluye dentro' de la caja este valor?",
   image:{type:"code", content:"/* content-box (por defecto) */\n.caja { width: 200px; padding: 20px; }\n/* Ancho real: 240px */\n\n/* border-box */\n.caja { box-sizing: border-box;\n         width: 200px; padding: 20px; }\n/* Ancho real: 200px */"}},

  // ── CSS Flexbox ─────────────────────────────────────────
  {topic:"CSS Flexbox", type:"single", trap:true,
   q:"En Flexbox, align-items alinea los elementos en el EJE PRINCIPAL. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. align-items alinea en el eje SECUNDARIO (cross axis). El eje principal lo controla justify-content. ¡Trampa clásica!",
   hint:"justify-content ↔ eje principal. align-items ↔ eje..."},

  {topic:"CSS Flexbox", type:"multi", trap:false,
   q:"¿Cuáles de estas afirmaciones sobre Flexbox son CORRECTAS?",
   opts:["Es un sistema de layout de 1 dimensión","justify-content controla el eje principal","align-items controla el eje secundario","Grid es mejor para layouts de 2 dimensiones","Se activa con display: flex"],
   ans:[0,1,2,3,4], exp:"¡Todas son correctas! Flexbox = 1D, Grid = 2D. justify-content = eje principal, align-items = eje secundario.",
   hint:"¿Puede Flexbox manejar filas Y columnas simultáneamente como Grid?"},

  {topic:"CSS Flexbox", type:"single", trap:false,
   q:"¿Qué hace flex: 1 en un elemento hijo de un flex container?",
   opts:["Establece el orden del elemento","Hace que el elemento ocupe todo el espacio disponible (crecimiento proporcional)","Desactiva flexbox para ese elemento","Establece un margen de 1px"],
   ans:[1], exp:"flex: 1 es shorthand de flex-grow: 1, flex-shrink: 1, flex-basis: 0. Hace que el elemento crezca para ocupar el espacio disponible.",
   hint:"Si todos los hijos tienen flex: 1, ¿cómo se distribuye el espacio?",
   image:{type:"code", content:".container { display: flex; }\n\n.sidebar { flex: 0 0 250px; } /* fijo 250px */\n.main    { flex: 1; }          /* ocupa el resto */"}},

  // ── DOM ─────────────────────────────────────────────────
  {topic:"DOM", type:"single", trap:true,
   q:"El DOM y el HTML son exactamente lo mismo. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. El HTML es el texto del archivo. El DOM es la representación en MEMORIA (árbol de objetos) que construye el navegador. JS manipula el DOM.",
   hint:"¿Qué pasa con el DOM cuando JavaScript agrega un elemento que no estaba en el HTML?"},

  {topic:"DOM", type:"single", trap:false,
   q:"¿Qué devuelve document.querySelectorAll('.item')?",
   opts:["El primer elemento con clase item","Un array vacío si no hay elementos","Una NodeList con TODOS los elementos que coinciden","Un elemento o null"],
   ans:[2], exp:"querySelectorAll devuelve NodeList con TODOS los matches. querySelector devuelve solo el primero (o null si no existe). NodeList no es un array pero se puede iterar.",
   hint:"¿'All' en el nombre te da alguna pista?"},

  {topic:"DOM", type:"multi", trap:false,
   q:"¿Cuáles de estas afirmaciones sobre innerHTML y textContent son CORRECTAS?",
   opts:["innerHTML interpreta y renderiza etiquetas HTML","textContent trata todo como texto plano","innerHTML puede ser un vector de ataque XSS","textContent interpreta HTML igual que innerHTML"],
   ans:[0,1,2], exp:"textContent NO interpreta HTML, muestra el texto tal cual. innerHTML sí parsea HTML y puede ser peligroso con datos del usuario (XSS).",
   hint:"¿Qué pasa si hacés elemento.innerHTML = userInput?",
   image:{type:"code", content:"// ⚠️ PELIGROSO con datos del usuario\nel.innerHTML = userInput; // XSS!\n\n// ✅ Seguro\nel.textContent = userInput;\n\n// Ejemplo de ataque:\n// userInput = \"<img src=x onerror=alert('hacked')>\""}},

  {topic:"DOM", type:"single", trap:true,
   q:"Si no usás preventDefault() en el evento submit, el formulario no hace nada. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. Sin preventDefault(), el formulario hace su comportamiento DEFAULT: recarga la página (o navega a la action del form). preventDefault() evita ese comportamiento.",
   hint:"'Default' = comportamiento por defecto. ¿Qué hace un formulario por defecto?"},

  // ── JavaScript ──────────────────────────────────────────
  {topic:"JavaScript", type:"single", trap:false,
   q:"¿Qué imprime este código?",
   opts:["5 y 6","5 y 7","6 y 7","6 y 8"],
   ans:[1], exp:"x++ devuelve el valor ANTES de incrementar (imprime 5, x queda en 6). ++x incrementa PRIMERO y devuelve el nuevo valor (x pasa a 7, imprime 7).",
   hint:"Postfijo (x++) = usa y luego incrementa. Prefijo (++x) = incrementa y luego usa.",
   image:{type:"code", content:"let x = 5;\nconsole.log(x++); // ???\nconsole.log(++x); // ???"}},

  {topic:"JavaScript", type:"single", trap:true,
   q:"=== y == son equivalentes en JavaScript. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. === es estricto (compara tipo Y valor). == hace coerción de tipos antes de comparar ('5' == 5 → true, '5' === 5 → false). Siempre usá ===.",
   hint:"¿'5' (string) y 5 (number) son iguales en tipo?",
   image:{type:"code", content:"'5' == 5    // true  (coerción de tipos)\n'5' === 5   // false (distinto tipo)\n\nnull == undefined   // true\nnull === undefined  // false\n\n0 == false   // true\n0 === false  // false"}},

  {topic:"JavaScript", type:"single", trap:false,
   q:"¿Qué es el 'hoisting' en JavaScript?",
   opts:["Un error de JavaScript","El proceso por el que declaraciones (var, function) son movidas al inicio de su scope antes de ejecutar","Una forma de importar módulos","Un tipo de bucle especial"],
   ans:[1], exp:"Hoisting = el motor JS mueve las declaraciones al inicio del scope. var y funciones declaradas se 'elevan'. let/const también, pero quedan en la Temporal Dead Zone.",
   hint:"'Hoist' = elevar. ¿Qué se eleva?",
   image:{type:"code", content:"// Por hoisting, esto funciona:\nconsole.log(x); // undefined (no error)\nvar x = 5;\n\n// Pero esto falla:\nconsole.log(y); // ReferenceError\nlet y = 5;     // let no es 'elevada' igual"}},

  {topic:"JavaScript", type:"single", trap:false,
   q:"¿Cuál es la diferencia entre var, let y const?",
   opts:["No hay diferencia práctica","var tiene scope de función; let y const tienen scope de bloque y no se pueden redeclarar","let es igual a var","const siempre debe ser primitivo"],
   ans:[1], exp:"var = scope de función + hoisting + se puede redeclarar. let = scope de bloque + no se puede redeclarar. const = igual que let pero no se puede reasignar.",
   hint:"¿Qué pasa con var dentro de un if? ¿Y con let?"},

  {topic:"JavaScript", type:"single", trap:true,
   q:"const impide modificar las propiedades de un objeto. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. const impide REASIGNAR la variable (no puedes hacer obj = {}), pero sí podés modificar las propiedades del objeto (obj.nombre = 'otro').",
   hint:"const = la referencia no cambia. ¿El objeto en sí puede cambiar?",
   image:{type:"code", content:"const persona = { nombre: 'Ana' };\n\npersona.nombre = 'Luis'; // ✅ OK\npersona.edad = 25;       // ✅ OK\n\npersona = {};            // ❌ TypeError"}},

  // ── Node / Express ──────────────────────────────────────
  {topic:"Node / Express", type:"single", trap:true,
   q:"Express.js es un lenguaje de programación backend. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. Express es un FRAMEWORK de Node.js. Node.js es el entorno de ejecución. El lenguaje es JavaScript.",
   hint:"¿Express es algo que instalás con npm o algo que ya viene con el sistema?"},

  {topic:"Node / Express", type:"multi", trap:false,
   q:"En una ruta de Express, ¿cuáles de estas afirmaciones son CORRECTAS?",
   opts:["req contiene los datos enviados por el cliente","res se usa para enviar la respuesta","app.get() define una ruta para el método GET","req.body contiene parámetros de la URL","res.json() envía respuesta en formato JSON"],
   ans:[0,1,2,4], exp:"req.body tiene los datos del body (POST/PUT). Los parámetros de URL van en req.params o req.query, NO en req.body.",
   hint:"¿req.params, req.query y req.body son lo mismo?",
   image:{type:"code", content:"app.get('/users/:id', (req, res) => {\n  // /users/42?activo=true\n  req.params.id;    // '42' (URL param)\n  req.query.activo; // 'true' (query param)\n  req.body;         // {} (vacío en GET)\n  res.json({ ok: true });\n});"}},

  {topic:"Node / Express", type:"single", trap:false,
   q:"¿Cuál de estas es una sintaxis JSON VÁLIDA?",
   opts:["Solo la opción A","Solo la opción B","Ambas son válidas","Ninguna es válida"],
   ans:[0], exp:"En JSON las claves DEBEN ir entre comillas dobles. La opción B es un objeto JavaScript válido pero NO es JSON válido.",
   hint:"¿JSON permite claves sin comillas?",
   image:{type:"code", content:"// Opción A:\n{ \"nombre\": \"Juan\", \"edad\": 25 }\n\n// Opción B:\n{ nombre: \"Juan\", edad: 25 }"}},

  {topic:"Node / Express", type:"single", trap:false,
   q:"¿Para qué sirve el middleware en Express?",
   opts:["Es un tipo de base de datos","Son funciones que se ejecutan entre el request y el response, pudiendo modificarlos","Es el archivo de configuración de Express","Es el equivalente a los controllers"],
   ans:[1], exp:"Middleware = funciones (req, res, next) que se ejecutan en cadena. Sirven para logging, autenticación, parsear el body, manejo de errores, etc.",
   hint:"'Middle' = en el medio. ¿Entre qué y qué?",
   image:{type:"code", content:"// Middleware de logging\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.url}`);\n  next(); // pasa al siguiente middleware\n});\n\n// Middleware incorporado\napp.use(express.json()); // parsea body JSON"}},

  // ── Responsive / Media Queries ──────────────────────────
  {topic:"Responsive / Media Queries", type:"single", trap:true,
   q:"Responsive Design significa crear una aplicación móvil nativa. ¿Verdadero o Falso?",
   opts:["Verdadero","Falso"],
   ans:[1], exp:"FALSO. Responsive Design = que el sitio web se adapta a distintos tamaños de pantalla usando CSS. No tiene nada que ver con apps nativas.",
   hint:"¿Responsive Design requiere Swift, Kotlin o algo así?"},

  {topic:"Responsive / Media Queries", type:"single", trap:false,
   q:"¿Qué hace esta media query?",
   opts:["Oculta .menu en pantallas mayores a 768px","Oculta .menu en pantallas de 768px o menos","Muestra .menu solo en desktop","Aplica solo en impresión"],
   ans:[1], exp:"max-width: 768px = aplica cuando el ancho es 768px o MENOS (móviles y tablets chicas). Para desktop usarías min-width.",
   hint:"max-width = 'como máximo X de ancho'. ¿Cuándo aplica?",
   image:{type:"code", content:"@media (max-width: 768px) {\n  .menu { display: none; }\n}\n/* ¿Cuándo se oculta .menu? */"}},
];
