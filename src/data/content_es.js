// ─── TRADUÇÕES ES — sobrepõe strings do content.js ───────────────────────────

export const M0_PUZZLE_ES = {
  nodes: [
    { id:"source",    label:"Fuente de Log",          sub:"Endpoint · Firewall · Cloud · SaaS" },
    { id:"collect",   label:"Recolección / Ingesta",  sub:"Forwarder · BindPlane · Feed · Webhook" },
    { id:"secops",    label:"Google SecOps",            sub:"Plataforma SIEM/SOAR Cloud native" },
    { id:"parser",    label:"Parser → UDM",             sub:"Normaliza raw logs al esquema UDM" },
    { id:"rules",     label:"Reglas YARA-L",            sub:"Rules Engine detecta patrones en eventos UDM" },
    { id:"detection", label:"Detection / Alerta",       sub:"Aparece en la cola de triaje del SOC" },
    { id:"invest",    label:"Investigación",             sub:"Cases & Alerts · Graph Investigator · Search" },
    { id:"soar",      label:"SOAR Playbook",             sub:"Orquestación y automatización de respuesta" },
    { id:"response",  label:"Respuesta Automática",      sub:"Block IP · Isolate · Ticket · Notify" },
  ],
  distractors: ["Chronicle Forwarder v1","Syslog directo","SOAR Connector","Dashboard Widget"],
  explanation: [
    { node:"Recolección / Ingesta", info:"Google SecOps soporta múltiples métodos: Forwarder/BindPlane Agent (on-prem), Feeds (pull de APIs SaaS y buckets cloud), Webhooks HTTPS (push desde la fuente), Pub/Sub (GCP nativo) y Connectors SOAR (Content Hub)." },
    { node:"Parser → UDM",          info:"Los Parsers normalizan raw logs de cualquier fabricante al esquema UDM. Google mantiene +500 parsers listos. Puedes crear parsers personalizados (CBN/ANTLR). SecOps guarda ambos: raw log y UDM normalizado." },
    { node:"Detection / Alerta",    info:"Cuando una regla YARA-L coincide con eventos UDM, el Rules Engine genera una Detection. Aparece en la cola del SOC con contexto de entidad, severidad y mapeo MITRE ATT&CK." },
    { node:"Investigación",         info:"Paso 4 del recorrido oficial: Cases & Alerts agrupan detecciones relacionadas. El Graph Investigator visualiza el quién/qué/cuándo. La búsqueda UDM permite investigar hasta 12 meses de historial." },
    { node:"SOAR Playbook",         info:"Paso 5: tras la investigación, el SOAR ejecuta playbooks de respuesta automática configurados en el Playbook Designer. Integra con herramientas externas vía Content Hub (Jira, PagerDuty, firewalls, etc.)." },
  ],
};

export const M1_LESSONS_ES = [
  { id:1, title:"¿Qué es un SIEM?",
    cards:[
      { q:"¿Qué significa SIEM?",                  a:"Security Information and Event Management — sistema que recopila, correlaciona y analiza logs de seguridad en tiempo real." },
      { q:"¿Por qué existe un SIEM?",               a:"Sin él, un analista tendría que abrir decenas de consolas diferentes. El SIEM centraliza todo en un único lugar y una línea de tiempo unificada." },
      { q:"¿Qué es Google SecOps?",                 a:"Google Security Operations (Google SecOps) es una plataforma SIEM/SOAR Cloud native de Google, completamente administrada, sin necesidad de infraestructura propia." },
      { q:"¿Cuál es la retención de logs predeterminada en Google SecOps?", a:"Todos los tiers de Google SecOps incluyen 12 meses de hot data retention. El modelo de licenciamiento se basa en volumen de ingesta (TB/año) — no por EPS ni por usuario." },
      { q:"¿Google SecOps tiene inteligencia artificial?", a:"Sí. Tiene agentes de IA integrados: Gemini para investigación autónoma, Triage Agent para priorizar alertas y AI-powered detections con reglas sugeridas automáticamente." },
      { q:"¿Qué almacena Google SecOps?",           a:"Cada evento en dos formatos: el raw log original y el registro normalizado en el esquema UDM (Unified Data Model)." },
    ],
    challenges:[
      { sentence:"Google SecOps es una plataforma SIEM/____ Cloud native de Google.", blank:"SOAR", options:["SOAR","DNS","WAF","EDR"] },
      { statement:"La retención predeterminada de hot data en Google SecOps Standard es de 30 días.", answer:false },
      { sentence:"Google SecOps tiene agentes de ____ integrados, como Gemini.", blank:"IA", options:["IA","firewall","VLAN","parser"] },
      { sentence:"El SIEM centraliza logs para que el analista no tenga que abrir decenas de ____ diferentes.", blank:"consolas", options:["consolas","archivos","usuarios","reglas"] },
    ]},
  { id:2, title:"Normalización y UDM",
    cards:[
      { q:"¿Qué es la normalización de logs?",     a:"Convertir logs de formatos diferentes (Palo Alto, Windows, Linux) a un esquema común — el UDM (Unified Data Model)." },
      { q:"¿Por qué normalizar?",                  a:"Sin normalización necesitarías una regla diferente por fabricante. Con UDM, una regla cubre todos los productos." },
      { q:"¿Qué es un Parser?",                    a:"Componente que lee el raw log de un producto y lo convierte a campos UDM. Google mantiene +500 parsers listos para los principales fabricantes." },
      { q:"¿Cuáles son las secciones principales del UDM?", a:"metadata (obligatoria), principal, target, network, security_result + src, intermediary, observer, about, extensions. Solo metadata es obligatoria." },
      { q:"¿Qué es un 'raw log'?",                 a:"El log bruto original, exactamente como llegó del producto — antes de ser normalizado. Google SecOps guarda ambos: raw log y UDM normalizado." },
      { q:"¿Qué es el Entity Data Model del UDM?", a:"Modelo de contexto que enriquece eventos UDM con datos de fuentes como Active Directory y LDAP." },
    ],
    challenges:[
      { sentence:"El esquema común usado por Google SecOps para normalizar logs se llama ____.", blank:"UDM", options:["UDM","JSON","YAML","XML"] },
      { sentence:"El componente que convierte el raw log a UDM se llama ____.", blank:"Parser", options:["Parser","Firewall","Agent","Index"] },
      { statement:"Con UDM, la misma regla YARA-L funciona para logs de diferentes fabricantes.", answer:true },
      { sentence:"El campo ____ en UDM define qué otros campos son obligatorios en un evento.", blank:"event_type", options:["event_type","metadata","principal","target"] },
    ]},
  { id:3, title:"Arquitectura Google SecOps",
    cards:[
      { q:"¿Cómo llegan los datos a Google SecOps?", a:"Métodos principales:\n• Forwarders/BindPlane Agent — recolección on-prem (Windows, Linux, firewalls)\n• Feeds — pull de APIs cloud y buckets (GCS, S3, APIs SaaS)\n• Webhooks HTTPS — push desde la fuente\n• Pub/Sub — integración nativa GCP\n• Ingestion API — apps personalizadas\n• Connectors — ingesta de alertas vía SOAR (Content Hub)" },
      { q:"¿Qué es el Rules Engine?",               a:"Motor que ejecuta reglas YARA-L continuamente sobre eventos normalizados y genera detecciones (alertas) cuando se cumplen las condiciones." },
      { q:"¿Qué es una Detection?",                 a:"Alerta generada por el Rules Engine cuando una regla YARA-L coincide con eventos en los logs. Aparece en la cola de triaje del SOC para investigación." },
      { q:"¿Qué es el SOAR y qué hace?",            a:"Security Orchestration, Automation and Response — automatiza respuestas a incidentes vía Playbooks. Puede abrir tickets, bloquear IPs y notificar equipos automáticamente." },
      { q:"¿Qué diferencia a Google SecOps de los SIEMs tradicionales?", a:"Infraestructura Google: 12 meses de hot retention en todos los tiers, licenciamiento por TB/año (no por EPS ni usuario), velocidad de búsqueda petabyte-scale e IA embebida (Gemini)." },
    ],
    challenges:[
      { sentence:"BindPlane es un tipo de ____ que envía logs a Google SecOps.", blank:"Forwarder", options:["Forwarder","Parser","Detection","Playbook"] },
      { sentence:"Cuando una regla YARA-L coincide con eventos, el resultado se llama ____.", blank:"Detection", options:["Detection","Parser","Feed","UDM"] },
      { statement:"El SOAR de Google SecOps puede automatizar respuestas a incidentes vía Playbooks.", answer:true },
      { sentence:"Google SecOps tiene ____ meses de retención de hot data por defecto.", blank:"12", options:["12","3","6","24"] },
    ]},
  { id:4, title:"Paquetes y Licencias",
    cards:[
      { q:"¿Cuántos paquetes ofrece Google SecOps?", a:"Tres: Standard, Enterprise y Enterprise Plus. El precio se basa en volumen de ingesta, no en número de eventos ni usuarios." },
      { q:"¿Qué incluye el paquete Standard?",       a:"Ingesta de datos, detección de amenazas, investigación, respuesta y 12 meses de hot data retention. Licenciado por TB/año de ingesta." },
      { q:"¿Qué agrega Enterprise al Standard?",     a:"Threat intelligence avanzada, UEBA (User and Entity Behavior Analytics), asistencia de IA generativa (Gemini) y SOAR para automatización de respuestas." },
      { q:"¿Qué agrega Enterprise Plus al Enterprise?", a:"Inteligencia completa de Mandiant y VirusTotal, gestión avanzada de pipeline de datos y opciones de almacenamiento extendido." },
      { q:"¿Qué es Google Unified Security?",        a:"Paquete que incluye todo de Enterprise Plus y agrega Chrome Enterprise Premium, Security Command Center y Web Risk." },
      { q:"¿Cómo funciona el modelo de precios de Google SecOps?", a:"Basado en volumen de ingesta (TB/año). Todos los tiers incluyen 12 meses de hot data retention. Diferente de SIEMs tradicionales que cobran por EPS o por usuario." },
    ],
    challenges:[
      { sentence:"Google SecOps tiene ____ paquetes: Standard, Enterprise y Enterprise Plus.", blank:"3", options:["3","2","4","5"] },
      { sentence:"El paquete que incluye UEBA y Gemini AI es ____.", blank:"Enterprise", options:["Enterprise","Standard","Basic","Starter"] },
      { statement:"Enterprise Plus incluye inteligencia completa de Mandiant y VirusTotal.", answer:true },
      { sentence:"El modelo de precios de Google SecOps se basa en volumen de ____.", blank:"ingesta", options:["ingesta","usuarios","eventos","reglas"] },
    ]},
  { id:5, title:"Métodos de Ingesta",
    cards:[
      { q:"¿Cuáles son los métodos de ingesta de Google SecOps?", a:"6 métodos principales:\n1. BindPlane Agent — on-prem (Windows, Linux, firewalls)\n2. Feed Pull — pull de cloud/SaaS (GCS, S3, APIs)\n3. Webhook HTTPS — la fuente envía al endpoint de SecOps (push)\n4. Pub/Sub — integración nativa GCP\n5. Ingestion API directa — apps personalizadas\n6. Forwarder — legado (usa BindPlane Agent en nuevos proyectos)" },
      { q:"¿Qué es el BindPlane Agent y cuándo usarlo?", a:"Pipeline de telemetría moderno para entornos on-prem. Úsalo para: firewalls (FortiGate), servidores Windows/Linux. Es el reemplazo recomendado del Forwarder legado. Administrado vía BindPlane OP. Soporta OpenTelemetry." },
      { q:"¿Qué es un Feed en Google SecOps?",        a:"Mecanismo de ingesta configurado en la UI de SecOps. Tipos:\n• Pull: SecOps obtiene activamente (GCS, S3, Azure Blob, APIs como Okta, Microsoft 365)\n• Push/Webhook: la fuente envía al endpoint HTTPS\n• Pub/Sub: suscripción nativa GCP\n• Amazon Data Firehose: streaming AWS" },
      { q:"¿Cómo funciona el Webhook en Google SecOps?", a:"La fuente envía logs al endpoint HTTPS de SecOps (push). Límites: 4 MB por request, 15.000 QPS por instancia. Auth vía API key en el header." },
      { q:"¿Cuál es la diferencia entre Forwarder y BindPlane Agent?", a:"Forwarder: componente legado, aún funcional pero DEPRECADO (EOL enero 2027).\nBindPlane Agent: reemplazo moderno con soporte OpenTelemetry, gestión centralizada vía BindPlane OP. Los nuevos proyectos deben usar BindPlane Agent." },
    ],
    challenges:[
      { sentence:"Para nuevos proyectos de recolección on-premises, el método moderno recomendado es ____.", blank:"BindPlane Agent", options:["BindPlane Agent","Forwarder","Webhook","Pub/Sub"] },
      { statement:"El Webhook en Google SecOps permite que la fuente envíe logs directamente al endpoint HTTPS.", answer:true },
      { sentence:"Para GCP, el método nativo de ingesta sin BindPlane es vía ____.", blank:"Pub/Sub", options:["Pub/Sub","BindPlane Agent","Webhook","Forwarder"] },
      { statement:"El Forwarder de Google SecOps es el método recomendado para nuevas implementaciones.", answer:false },
    ]},
  { id:6, title:"Investigación: Cases, SIEM Search & Graph",
    cards:[
      { q:"¿Qué son los Cases en Google SecOps?",  a:"Los Cases agrupan Detections relacionadas para investigación colaborativa. Contienen alertas, evidencia, líneas de tiempo, mapeo MITRE ATT&CK y ejecución de playbooks." },
      { q:"¿Cómo funciona SIEM Search (UDM Search)?", a:"Permite consultar todos los eventos normalizados a UDM. Devuelve resultados de hasta 12 meses de hot data. Sintaxis: campo = 'valor' | campo != 'valor'." },
      { q:"¿Qué es el Graph Investigator?",        a:"Herramienta visual que muestra relaciones entre entidades (usuarios, IPs, hosts, dominios) conectadas por eventos UDM." },
      { q:"¿Qué es un UDM Event?",                 a:"Cualquier log normalizado en formato UDM, almacenado en Google SecOps. Tiene un event_type (NETWORK_CONNECTION, USER_LOGIN, PROCESS_LAUNCH, etc.)." },
    ],
    challenges:[
      { sentence:"Los Cases en Google SecOps agrupan ____ relacionadas para investigación.", blank:"Detections", options:["Detections","Parsers","Feeds","Dashboards"] },
      { statement:"UDM Search permite consultar eventos de hasta 12 meses de historial.", answer:true },
      { sentence:"El ____ visualiza relaciones entre entidades conectadas por eventos UDM.", blank:"Graph Investigator", options:["Graph Investigator","Rules Engine","SOAR","Feed Manager"] },
    ]},
  { id:7, title:"Content Hub, SOAR & Respuesta",
    cards:[
      { q:"¿Qué es Content Hub?",                  a:"Un marketplace de contenido de seguridad pre-construido para Google SecOps: reglas de detección, playbooks, extensiones de parser, dashboards y conectores para herramientas de terceros." },
      { q:"¿Cómo responde SOAR a los incidentes?", a:"Vía Playbooks — flujos de respuesta automatizados que pueden: poner en cuarentena endpoints, bloquear IPs en firewalls, crear tickets en Jira, notificar por Slack/Teams, enriquecer IOCs vía VirusTotal/Mandiant." },
      { q:"¿Qué es un Playbook?",                  a:"Flujo de trabajo automatizado configurado en el Playbook Designer del SOAR. Consiste en pasos (acciones) que se ejecutan secuencialmente o en paralelo." },
      { q:"¿Qué es un SOAR Connector?",            a:"Integración que permite al SOAR interactuar con herramientas externas (firewalls, sistemas de tickets, EDR, etc.)." },
    ],
    challenges:[
      { sentence:"Content Hub contiene ____ pre-construido para Google SecOps.", blank:"contenido de seguridad", options:["contenido de seguridad","raw logs","esquemas UDM","solo parsers"] },
      { statement:"Los Playbooks de SOAR solo pueden ser activados manualmente por un analista.", answer:false },
      { sentence:"Un ____ de SOAR integra con herramientas externas como firewalls y sistemas de tickets.", blank:"Connector", options:["Connector","Parser","Feed","Rule"] },
    ]},
];

export const M1_FINAL_CHALLENGE_ES = [
  { type:"complete", sentence:"Google SecOps es una plataforma SIEM/____ Cloud native.", blank:"SOAR", options:["SOAR","EDR","WAF","NAC"] },
  { type:"truefalse", statement:"El Forwarder de Google SecOps está DEPRECADO con EOL en enero de 2027.", answer:true },
  { type:"complete", sentence:"El componente que normaliza raw logs a UDM se llama ____.", blank:"Parser", options:["Parser","Agent","Rule","Feed"] },
  { type:"complete", sentence:"Google SecOps incluye ____ meses de hot data retention en todos los tiers.", blank:"12", options:["12","6","3","24"] },
  { type:"truefalse", statement:"Con UDM, la misma regla YARA-L funciona para logs de diferentes fabricantes.", answer:true },
  { type:"complete", sentence:"El asistente de IA de Google SecOps se llama ____.", blank:"Gemini", options:["Gemini","ChatGPT","Watson","Copilot"] },
];

export const M2_CHALLENGE_ES = [
  { type:"complete", sentence:"El comando principal usado en YARA-L para detectar eventos repetidos en una ventana de tiempo es ____.", blank:"match", options:["match","condition","outcome","events"] },
  { type:"truefalse", statement:"En un evento UDM, el campo 'principal' representa el objetivo de la acción.", answer:false },
  { type:"complete", sentence:"El campo UDM que almacena el nombre del proceso es ____.", blank:"principal.process.file.full_path", options:["principal.process.file.full_path","target.hostname","network.ip_protocol","security_result.action"] },
  { type:"complete", sentence:"El event_type UDM para un inicio de sesión de usuario es ____.", blank:"USER_LOGIN", options:["USER_LOGIN","NETWORK_CONNECTION","PROCESS_LAUNCH","FILE_COPY"] },
  { type:"truefalse", statement:"Un evento UDM puede tener simultáneamente los campos 'principal' y 'target'.", answer:true },
  { type:"complete", sentence:"El campo UDM que almacena la IP de destino de red es ____.", blank:"target.ip", options:["target.ip","principal.ip","network.direction","security_result.action"] },
];

export const M3_LESSONS_ES = [
  { id:1, title:"Anatomía de una Regla YARA-L",
    cards:[
      { q:"¿Qué es YARA-L?",                       a:"YARA-L (Yet Another Rule Language - Logs) es el lenguaje de detección de Google SecOps. Las reglas se ejecutan continuamente contra eventos UDM normalizados y generan Detections cuando se cumplen las condiciones." },
      { q:"¿Cuáles son las secciones obligatorias de una regla YARA-L?", a:"rule (nombre), meta (metadatos), events (qué buscar), condition (cuándo alertar). Opcionales: match (agrupación), outcome (variables para la alerta), options (configuración de rendimiento)." },
      { q:"¿Qué contiene la sección 'meta'?",       a:"Metadatos de la regla: author, description, severity (LOW/MEDIUM/HIGH/CRITICAL), priority, tags MITRE ATT&CK (technique, tactic) y otros campos de documentación." },
      { q:"¿Qué hace la sección 'events'?",         a:"Define qué eventos UDM buscar. Usa sintaxis de variables: $e.campo = 'valor'. Múltiples variables ($e1, $e2) pueden representar diferentes eventos para correlacionar." },
    ],
    challenges:[
      { sentence:"En YARA-L, la sección que define las condiciones de coincidencia se llama ____.", blank:"condition", options:["condition","match","events","outcome"] },
      { statement:"La sección 'meta' en YARA-L es obligatoria para que la regla compile.", answer:false },
      { sentence:"En YARA-L, los eventos UDM se referencian usando variables ____ como $e.", blank:"de evento", options:["de evento","string","network","alert"] },
    ]},
  { id:2, title:"Variables de Evento",
    cards:[
      { q:"¿Cómo se declaran las variables de evento en YARA-L?", a:"Usando el prefijo $. Ejemplo: $e.metadata.event_type = 'USER_LOGIN'. Múltiples variables ($e1, $e2) correlacionan diferentes eventos." },
      { q:"¿Cómo filtrar por tipo de evento?",     a:"$e.metadata.event_type = 'USER_LOGIN'\nTipos comunes: USER_LOGIN, NETWORK_CONNECTION, PROCESS_LAUNCH, FILE_COPY, NETWORK_DNS, STATUS_UPDATE." },
      { q:"¿Cómo comparar dos campos en eventos diferentes?", a:"Usando la misma variable en ambos eventos:\n$e1.principal.user.userid = $e2.target.user.userid\nEsto asegura que el usuario del evento 1 sea el mismo que en el evento 2." },
      { q:"¿Qué es nocase en YARA-L?",             a:"Un modificador que hace la comparación de cadenas insensible a mayúsculas. Ejemplo: $e.principal.hostname = /admin/ nocase." },
    ],
    challenges:[
      { sentence:"En YARA-L, las variables de evento se declaran con el prefijo ____.", blank:"$", options:["$","#","%","@"] },
      { statement:"En YARA-L, puedes usar la misma variable en múltiples eventos para correlacionarlos.", answer:true },
      { sentence:"El modificador que hace la comparación de cadenas insensible a mayúsculas es ____.", blank:"nocase", options:["nocase","regex","lowercase","ignore"] },
    ]},
  { id:3, title:"Match y Ventanas de Tiempo",
    cards:[
      { q:"¿Qué hace la sección 'match'?",         a:"Define cómo se agrupan los eventos para generar una única Detection. Ejemplo: match $user over 5m — agrupa todos los eventos del mismo usuario en 5 minutos en una alerta." },
      { q:"¿Qué es una ventana de tiempo en YARA-L?", a:"El período durante el cual el Rules Engine busca eventos coincidentes. Definido con 'over': 5m, 1h, 24h. Los eventos fuera de la ventana no se correlacionan." },
      { q:"¿Qué es el operador #count?",           a:"Cuenta el número de eventos coincidentes. Ejemplo: #events > 10 en la sección condition significa que la regla solo se activa si hay más de 10 eventos coincidentes." },
      { q:"¿Cómo detectar fallos repetidos?",      a:"Combinar match (agrupar por usuario/IP) + ventana de tiempo + condición #count:\nevents: $e.metadata.event_type = 'USER_LOGIN' $e.security_result.action = 'BLOCK'\nmatch: $e.principal.user.userid over 5m\ncondition: #e > 5" },
    ],
    challenges:[
      { sentence:"En YARA-L, la sección que agrupa eventos para una única Detection es ____.", blank:"match", options:["match","condition","events","outcome"] },
      { statement:"La ventana de tiempo en YARA-L se define usando la palabra clave 'within'.", answer:false },
      { sentence:"Para contar el número de eventos en una regla YARA-L, usa el operador ____.", blank:"#count", options:["#count","$count","@total","count()"] },
    ]},
  { id:4, title:"Condition y Operadores",
    cards:[
      { q:"¿Qué define la sección 'condition'?",   a:"La lógica que determina cuándo se genera una Detection. Usa variables de evento ($e), operadores de conteo (#e) y operadores booleanos (and, or, not)." },
      { q:"¿Cuáles son los principales operadores YARA-L?", a:"= (igual), != (distinto), > < >= <= (comparación numérica), =~ (regex), and, or, not, nocase. También: re.regex() para patrones complejos, strings.concat() para concatenación." },
      { q:"¿Cómo funciona la sección 'outcome'?",  a:"Define variables calculadas e incluidas en la Detection. Ejemplo: $risk_score = max(0.0, if($e.network.sent_bytes > 1000000, 50.0, 10.0)). Usado por risk analytics y SOAR." },
      { q:"¿Qué es una Reference List en YARA-L?", a:"Una lista de valores (IPs, dominios, usuarios) usable en reglas. Ejemplo: $e.principal.ip in %malicious_ips_list. Las listas se actualizan desde la UI sin cambiar la regla." },
    ],
    challenges:[
      { sentence:"En YARA-L, el operador para verificar si un valor coincide con un regex es ____.", blank:"=~", options:["=~","~~","regex:","match:"] },
      { statement:"La sección 'outcome' en YARA-L permite calcular variables incluidas en la Detection.", answer:true },
      { sentence:"Una lista de valores externos usada en reglas YARA-L se llama ____.", blank:"Reference List", options:["Reference List","Data Table","Variable Set","Match Group"] },
    ]},
];

export const M3_SKIP_CHALLENGE_ES = [
  { type:"complete", sentence:"En YARA-L, la sección que define qué eventos UDM buscar es ____.", blank:"events", options:["events","condition","match","outcome"] },
  { type:"truefalse", statement:"La sección 'match' en YARA-L es obligatoria en cada regla.", answer:false },
  { type:"complete", sentence:"El operador para contar eventos en YARA-L es ____.", blank:"#", options:["#","$","@","%"] },
  { type:"complete", sentence:"En YARA-L, la ventana de tiempo se define con la palabra clave ____.", blank:"over", options:["over","within","during","for"] },
  { type:"truefalse", statement:"Una Reference List puede usarse en reglas YARA-L para verificar si un valor pertenece a una lista externa.", answer:true },
];

export const M5_LESSONS_ES = [
  { id:1, title:"YARA-L outcome y risk_score",
    cards:[
      { q:"¿Para qué sirve la sección 'outcome'?", a:"Para calcular variables adjuntas a la Detection. El uso más común es definir $risk_score — un entero de 0-100 que alimenta el risk analytics de Google SecOps. Puede usar if(), max(), min() y operaciones matemáticas." },
      { q:"¿Cómo usa el sistema el risk_score?",   a:"Google SecOps lo usa para calcular automáticamente puntuaciones de riesgo por entidad (usuarios, IPs, hosts). Las entidades con risk_score acumulado aparecen destacadas en dashboards." },
      { q:"¿Puede outcome referenciar eventos de la sección events?", a:"Sí. Ejemplo: $bytes = $e.network.sent_bytes. La variable de outcome captura un valor del evento coincidente y lo propaga a la Detection para SOAR y dashboards." },
    ],
    challenges:[
      { sentence:"En YARA-L, la sección usada para calcular variables en la Detection es ____.", blank:"outcome", options:["outcome","result","condition","match"] },
      { statement:"La variable $risk_score en el outcome de YARA-L alimenta el risk analytics de Google SecOps.", answer:true },
    ]},
  { id:2, title:"Reference Lists y Data Tables",
    cards:[
      { q:"¿Qué es una Reference List?",           a:"Un conjunto de valores (IPs, dominios, hashes, usernames) mantenido en la UI de SecOps. Se usa en reglas con el operador 'in': $e.principal.ip in %blocklist_ips. Se actualiza sin cambiar la regla." },
      { q:"¿Qué es una Data Table?",               a:"Una tabla multi-columna importada en SecOps (CSV). Permite enriquecer eventos con contexto adicional. Ejemplo: tabla que mapea IDs de activos a niveles de criticidad." },
      { q:"¿Cuál es la diferencia entre Reference List y Data Table?", a:"Reference List = una columna (un tipo de valor). Data Table = múltiples columnas (contexto más rico). Usa Reference List para blocklists simples. Usa Data Table cuando necesitas unir campos de evento con contexto externo." },
    ],
    challenges:[
      { sentence:"En YARA-L, para verificar si una IP pertenece a una lista externa, usa el operador ____.", blank:"in", options:["in","=~","contains","match"] },
      { statement:"Una Data Table en Google SecOps puede tener múltiples columnas y usarse para enriquecer eventos.", answer:true },
    ]},
  { id:3, title:"Risk Analytics",
    cards:[
      { q:"¿Qué es Risk Analytics en Google SecOps?", a:"Una capacidad que acumula automáticamente $risk_score de múltiples reglas y calcula puntuaciones de riesgo acumuladas por entidad (usuarios, IPs, hosts) a lo largo del tiempo." },
      { q:"¿Cómo escribir una regla que alimente Risk Analytics?", a:"Incluir $risk_score en la sección outcome:\noutcome:\n  $risk_score = max(50.0, if($count > 10, 80.0, 30.0))\nEl sistema suma risk_score de todas las reglas coincidentes por entidad." },
      { q:"¿Qué son las detecciones UEBA?",        a:"User and Entity Behavior Analytics — detecciones basadas en líneas base de comportamiento. Disponibles en el tier Enterprise. Detectan automáticamente anomalías sin escritura manual de reglas." },
    ],
    challenges:[
      { sentence:"Risk Analytics en Google SecOps acumula ____ de múltiples reglas por entidad.", blank:"$risk_score", options:["$risk_score","#count","$events","$severity"] },
      { statement:"Las detecciones UEBA requieren escribir reglas YARA-L manualmente.", answer:false },
    ]},
  { id:4, title:"Rendimiento y Mejores Prácticas",
    cards:[
      { q:"¿Cuáles son los principales consejos de rendimiento YARA-L?", a:"1. Filtrar por event_type primero\n2. Usar campos específicos antes que regexes genéricos\n3. Preferir string = sobre =~ (regex) cuando sea posible\n4. Usar match para agrupar alertas y reducir ruido\n5. Configurar la ventana de tiempo correcta (más corta = más rápida)\n6. Usar Reference Lists en vez de condiciones OR largas" },
      { q:"¿Qué es la sección 'options' en YARA-L?", a:"Sección opcional con configuración de rendimiento. Principales opciones:\n- allow_zero_values = true (permite 0 como valor válido)\n- max_cache_duration (ventana de caché para el estado de la regla)" },
      { q:"¿Cómo probar una regla YARA-L antes de publicarla?", a:"Usar la función 'Run Rule' en el Rules Editor de SecOps. Ejecuta la regla contra una ventana de tiempo definida de eventos históricos y muestra resultados coincidentes antes de que la regla entre en producción." },
    ],
    challenges:[
      { sentence:"Para reducir el ruido de reglas YARA-L, agrupa eventos por entidad usando la sección ____.", blank:"match", options:["match","condition","options","outcome"] },
      { statement:"Filtrar por event_type al inicio de una regla YARA-L mejora el rendimiento.", answer:true },
    ]},
];

export const M5_FINAL_CHALLENGE_ES = [
  { type:"complete", sentence:"En YARA-L, para calcular un risk score en la Detection, usa la sección ____.", blank:"outcome", options:["outcome","condition","match","events"] },
  { type:"complete", sentence:"Una tabla multi-columna usada para enriquecer reglas YARA-L se llama ____.", blank:"Data Table", options:["Data Table","Reference List","Variable Set","Event Map"] },
  { type:"truefalse", statement:"Risk Analytics en Google SecOps acumula risk_score de múltiples reglas por entidad.", answer:true },
  { type:"complete", sentence:"Para verificar si una IP pertenece a una lista externa en YARA-L, usa el operador ____.", blank:"in", options:["in","contains","=~","match"] },
  { type:"truefalse", statement:"Las detecciones UEBA en Google SecOps requieren escribir reglas YARA-L manualmente.", answer:false },
];

export const MISSIONS_ES = [
  { id:1, title:"Brute Force SSH", tag:"AUTENTICACIÓN", emoji:"🔐", mitre:"T1110", xp:150,
    steps:[
      { section:"META", icon:"🏷", color:"#fbbf24", type:"multiple",
        q:"¿Qué metadatos describen mejor esta regla?", options:["rule_name = \"ssh_brute_force\"","rule_name = \"new_process\"","severity = \"LOW\"","severity = \"CRITICAL\""],
        answers:["rule_name = \"ssh_brute_force\"","severity = \"CRITICAL\""],
        hint:"Brute force es alta severidad. El rule_name debe reflejar lo que se detecta." },
      { section:"EVENTS", icon:"📋", color:"#22d3a0", type:"multiple",
        q:"¿Qué filtros de evento son correctos para esta detección?",
        options:["$e.metadata.event_type = \"USER_LOGIN\"","$e.security_result.action = \"BLOCK\"","$e.metadata.event_type = \"NETWORK_DNS\"","$e.target.port = 22"],
        answers:["$e.metadata.event_type = \"USER_LOGIN\"","$e.security_result.action = \"BLOCK\"","$e.target.port = 22"],
        hint:"Brute force SSH = múltiples intentos fallidos (BLOCK) en el puerto 22." },
      { section:"MATCH", icon:"🔗", color:"#a78bfa", type:"select",
        q:"¿Cómo agrupar eventos para detectar ataques por origen?",
        options:["$e.principal.ip over 5m","$e.target.ip over 1h","$e.metadata.event_type over 24h","$e.principal.hostname over 30m"],
        answer:"$e.principal.ip over 5m",
        hint:"Agrupar por IP de origen (atacante) en ventana corta (5 min) para detectar ataques concentrados." },
      { section:"CONDITION", icon:"🎯", color:"#ff1a75", type:"select",
        q:"¿Qué condición detecta correctamente múltiples fallos?",
        options:["#e > 5","$e.count > 5","count($e) >= 5","#events = 5"],
        answer:"#e > 5",
        hint:"En YARA-L, #e cuenta eventos coincidentes. > 5 significa más de 5 fallos en la ventana de tiempo." },
    ]},
];
