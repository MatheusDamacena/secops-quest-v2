// ─── DADOS DO JOGO — extraídos do SecOps Quest v1 ───────────────────────────
// Este arquivo contém todo o conteúdo educacional do jogo
// Para adicionar conteúdo: edite este arquivo e faça git push

const M0_PUZZLE = {
  nodes: [
    { id:"source",    label:"Fonte de Log",        sub:"Endpoint · Firewall · Cloud · SaaS",          icon:"📡", color:"#00c4cc",   blank:false },
    { id:"collect",   label:"Coleta / Ingestão",   sub:"Forwarder · BindPlane · Feed · Webhook",       icon:"⚙️", color:"#00c4cc",   blank:true  },
    { id:"secops",    label:"Google SecOps",        sub:"Plataforma SIEM/SOAR Cloud native",            icon:"🏛", color:"#22d3a0",  blank:false },
    { id:"parser",    label:"Parser → UDM",         sub:"Normaliza raw logs no schema UDM",             icon:"🔄", color:"#22d3a0",  blank:true  },
    { id:"rules",     label:"Regras YARA-L",        sub:"Rules Engine detecta padrões nos eventos UDM", icon:"🎯", color:"#a78bfa", blank:false },
    { id:"detection", label:"Detection / Alerta",   sub:"Aparece na fila de triagem do SOC",            icon:"🚨", color:"#fbbf24",  blank:true  },
    { id:"invest",    label:"Investigação",          sub:"Cases & Alerts · Graph Investigator · Search", icon:"🔍", color:"#fbbf24",  blank:false },
    { id:"soar",      label:"SOAR Playbook",         sub:"Orquestração e automação de resposta",         icon:"🤖", color:"#ff4d4d",    blank:true  },
    { id:"response",  label:"Resposta Automática",   sub:"Block IP · Isolate · Ticket · Notify",         icon:"🛡", color:"#ff4d4d",    blank:false },
  ],
  distractors: ["Chronicle Forwarder v1", "Syslog direto", "SOAR Connector", "Dashboard Widget"],
  explanation: [
    { node:"Coleta / Ingestão",  info:"O Google SecOps suporta múltiplos métodos: Forwarder/BindPlane Agent (on-prem), Feeds (pull de APIs SaaS e buckets cloud), Webhooks HTTPS (push da fonte), Pub/Sub (GCP nativo) e Connectors SOAR (Content Hub). Ref: security.googlecloudcommunity.com/siem-26" },
    { node:"Parser → UDM",       info:"Parsers normalizam raw logs de qualquer fabricante para o schema UDM (Unified Data Model). O Google mantém +500 parsers prontos. Você pode criar parsers customizados (CBN/ANTLR). O SecOps guarda ambos: raw log e UDM normalizado." },
    { node:"Detection / Alerta", info:"Quando uma regra YARA-L casa com eventos UDM, o Rules Engine gera uma Detection. Ela aparece na fila de alertas do SOC com contexto de entidade, severidade e mapeamento MITRE ATT&CK." },
    { node:"Investigação",       info:"Step 4 da jornada oficial: Cases & Alerts agrupam detecções relacionadas. O Graph Investigator visualiza o quem/quê/quando do ataque. A pesquisa UDM permite investigar histórico de até 12 meses. Ref: security.googlecloudcommunity.com/secops-enterprise-25" },
    { node:"SOAR Playbook",      info:"Step 5: após investigação, o SOAR executa playbooks de resposta automática configurados no Designer de Playbook. Pode integrar com ferramentas externas via Content Hub (Jira, PagerDuty, firewalls, etc.)." },
  ],
};


const M1_LESSONS = [
  { id:1, title:"O que é um SIEM?", icon:"🏛",
    cards:[
      { q:"O que significa SIEM?", a:"Security Information and Event Management — sistema que coleta, correlaciona e analisa logs de segurança em tempo real." },
      { q:"Por que um SIEM existe?", a:"Sem ele, um analista teria que abrir dezenas de consoles diferentes. O SIEM centraliza tudo num único lugar e numa linha do tempo única." },
      { q:"O que é o Google SecOps?", a:"Google Security Operations (Google SecOps) é uma plataforma SIEM/SOAR Cloud native da Google, totalmente gerenciada, sem necessidade de infraestrutura própria." },
      { q:"Qual é a retenção de logs padrão do Google SecOps?", a:"Todos os tiers do Google SecOps incluem 12 meses de hot data retention. O modelo de licenciamento é baseado em volume de ingestão (TB/ano) — não por EPS (evento/segundo) ou por usuário. Diferencial: sem custo extra por armazenamento dentro dos 12 meses." },
      { q:"O Google SecOps tem inteligência artificial?", a:"Sim. Possui agentes de IA embutidos: Gemini para investigação autônoma, Triage Agent para priorizar alertas e AI-powered detections com regras sugeridas automaticamente." },
      { q:"O que o Google SecOps armazena?", a:"Cada evento em dois formatos: o log bruto original (raw log) e o registro normalizado no schema UDM (Unified Data Model)." },
    ],
    challenges:[
      { type:"complete", sentence:"O Google SecOps é uma plataforma SIEM/____ Cloud native da Google.", blank:"SOAR", options:["SOAR","DNS","WAF","EDR"] },
      { type:"truefalse", statement:"A retenção padrão de hot data no Google SecOps Standard é de 30 dias.", answer:false },
      { type:"complete", sentence:"O Google SecOps possui agentes de ____ embutidos, como o Gemini.", blank:"IA", options:["IA","firewall","VLAN","parser"] },
      { type:"complete", sentence:"O SIEM centraliza logs para que o analista não precise abrir dezenas de ____ diferentes.", blank:"consoles", options:["consoles","arquivos","usuários","regras"] },
    ]},
  { id:2, title:"Normalização e UDM", icon:"🔄",
    cards:[
      { q:"O que é normalização de logs?", a:"Converter logs de formatos diferentes (Palo Alto, Windows, Linux) para um schema comum — o UDM (Unified Data Model)." },
      { q:"Por que normalizar?", a:"Sem normalização você precisaria de uma regra diferente para cada fabricante. Com UDM, uma regra cobre todos os produtos." },
      { q:"O que é um Parser?", a:"Componente que lê o log bruto de um produto e converte para campos UDM. O Google mantém +500 parsers prontos para os principais fabricantes." },
      { q:"Quais são as seções principais do UDM?", a:"metadata (obrigatória), principal, target, network, security_result + src, intermediary (proxy/relay), observer (sniffer), about, extensions. Apenas metadata é obrigatória — as outras só aparecem quando necessárias para o evento." },
      { q:"O que é 'raw log'?", a:"O log bruto original, exatamente como chegou do produto — antes de ser normalizado. O Google SecOps guarda os dois: raw log e UDM normalizado." },
      { q:"O que é o Entity Data Model do UDM?", a:"Modelo de contexto que enriquece eventos UDM com dados de fontes como Active Directory e LDAP. Ex: um login tem target.user.userid=\"frank.kolzig\", mas target.user.department=\"Marketing\" vem automaticamente do LDAP ingerido — sem estar no log original." },
    ],
    challenges:[
      { type:"complete", sentence:"O schema comum usado pelo Google SecOps para normalizar logs chama-se ____.", blank:"UDM", options:["UDM","JSON","YAML","XML"] },
      { type:"complete", sentence:"O componente que converte o log bruto para UDM é chamado de ____.", blank:"Parser", options:["Parser","Firewall","Agent","Index"] },
      { type:"truefalse", statement:"Com UDM, uma mesma regra YARA-L funciona para logs de diferentes fabricantes.", answer:true },
      { type:"complete", sentence:"O campo ____ no UDM define quais outros campos são obrigatórios num evento.", blank:"event_type", options:["event_type","metadata","principal","target"] },
    ]},
  { id:3, title:"Arquitetura Google SecOps", icon:"🏗",
    cards:[
      { q:"Como os dados chegam ao Google SecOps?", a:"Principais métodos:\n• Forwarders/BindPlane Agent — coleta on-prem (Windows, Linux, firewalls)\n• Feeds — pull de APIs e buckets cloud (GCS, S3, APIs SaaS)\n• Webhooks HTTPS — push da fonte para o SecOps\n• Pub/Sub — integração nativa GCP\n• Ingestion API — apps customizados\n• Connectors — ingestão de alertas via SOAR (Content Hub)" },
      { q:"O que é o Rules Engine?", a:"Motor que executa as regras YARA-L continuamente sobre os eventos normalizados e gera detecções (alertas) quando as condições são atendidas." },
      { q:"O que é uma Detection?", a:"Alerta gerado pelo Rules Engine quando uma regra YARA-L casa com eventos nos logs. Aparece na fila de triagem do SOC para investigação." },
      { q:"O que é o SOAR e o que ele faz?", a:"Security Orchestration, Automation and Response — automatiza respostas a incidentes via Playbooks. Pode abrir tickets, bloquear IPs e notificar equipes automaticamente." },
      { q:"Qual é o diferencial do Google SecOps vs SIEMs tradicionais?", a:"Infraestrutura Google: 12 meses de hot retention em todos os tiers, licenciamento por TB/ano (não por EPS ou usuário), velocidade de busca petabyte-scale e IA embarcada (Gemini)." },
    ],
    challenges:[
      { type:"complete", sentence:"O BindPlane é um tipo de ____ que envia logs ao Google SecOps.", blank:"Forwarder", options:["Forwarder","Parser","Detection","Playbook"] },
      { type:"complete", sentence:"Quando uma regra YARA-L casa com eventos, o resultado é chamado de ____.", blank:"Detection", options:["Detection","Parser","Feed","UDM"] },
      { type:"truefalse", statement:"O SOAR do Google SecOps pode automatizar respostas a incidentes via Playbooks.", answer:true },
      { type:"complete", sentence:"O Google SecOps possui retenção de hot data de ____ meses por padrão.", blank:"12", options:["12","3","6","24"] },
    ]},
  { id:4, title:"Pacotes e Licenças", icon:"📦",
    cards:[
      { q:"Quantos pacotes o Google SecOps oferece?", a:"Três: Standard, Enterprise e Enterprise Plus. O preço é baseado em volume de ingestão (dados) e não por número de eventos ou usuários." },
      { q:"O que inclui o pacote Standard?", a:"Ingestão de dados, detecção de ameaças, investigação, resposta e 12 meses de hot data retention. Licenciado por TB/ano de ingestão. Ideal para organizações que precisam de operações de segurança fundamentais." },
      { q:"O que o Enterprise adiciona ao Standard?", a:"Threat intelligence avançada, UEBA (User and Entity Behavior Analytics), assistência de IA generativa (Gemini) e SOAR para automação de respostas." },
      { q:"O que o Enterprise Plus adiciona ao Enterprise?", a:"Inteligência completa de Mandiant e VirusTotal, gerenciamento avançado de pipeline de dados e opções de armazenamento estendido. Para ambientes complexos com máxima necessidade de defesa." },
      { q:"O que é o Google Unified Security?", a:"Pacote que inclui tudo do Enterprise Plus e adiciona Chrome Enterprise Premium, Security Command Center e Web Risk — a oferta mais completa da Google para segurança." },
      { q:"Como funciona o modelo de preço do Google SecOps?", a:"Baseado em volume de ingestão (TB/ano). Todos os tiers incluem 12 meses de hot data retention. Diferente de SIEMs tradicionais que cobram por EPS (evento por segundo) ou por usuário — o Google SecOps dimensiona por volume total ingerido." },
    ],
    challenges:[
      { type:"complete", sentence:"O Google SecOps tem ____ pacotes: Standard, Enterprise e Enterprise Plus.", blank:"3", options:["3","2","4","5"] },
      { type:"complete", sentence:"O pacote que inclui UEBA e Gemini AI é o ____.", blank:"Enterprise", options:["Enterprise","Standard","Basic","Starter"] },
      { type:"truefalse", statement:"O Enterprise Plus inclui inteligência completa de Mandiant e VirusTotal.", answer:true },
      { type:"complete", sentence:"O modelo de preço do Google SecOps é baseado em volume de ____.", blank:"ingestão", hint:"Licenciamento por TB/ano de volume ingerido — não por EPS, usuário ou host. Todos os tiers incluem 12 meses de hot data. Ref: cloud.google.com/chronicle/docs/secops/secops-packages", options:["ingestão","usuários","eventos","regras"] },
    ]},
  { id:5, title:"Métodos de Ingestão", icon:"📥",
    cards:[
      { q:"Quais são os métodos de ingestão do Google SecOps?", a:"6 métodos principais:\n1. BindPlane Agent — on-prem (Windows, Linux, firewalls)\n2. Feed Pull — pull de cloud/SaaS (GCS, S3, APIs)\n3. Webhook HTTPS — fonte envia ao endpoint do SecOps (push)\n4. Pub/Sub — integração nativa GCP\n5. Ingestion API direta — apps customizados\n6. Forwarder — legado (prefira BindPlane Agent em novos projetos)" },
      { q:"O que é o BindPlane Agent e quando usar?", a:"Pipeline de telemetria moderno para ambientes on-prem. Use para: firewalls (FortiGate), servidores Windows/Linux, qualquer fonte sem API nativa no SecOps. É o substituto recomendado do Forwarder legado. Gerenciado via BindPlane OP console. Suporta OpenTelemetry. Ref: cloud.google.com/chronicle/docs/ingestion/use-bindplane-agent" },
      { q:"O que é um Feed no Google SecOps?", a:"Mecanismo de ingestão configurado na UI do SecOps. Tipos:\n• Pull: SecOps busca ativamente (GCS, S3, Azure Blob, APIs de terceiros como Okta, Microsoft 365)\n• Push/Webhook: fonte envia ao endpoint HTTPS do SecOps\n• Pub/Sub: assinatura nativa GCP\n• Amazon Data Firehose: streaming AWS\n\nCada feed = data source type + log type." },
      { q:"Como funciona o Webhook no Google SecOps?", a:"Fonte envia logs ao endpoint HTTPS do SecOps (push). Limites: 4 MB por request, 15.000 QPS por instância. Auth via API key no header (recomendado) ou query param. Configurado em Settings → Feeds → HTTPS Push. Use quando a fonte suporta webhooks mas não tem connector nativo." },
      { q:"Qual é a diferença entre Forwarder e BindPlane Agent?", a:"Forwarder: componente legado que roda na rede do cliente, coleta logs e packets e envia ao SecOps. Ainda funcional e documentado nos guias oficiais.\nBindPlane Agent: substituto moderno com suporte a OpenTelemetry, gerenciamento centralizado via BindPlane OP e mais flexibilidade. Novos projetos devem preferir o BindPlane Agent. Ref: cloud.google.com/chronicle/docs/ingestion/use-bindplane-agent" },
    ],
    challenges:[
      { type:"complete", sentence:"Para novos projetos de coleta on-premises, o método moderno recomendado é o ____.", blank:"BindPlane Agent", hint:"O BindPlane Agent é o substituto moderno do Forwarder legado. Suporta Windows, Linux, firewalls e é gerenciado via BindPlane OP. O Forwarder ainda funciona mas novos projetos devem usar BindPlane Agent. Ref: cloud.google.com/chronicle/docs/ingestion/use-bindplane-agent", options:["BindPlane Agent","Forwarder","Webhook","Pub/Sub"] },
      { type:"truefalse", statement:"O Webhook no Google SecOps permite que a fonte envie logs diretamente ao endpoint HTTPS do SecOps.", answer:true, hint:"Correto. Webhook = push: a fonte envia ao endpoint HTTPS do SecOps. Limite: 4MB por request, 15K QPS por instância. Auth via API key no header. Ref: cloud.google.com/chronicle/docs/administration/feed-management" },
      { type:"complete", sentence:"Para GCP, o método nativo de ingestão sem BindPlane é via ____.", blank:"Pub/Sub", hint:"Cloud Logging → Log Sink → Pub/Sub Topic → Google SecOps (assinatura nativa). Sem agente, sem BindPlane. Para AWS/Azure usa-se Feed pull do bucket S3/Blob. Ref: cloud.google.com/chronicle/docs/ingestion/cloud-pubsub", options:["Pub/Sub","BindPlane Agent","Webhook","Forwarder"] },
      { type:"truefalse", statement:"O Forwarder do Google SecOps é o método recomendado para novas implementações.", answer:false, hint:"Incorreto. O Forwarder está DEPRECIADO — EOL Janeiro 2027. Para novos projetos use o BindPlane Agent. A partir de Abril/2026 novos clientes não podem criar Forwarders. Ref: cloud.google.com/chronicle/docs/install/install-forwarder" },
    ]},
  { id:6, title:"Investigação: Cases, SIEM Search & Graph", icon:"🔍",
    cards:[
      { q:"O que é a fase de Investigação no SecOps?", a:"Step 4 da jornada oficial. Após uma Detection, o analista investiga com 3 ferramentas:\n\n1. SIEM Search — busca de eventos UDM com query syntax\n2. Cases & Alerts — agrupa detecções relacionadas num caso\n3. Graph Investigator — visualiza relações entidade→evento→entidade\n\nObjetivo: confirmar se a Detection é True Positive e qual foi o escopo do ataque." },
      { q:"Como fazer uma busca no SIEM Search?", a:"Sintaxe de busca UDM no console do SecOps:\n\nmetadata.event_type = \"USER_LOGIN\"\nAND principal.ip = \"192.168.1.100\"\nAND security_result.action = \"ALLOW\"\n\nFiltros de tempo: LAST 24 HOURS, LAST 7 DAYS, range customizado.\nBusca qualquer campo UDM: hostname, userid, URL, hash de arquivo, IP." },
      { q:"O que são Cases & Alerts?", a:"Alert = detecção individual de uma regra YARA-L\nCase = conjunto de Alerts correlacionados em 1 caso de investigação\n\nAlert Grouping: configura como Alerts são agrupados automaticamente em Cases (ex: mesmo IP, mesmo usuário)\nSLA timer: prazo para triagem\nPriority: Low / Medium / High / Critical\n\nO analista trabalha no Case, não em cada Alert individualmente." },
      { q:"O que é o Graph Investigator?", a:"Visualização de relações em grafo:\n• Nós: Usuário, Asset (hostname), IP, Domínio, Hash de arquivo\n• Arestas: eventos que conectam entidades (LOGIN, PROCESS_LAUNCH, NETWORK_CONNECTION)\n• Timeline View: ordena eventos cronologicamente\n\nUso: identificar blast radius (escopo) do ataque, ver assets comprometidos, traçar movimento lateral." },
    ],
    challenges:[
      { type:"complete", sentence:"No SIEM Search, campos UDM são conectados com o operador ____.", blank:"AND", hint:"Sintaxe: metadata.event_type = \"USER_LOGIN\" AND principal.ip = \"x.x.x.x\". Outros: OR, NOT. Filtros de tempo: LAST 24 HOURS, LAST 7 DAYS. Você busca qualquer campo UDM diretamente no console. Ref: community Step 4.1 Investigation", options:["AND","WHERE","JOIN","FILTER"] },
      { type:"complete", sentence:"Um ____ agrupa múltiplas Detections relacionadas para investigação pelo analista.", blank:"Case", hint:"Alert = 1 Detection de 1 regra. Case = conjunto de Alerts correlacionados (mesmo usuário, IP ou timeline). Alert Grouping define como Alerts são agrupados. O analista trabalha no Case, não em cada Alert separado. Ref: community Step 4.2 Cases & Alerts", options:["Case","Alert","Detection","Rule"] },
      { type:"truefalse", statement:"O Graph Investigator mostra relações entre entidades (users, assets, IPs) em forma de grafo.", answer:true, hint:"Correto. Grafo com nós (User, Asset, IP, Domínio, Hash) e arestas (eventos). Permite identificar blast radius, movimento lateral e reconstruir a cadeia de ataque. Disponível na fase Investigate do SecOps. Ref: community Step 4.1" },
    ]},
  { id:7, title:"Content Hub, SOAR & Resposta", icon:"🛒",
    cards:[
      { q:"O que é o Content Hub (Marketplace) do SecOps?", a:"Hub central para instalar conteúdo pré-construído:\n• Integrations — conectores para ferramentas (Jira, PagerDuty, CrowdStrike...)\n• Playbooks prontos — fluxos de resposta a incidentes\n• Parsers — normalizadores para novas fontes de log\n• Analytics/Dashboards — painéis pré-configurados\n• Use Cases — pacotes completos por cenário\n\nTudo instalável em 1 clique, atualizado automaticamente. Ref: community Step 2.2" },
      { q:"Estrutura de um SOAR Playbook:", a:"Um Playbook tem 3 componentes:\n• Trigger: o que dispara (novo Alert, novo Case, schedule)\n• Actions: o que executar (consultar VirusTotal, bloquear IP, criar ticket no Jira)\n• Flow: lógica condicional (if/else, branches, loops)\n\nExemplo:\nNovo Alert SSH BF → Enriquecer IP no VirusTotal → Se score>70: bloquear IP → Criar ticket no Jira → Fechar Case" },
      { q:"Connector vs. Feed vs. BindPlane — quando usar cada um?", a:"Feed (SIEM): SecOps faz pull de APIs → para SaaS com API (Okta, M365)\nWebhook (SIEM): fonte faz push → para SaaS com webhook\nBindPlane Agent (SIEM): on-prem → endpoints, servidores, firewalls\nConnector (SOAR): ingere ALERTAS de ferramentas externas → para workflow de resposta\n\nFeed/BindPlane = logs→SIEM→YARA-L\nConnector = alertas→SOAR→Playbook" },
      { q:"Jobs Scheduler no SOAR:", a:"Scripts Python periódicos para tarefas automáticas:\n• Enrichment: buscar threat intel periodicamente\n• Cleanup: fechar cases antigos\n• Sync: sincronizar IOCs entre ferramentas\n• Reports: gerar relatórios semanais\n\nDiferença de Playbooks:\nJobs → rodam por SCHEDULE (periódico)\nPlaybooks → rodam por TRIGGER (evento)\nAmbos usam as mesmas Integrations do Marketplace." },
    ],
    challenges:[
      { type:"complete", sentence:"Para instalar parsers, playbooks e integrações prontas, usa-se o ____ do SecOps.", blank:"Content Hub", hint:"Content Hub (Marketplace): hub central com Integrations, Playbooks, Parsers, Dashboards, Use Cases. Instalável em 1 clique. Atualizado automaticamente. Distingue-se do SIEM onde você escreve regras YARA-L manualmente. Ref: community Step 2.2 Marketplace", options:["Content Hub","App Store","API Hub","Google Play"] },
      { type:"complete", sentence:"Em um Playbook SOAR, o que DISPARA a execução é chamado de ____.", blank:"Trigger", hint:"Playbook = Trigger + Actions + Flow. Trigger: novo Alert, novo Case, ou schedule periódico. Actions: consultar APIs, bloquear IP, criar ticket. Flow: lógica if/else. O Jobs Scheduler usa schedule direto — sem Trigger de evento. Ref: community Step 5.1 Response", options:["Trigger","Action","Flow","Event"] },
      { type:"complete", sentence:"Para ingerir ALERTAS de ferramentas externas (EDR, NGFW) no SOAR, usa-se um ____.", blank:"Connector", hint:"Connector (SOAR) = alertas externos para workflow de resposta. Feed/BindPlane (SIEM) = logs brutos para detecção. A distinção é arquitetural: Feed/BindPlane alimentam YARA-L. Connector alimenta Playbooks. Ref: community Step 2.1 e Step 2.2", options:["Connector","Feed","Parser","BindPlane Agent"] },
    ]},
];

const M1_FINAL_CHALLENGE = [
  { type:"complete", sentence:"O Google SecOps é uma plataforma SIEM/____ Cloud native.", blank:"SOAR", options:["SOAR","NGFW","VPN","IDS"] },
  { type:"truefalse", statement:"A hot data retention padrão do Google SecOps Standard é 12 meses sem custo por volume.", answer:true },
  { type:"complete", sentence:"O componente que converte raw log para UDM é o ____.", blank:"Parser", options:["Parser","Agent","Rule","Feed"] },
  { type:"truefalse", statement:"Sem normalização, você precisaria de uma regra YARA-L diferente para cada fabricante.", answer:true },
  { type:"complete", sentence:"O motor que executa regras YARA-L e gera alertas é o ____.", blank:"Rules Engine", options:["Rules Engine","UDM","SOAR","BindPlane"] },
  { type:"complete", sentence:"O Google SecOps possui agentes de ____ embutidos, como o Gemini.", blank:"IA", options:["IA","antivírus","VPN","proxy"] },
  { type:"complete", sentence:"O pacote com UEBA, Gemini e SOAR incluídos é o Google SecOps ____.", blank:"Enterprise", options:["Enterprise","Standard","Basic","Free"] },
  { type:"truefalse", statement:"O Enterprise Plus inclui threat intelligence completa de Mandiant e VirusTotal.", answer:true },
  { type:"complete", sentence:"O schema de normalização do Google SecOps chama-se ____.", blank:"UDM", options:["UDM","JSON","CEF","LEEF"] },
  { type:"complete", sentence:"O Google SecOps tem ____ pacotes de licença disponíveis.", blank:"3", options:["3","2","4","5"] },
  { type:"complete", sentence:"No SIEM Search, campos UDM são conectados com o operador ____.", blank:"AND", hint:"Sintaxe: metadata.event_type = \"USER_LOGIN\" AND principal.ip = \"x.x.x.x\". Outros: OR, NOT. Você busca qualquer campo UDM diretamente no console. Ref: community Step 4.1 Investigation", options:["AND","WHERE","JOIN","FILTER"] },
  { type:"complete", sentence:"Um ____ agrupa múltiplas Detections relacionadas para investigação pelo analista SOC.", blank:"Case", hint:"Alert = 1 Detection de 1 regra. Case = conjunto de Alerts correlacionados (mesmo usuário, IP, timeline). O analista trabalha no Case, não em cada Alert individual. Ref: community Step 4.2 Cases & Alerts", options:["Case","Alert","Detection","Rule"] },
  { type:"complete", sentence:"Para instalar parsers, playbooks e integrações prontas no SecOps, usa-se o ____.", blank:"Content Hub", hint:"Content Hub (Marketplace): Integrations, Playbooks prontos, Parsers, Dashboards, Use Cases. Instalável em 1 clique, atualizado automaticamente. Ref: community Step 2.2 Marketplace", options:["Content Hub","App Store","API Hub","Google Play"] },
  { type:"truefalse", statement:"Jobs Scheduler no SOAR roda por schedule periódico, diferente de Playbooks que rodam por Trigger.", answer:true, hint:"Correto. Jobs: scripts periódicos (enrichment, cleanup, sync, reports). Playbooks: disparam por Trigger (novo Alert, novo Case). Ambos usam as mesmas Integrations do Content Hub. Ref: community Step 5.1 Response" },
];

const M2_CHALLENGE = [
  { type:"complete", sentence:"O campo ____ define o tipo de atividade em todo evento UDM.", blank:"metadata.event_type", hint:"metadata.event_type é obrigatório em todo evento UDM. Valores: USER_LOGIN, NETWORK_CONNECTION, PROCESS_LAUNCH etc. Ref: cloud.google.com/chronicle/docs/reference/udm-field-list", options:["metadata.event_type","principal.ip","target.port","security_result.action"] },
  { type:"complete", sentence:"O IP de origem de um evento fica em ____.", blank:"principal.ip", hint:"principal = quem iniciou a ação. target = destino da ação. Nunca confunda: um USER_LOGIN tem principal.ip = IP do cliente, target.ip = IP do servidor. Ref: cloud.google.com/chronicle/docs/unified-data-model", options:["principal.ip","target.ip","network.ip","source.ip"] },
  { type:"complete", sentence:"O IP de destino de um evento fica em ____.", blank:"target.ip", hint:"target.ip é o destino da ação. Em conexões de rede: principal.ip é quem conecta, target.ip é quem recebe. Ref: cloud.google.com/chronicle/docs/reference/udm-field-list", options:["target.ip","principal.ip","dest.ip","network.dest"] },
  { type:"truefalse", statement:"O campo metadata.event_type é obrigatório em todo evento UDM.", answer:true, hint:"Correto. Sem metadata.event_type o evento não pode ser indexado corretamente. É o campo mais fundamental do UDM. Ref: cloud.google.com/chronicle/docs/unified-data-model" },
  { type:"complete", sentence:"Para acessar o usuário que executou a ação, usa-se ____.", blank:"principal.user.userid", hint:"Em YARA-L: $e.principal.user.userid. O 'principal' é sempre quem iniciou — em USER_LOGIN é o usuário que fez login. Ref: cloud.google.com/chronicle/docs/reference/udm-field-list", options:["principal.user.userid","user.id","target.user.userid","metadata.user"] },
  { type:"complete", sentence:"A decisão do firewall (ALLOW/BLOCK) fica em ____.", blank:"security_result.action", hint:"security_result.action aceita: ALLOW, BLOCK, QUARANTINE, UNKNOWN_ACTION. Nota: UDM usa BLOCK (não DENY). Ref: cloud.google.com/chronicle/docs/reference/udm-field-list", options:["security_result.action","network.action","metadata.decision","principal.action"] },
  { type:"complete", sentence:"O hostname do alvo do evento fica em ____.", blank:"target.hostname", hint:"target.hostname é o FQDN ou nome NetBIOS do destino. Diferente de target.ip que é o endereço IP. Ref: cloud.google.com/chronicle/docs/reference/udm-field-list", options:["target.hostname","dest.host","principal.hostname","network.host"] },
  { type:"truefalse", statement:"principal.ip e target.ip podem ter o mesmo valor num evento de loopback.", answer:true, hint:"Correto. Em conexões localhost (127.0.0.1→127.0.0.1) ambos podem ser iguais. O UDM não impede isso. Ref: cloud.google.com/chronicle/docs/unified-data-model" },
  { type:"complete", sentence:"Bytes enviados na conexão ficam em ____.", blank:"network.sent_bytes", hint:"network.sent_bytes (enviados pelo principal) e network.received_bytes (recebidos pelo principal). Tipo: integer. Ref: cloud.google.com/chronicle/docs/reference/udm-field-list", options:["network.sent_bytes","principal.bytes","target.sent","metadata.bytes"] },
  { type:"complete", sentence:"O event_type para login de usuário é ____.", blank:"USER_LOGIN", hint:"USER_LOGIN representa autenticação bem-sucedida ou falha. Para logoff: USER_LOGOUT. Para mudança de senha: USER_ACCOUNT_MODIFICATION. Ref: cloud.google.com/chronicle/docs/reference/udm-event-types", options:["USER_LOGIN","AUTH_LOGIN","USER_AUTH","NETWORK_LOGIN"] },
  { type:"complete", sentence:"O event_type para criação de processo é ____.", blank:"PROCESS_LAUNCH", hint:"PROCESS_LAUNCH = novo processo iniciado. Contém: principal.process (processo pai), target.process (processo filho), target.process.file.full_path. Ref: cloud.google.com/chronicle/docs/reference/udm-event-types", options:["PROCESS_LAUNCH","PROCESS_CREATE","PROCESS_START","EXEC_PROCESS"] },
  { type:"truefalse", statement:"Em USER_LOGIN, o usuário que fez login fica em target.user.userid (não em principal.user.userid).", answer:true, hint:"Correto. No UDM: principal = entidade que origina a ação (ex: máquina). Em USER_LOGIN, target = usuário que autenticou. Ref: community blog UDM" },
    { type:"truefalse", statement:"O Google SecOps descarta o raw log original após normalizar para UDM.", answer:false, hint:"Incorreto. O Google SecOps armazena AMBOS: o raw log original E o evento UDM normalizado. Os dois ficam disponíveis por 12 meses (em todos os tiers). Licenciamento por TB/ano. Ref: cloud.google.com/chronicle/docs/overview Ref: cloud.google.com/chronicle/docs/overview" },
];

const M3_LESSONS = [
  { id:1, icon:"📐", title:"Anatomia de uma regra", content:`Uma regra YARA-L 2.0 tem 5 seções principais + 1 opcional:\n\n1. meta      — metadados (nome, severidade, autor)\n2. events    — filtros nos campos UDM\n3. match     — agrupamento e janela de tempo (opcional)\n4. condition — threshold para disparo (obrigatório)\n5. outcome   — variáveis calculadas (opcional)\n6. options   — ex: suppression_window = 5m (opcional)\n\n⚠️ FAIL-FAST: sempre coloque metadata.event_type PRIMEIRO\nna seção events. Sem isso, o engine executa regex e CIDR\ncontra TODOS os logs da plataforma — DNS, firewall, tudo.\nCom event_type no topo, o engine descarta 99% dos eventos\nantes de chegar nas comparações caras.`, quiz:[
    { q:"Qual seção define quando o alerta dispara?", opts:["meta","events","condition","match"], correct:2 },
    { q:"Qual seção é obrigatória em toda regra?", opts:["match","outcome","events","condition"], correct:2 },
  ]},
  { id:2, icon:"🔤", title:"Variáveis de evento", content:`Em YARA-L, você nomeia eventos com variáveis:\n\n$e — variável padrão de evento\n$e1, $e2 — para correlacionar dois eventos diferentes\n$ip, $user — placeholder variables (ligadas a campos)\n\nExemplo:\n$e.metadata.event_type = "USER_LOGIN"\n$e.principal.ip = $ip   ← $ip vira a chave do match`, quiz:[
    { q:"Como se chama a variável que é usada no match?", opts:["event var","placeholder var","meta var","rule var"], correct:1 },
    { q:'O que "$e1" representa?', opts:["campo UDM","segundo tipo de evento","resultado","metadado"], correct:1 },
  ]},
  { id:3, icon:"⏱", title:"Match e janelas de tempo", content:`O match agrupa eventos e define a janela temporal:\n\nmatch:\n  $ip over 10m    ← agrupa por IP em 10 minutos\n\nJanelas suportadas:\n• Xs / Xm / Xh / Xd (segundos, minutos, horas, dias)\n\nMúltiplas chaves:\n  $host, $domain over 5m\n\nSem match: regra de evento único (não precisa de janela)`, quiz:[
    { q:"Qual sintaxe agrupa por usuário em 30 minutos?", opts:["$user in 30m","$user over 30m","match $user 30m","user over 30min"], correct:1 },
    { q:"Quando NÃO usar a seção match?", opts:["sempre usar","regra de evento único","regras de DNS","regras de rede"], correct:1 },
  ]},
  { id:4, icon:"⚡", title:"Condition e operadores", content:`A condition define o threshold de disparo:\n\n#e > 5          ← mais de 5 eventos\n#e >= 1         ← pelo menos 1 evento\n$e              ← equivale a #e > 0 (pelo menos 1)\n#e1 >= 1 and #e2 >= 1   ← ambos os eventos presentes\n\nOperadores na seção events:\nnocase                              ← case-insensitive\nre.regex($e.field, \`padrão\`)       ← regex (backticks)\n$e.field = /padrão/ nocase          ← regex literal (outra sintaxe)\nnet.ip_in_range_cidr($e.ip, "x/y")  ← filtro CIDR\n$e.field in %minha_lista            ← reference list\n\n⚠️ ZERO VALUES: match filtra automaticamente "" e 0.\nSe $ip está no match, a regra já exclui $ip = "" implicitamente.`, quiz:[
    { q:"Como escrever 'mais de 10 eventos'?", opts:["#e >= 10","#e > 10","count > 10","events > 10"], correct:1 },
    { q:"Qual operador faz match case-insensitive?", opts:["ignorecase","nocase","icase","caseless"], correct:1 },
    { q:"O que '$e' sozinho na condition significa?", opts:["$e == true","#e > 0","$e exists","#e = 1"], correct:1 },
    { q:"Por que metadata.event_type deve ser PRIMEIRO na seção events?", opts:["Regra de sintaxe obrigatória","Fail-fast: descarta logs antes de executar regex/CIDR caros","Ordem alfabética","Melhora legibilidade"], correct:1 },
  ]},
];

const M3_SKIP_CHALLENGE = [
  // Lição 1 — Anatomia
  { type:"complete", sentence:"A seção obrigatória de toda regra YARA-L que define o disparo é ____.", blank:"condition", hint:"condition é a única seção verdadeiramente obrigatória nas detection rules. meta, events, match e outcome são opcionais dependendo do caso.", options:["condition","events","match","outcome"] },
  { type:"complete", sentence:"Para performance, o primeiro filtro na seção events deve ser ____.", blank:"metadata.event_type", hint:"FAIL-FAST: colocar metadata.event_type primeiro descarta 99% dos logs antes de executar regex e CIDR caros. Sem isso, o engine processa TODO o tráfego. Ref: community.google guide YARA-L optimization", options:["metadata.event_type","principal.ip","re.regex()","nocase"] },
  { type:"truefalse", statement:"A seção 'match' é obrigatória em toda regra YARA-L.", answer:false, hint:"match é OPCIONAL. Regras de evento único não precisam de match. Sem match, a regra avalia cada evento individualmente. Com match, agrupa eventos por chave em uma janela de tempo." },
  { type:"truefalse", statement:"A seção 'outcome' é obrigatória em toda regra YARA-L.", answer:false, hint:"outcome é OPCIONAL. Só necessária quando você quer calcular variáveis como sum(), count(), max() para usar na condition ou exportar com write_row." },
  // Lição 2 — Variáveis
  { type:"complete", sentence:"Para correlacionar dois tipos de evento diferentes na mesma regra, usa-se ____.", blank:"$e1 e $e2", hint:"$e1 e $e2 são variáveis de evento distintas. Ex: $e1 = USER_LOGIN, $e2 = FILE_CREATION. Cada uma filtra um tipo de evento. O join é feito via placeholder compartilhado no match.", options:["$e1 e $e2","$a e $b","$event1 e $event2","$first e $second"] },
  { type:"complete", sentence:"Em YARA-L, $ip em '$e.principal.ip = $ip' é chamado de ____ variable.", blank:"placeholder", hint:"Placeholder variables ($ip, $user, $host) capturam valores específicos de campos UDM e se tornam chaves do match. São diferentes de event variables ($e1, $e2) que representam eventos inteiros.", options:["placeholder","event","match","filter"] },
  // Lição 3 — Match
  { type:"complete", sentence:"Para agrupar por IP em janela de 10 minutos: match: $ip ____ 10m.", blank:"over", hint:"Sintaxe do match: match: $chave over DURAÇÃO. A duração pode ser em segundos (s), minutos (m), horas (h) ou dias (d). Ex: match: $ip, $port over 30m." , options:["over","in","during","for"] },
  { type:"truefalse", statement:"O match filtra automaticamente placeholder variables com valor vazio ('') ou zero.", answer:true, hint:"Correto. Google SecOps implicitly filters out zero values: '' para strings, 0 para números. Se $ip está no match, a regra já exclui $ip = '' implicitamente. Ref: docs.cloud.google.com/chronicle/docs/yara-l/match-syntax" },
  // Lição 4 — Condition e operadores
  { type:"complete", sentence:"'$e' sozinho na seção condition equivale a ____.", blank:"#e > 0", hint:"$e na condition = #e > 0 = pelo menos 1 evento. É o caso de evento único sem threshold. Exemplo da doc: condition: $e1 — detecta toda ocorrência do evento, sem necessidade de contar.", options:["#e > 0","#e = 1","#e >= 1","count($e) > 0"] },
  { type:"complete", sentence:"O operador ____ torna comparações de string insensíveis a maiúsculas.", blank:"nocase", hint:"nocase funciona com strings literais ($e.field = 'value' nocase), com regex literal ($e.field = /pattern/ nocase) e com re.regex() (re.regex($e.field, `pattern`) nocase). Keywords são case-insensitive por padrão.", options:["nocase","ignorecase","icase","caseless"] },
  { type:"complete", sentence:"Para filtrar por range de rede em YARA-L: ____($e.principal.ip, '10.0.0.0/8').", blank:"net.ip_in_range_cidr", hint:"net.ip_in_range_cidr($e.principal.ip, '10.0.0.0/8') — retorna true se o IP está no range CIDR. Não use cidr() — a função correta é net.ip_in_range_cidr(). Ref: docs.cloud.google.com/chronicle/docs/detection/yara-l-2-0-overview", options:["net.ip_in_range_cidr","cidr","ip.in_range","net.cidr_match"] },
  { type:"complete", sentence:"A sintaxe ALTERNATIVA de regex literal em YARA-L é: $e.field = ____ nocase.", blank:"/padrão/", hint:"YARA-L aceita DUAS formas de regex: (1) re.regex($e.field, `padrão`) nocase e (2) $e.field = /padrão/ nocase. A forma com barras é mais compacta para patterns simples. Ambas suportam nocase. Ref: docs.cloud.google.com/chronicle/docs/yara-l/yara-l-2-0-examples", options:["/padrão/","'padrão'","`padrão`","re(/padrão/)"] },
];

const M5_LESSONS = [
  { id:1, icon:"📊", title:"Outcome Variables",
    cards:[
      { q:"O que é a seção outcome em YARA-L?", a:"Seção opcional com variáveis calculadas. Funções: sum(), max(), min(), count(), count_distinct(), array(), array_distinct(). Pode ser usada em regras COM ou SEM match section." },
      { q:"Outcome em single-event vs multi-event — qual a diferença?", a:"Single-event (sem match): outcome calcula por evento individual, sem aggregation obrigatória. Ex: $risk = 75\n\nMulti-event (com match): TODA variável DEVE usar aggregation. Ex: $total = count($e.campo)\n\nQuebrar esta regra causa erro de compilação!" },
      { q:"Como usar conditional math no outcome?", a:"$risk_score = max(100 - if($secAction = \"BLOCK\", 70, 0))\n\nSe ação = BLOCK → score cai para 30. Na condition: $e and $risk_score > 49\nAssim, eventos bloqueados não geram alerta — elimina alert fatigue." },
      { q:"Diferença entre count() e count_distinct():", a:"count($e.campo) — conta todas as ocorrências, incluindo duplicatas.\ncount_distinct($e.campo) — conta valores únicos. Ex: count_distinct($e.target.ip) > 20 detecta port scan. Em multi-event, ambos exigem aggregation." },
    ],
    challenges:[
      { type:"complete", sentence:"A seção outcome usa ____ para contar ocorrências únicas de um campo.", blank:"count_distinct()", hint:"count_distinct($e.target.ip) > 20 detecta port scan. count() conta tudo incluindo repetições. Em multi-event, TODA variável de outcome DEVE usar aggregation. Ref: docs.cloud.google.com/chronicle/docs/detection/yara-l-2-0-overview", options:["count_distinct()","count_unique()","distinct_count()","count()"] },
      { type:"truefalse", statement:"Em regras multi-event (com match), toda variável no outcome deve usar aggregation.", answer:true, hint:"Correto. Doc oficial: every outcome variable must be encapsulated within an aggregation (max, count, sum, array_distinct...). Em single-event sem match, aggregation nao e obrigatoria. Ref: docs.cloud.google.com/chronicle/docs/yara-l/yara-l-2-0-examples" },
      { type:"truefalse", statement:"A seção outcome pode ser usada em regras sem match (single-event).", answer:true, hint:"Correto. Outcome nao exige match. Em single-event voce pode calcular $risk_score = 75 sem match. A diferenca: sem match nao precisa de aggregation, com match e obrigatorio." },
    ]},
  { id:2, icon:"📋", title:"Reference Lists",
    cards:[
      { q:"O que é uma Reference List no Google SecOps?", a:"Lista de valores mantida centralmente no console do SecOps. Tipos: STRING (texto exato), REGEX (expressão regular), CIDR (ranges de rede). Referenciada em YARA-L com %. Atualizar a lista atualiza automaticamente todas as regras que a utilizam." },
      { q:"Como referenciar uma Reference List em YARA-L?", a:"Na seção events:\n$e.principal.hostname in %hosts_bloqueados\n$e.network.email.from in %dominios_suspeitos\nnot $e.principal.ip in cidr %redes_confiáveis\n\nO % antes do nome identifica a lista. O operador in faz o match." },
      { q:"Diferença entre Reference List e hardcode de valores:", a:"Hardcode: $e.target.hostname = \"malware.com\" — precisa editar a regra para mudar\nReference List: $e.target.hostname in %ioc_domains — atualizar a lista sem tocar na regra. Para IOCs que mudam frequentemente (IPs, domínios C2), Reference List é muito superior." },
    ],
    challenges:[
      { type:"complete", sentence:"Para referenciar uma reference list de domínios: $e.target.hostname ____ %blocklist.", blank:"in", hint:"Sintaxe: $e.campo in %nome_lista. Para negação: not $e.campo in %lista. Para CIDR: $e.principal.ip in cidr %trusted_nets. O % identifica reference lists e data tables.", options:["in","equals","matches","contains"] },
      { type:"truefalse", statement:"Atualizar uma reference list atualiza automaticamente todas as regras que a utilizam.", answer:true, hint:"Correto. Esta é a grande vantagem das Reference Lists vs hardcode. Atualizar a lista no console propaga automaticamente para todas as regras que a referenciam." },
    ]},
  { id:3, icon:"🔗", title:"Correlação Multi-evento",
    cards:[
      { q:"Como correlacionar dois eventos com ordenação cronológica?", a:"Use $e1/$e2 + placeholder compartilhado + timestamp ordering:\n\nevents:\n  $e1.metadata.event_type = \"USER_LOGIN\"\n  $e1.principal.user.userid = $user\n  $e2.metadata.event_type = \"FILE_CREATION\"\n  $e2.principal.user.userid = $user\n  $e1.metadata.event_timestamp.seconds < $e2.metadata.event_timestamp.seconds\nmatch:\n  $user over 30m" },
      { q:"Golden Pattern: conta criada, usada e deletada em 4h", a:"events:\n  $c.metadata.event_type = \"USER_CREATION\"\n  $c.target.user.userid = $user\n  $l.metadata.event_type = \"USER_LOGIN\"\n  $l.target.user.userid = $user\n  $d.metadata.event_type = \"USER_DELETION\"\n  $d.target.user.userid = $user\n  $c.metadata.event_timestamp.seconds < $l.metadata.event_timestamp.seconds\n  $l.metadata.event_timestamp.seconds < $d.metadata.event_timestamp.seconds\nmatch:\n  $user over 4h\ncondition: $c and $l and $d" },
      { q:"O que são Composite Rules?", a:"Regras que operam sobre DETECÇÕES geradas por outras regras ($d). Campos principais:\n• $d.detection.outcomes[\"campo\"] — acessa outcome variables da regra produtora\n• $d.detection.risk_score — score de risco\n• $d.detection.rule_name — nome da regra que gerou a detection\n• $d.detection.rule_labels.key / .value — labels da seção meta\n• $d.detection.detection_depth = 0 — previne feedback loops" },
      { q:"Como usar sliding window (janela deslizante)?", a:"A janela deslizante começa após um evento pivot:\nmatch:\n  $host over 10m after $e1\n\nSignifica: janela de 10min começa após cada $e1. Útil para detectar ausência:\ncondition: $e1 and !$e2\n→ detecta $e1 que NÃO é seguido por $e2 em 10min." },
    ],
    challenges:[
      { type:"complete", sentence:"Em composite rules, outcomes da regra produtora são acessados via $d.detection.____[\"campo\"].", blank:"outcomes", hint:"Sintaxe: $d.detection.outcomes[\"nome_outcome\"]. Outros campos: $d.detection.risk_score, $d.detection.rule_name, $d.detection.rule_labels.key/value. Anti-loop: $d.detection.detection_depth = 0. Ref: security.googlecloudcommunity.com/google-security-operations-66/adoption-guide-yara-l-optimization-7148", options:["outcomes","variables","fields","results"] },
      { type:"complete", sentence:"Para garantir que $e1 ocorre ANTES de $e2: $e1.metadata.event_timestamp.____ < $e2.metadata.event_timestamp.seconds.", blank:"seconds", hint:"Campos de timestamp: .seconds (Unix epoch) e .nanos. Comparar .seconds garante ordem cronologica. Essencial em brute force -> login, criacao -> uso -> exclusao de conta. Ref: docs.cloud.google.com/chronicle/docs/yara-l/yara-l-2-0-examples", options:["seconds","millis","timestamp","time"] },
      { type:"truefalse", statement:"Uma composite rule pode correlacionar alertas de múltiplas regras diferentes.", answer:true, hint:"Correto. Composite rules correlacionam DETECÇÕES de outras regras dentro de uma janela de tempo. Ex: detectar quando regra_A E regra_B disparam para o mesmo host em 1h." },
    ]},
  { id:4, icon:"🎯", title:"MITRE ATT&CK Mapping",
    cards:[
      { q:"Como mapear uma regra para MITRE ATT&CK?", a:"Na seção meta — que aceita qualquer par chave-valor livre. O Google usa dois padrões:\n• Padrão curto (doc oficial): tactic = \"Credential Access\" e technique = \"Brute Force\"\n• Padrão longo (community/parceiros): mitre_attack_tactic, mitre_attack_technique\nNas composite rules, acesse com: detection.detection.rule_labels[\"tactic\"]" },
      { q:"Para que serve o mapeamento MITRE no Google SecOps?", a:"Agrupa alertas por tática no dashboard MITRE, filtra detecções por técnica e integra com Mandiant threat intelligence automaticamente. Curated Detections já vêm mapeadas." },
      { q:"O que são Curated Detections?", a:"Regras YARA-L prontas mantidas pelo Google/Mandiant, já mapeadas para MITRE ATT&CK. Atualizam automaticamente. Disponíveis nos pacotes Enterprise e Enterprise Plus." },
    ],
    challenges:[
      { type:"complete", sentence:"Na seção meta do YARA-L, o campo ____ define a tática MITRE (padrão oficial Google).", blank:"tactic", hint:"A doc oficial usa: tactic = \"Credential Access\" e technique = \"Brute Force\". Nas composite rules, acesse com rule_labels[\"tactic\"]. O padrão mitre_attack_tactic também é válido — meta aceita qualquer chave. Ref: cloud.google.com/chronicle/docs/yara-l/meta-syntax", options:["tactic","mitre_attack_tactic","attack_tactic","mitre_tactic"] },
      { type:"truefalse", statement:"Curated Detections são regras YARA-L mantidas pelo Google/Mandiant.", answer:true, hint:"Correto. Curated Detections são regras prontas, mantidas pelo Google e Mandiant, já mapeadas para MITRE ATT&CK. Disponíveis a partir do pacote Enterprise." },
      { type:"complete", sentence:"A função ____ retorna o primeiro valor não-nulo entre dois campos.", blank:"strings.coalesce()", hint:"strings.coalesce(a, b, c...) retorna o primeiro argumento não-nulo. Útil para campos opcionais: strings.coalesce($e.principal.hostname, $e.principal.ip).", options:["strings.coalesce()","strings.first()","strings.or()","strings.fallback()"] },
    ]},
  { id:5, icon:"🔄", title:"Sliding Window e Negação",
    cards:[
      { q:"Como detectar eventos que NÃO ocorrem em sequência?", a:"Use sliding window com negação:\n\nrule login_sem_mfa {\n  events:\n    $e1.metadata.event_type = \"USER_LOGIN\"\n    $e1.security_result.action = \"ALLOW\"\n    $e1.principal.user.userid = $user\n    $e2.metadata.event_type = \"USER_LOGIN\"\n    $e2.additional.fields[\"mfa_used\"] = \"true\"\n    $e2.principal.user.userid = $user\n  match:\n    $user over 5m after $e1\n  condition:\n    $e1 and !$e2\n}" },
      { q:"Como usar o operador 'not' em YARA-L?", a:"Na seção events: not $e.campo = valor\nNa seção condition: $e1 and !$e2 (evento e2 NÃO deve existir)\n\nExemplo: detectar logins ALLOW onde NÃO há evento MFA associado ao mesmo usuário em 5min após o login." },
    ],
    challenges:[
      { type:"complete", sentence:"A janela deslizante em YARA-L usa a sintaxe: match: $host over 10m ____ $e1.", blank:"after", hint:"'after $pivot' define que a janela começa após o evento pivot. Ex: match: $host over 10m after $e1. Útil para detectar ausência de evento subsequente: condition: $e1 and !$e2. Ref: cloud.google.com/chronicle/docs/detection/yara-l-2-0-overview", options:["after","before","since","from"] },
      { type:"truefalse", statement:"A condição '$e1 and !$e2' detecta $e1 que NÃO é seguido por $e2 na janela.", answer:true, hint:"Correto. A sliding window (after $e1) cria uma janela de tempo após o evento pivot. !$e2 significa que o evento $e2 NÃO deve existir nessa janela. Padrão clássico para detectar login sem MFA." },
    ]},
  { id:6, icon:"🗃", title:"Data Tables e write_row",
    cards:[
      { q:"O que é uma Data Table no Google SecOps?", a:"Estrutura de dados multicolunas que permite importar dados próprios para o SecOps. Funciona como uma tabela de lookup com colunas definidas e dados em linhas. Pode ser criada pela UI, API ou por regras YARA-L com write_row." },
      { q:"Padrão de detecção com Data Table — DNS malicioso:", a:"events:\n  $e.metadata.event_type = \"NETWORK_DNS\"\n  $e.network.dns.questions.name = $domain\n  $domain in %malicious_domains_table.domain_name\n\nEste padrão substitui dezenas de regras estáticas com OR. 1 regra + Data Table = gestao centralizada de IOCs. Adoption Guide: Use Data Tables instead of creating redundant detection rules." },
      { q:"O que é o write_row e onde ele fica?", a:"write_row escreve o resultado de uma regra numa Data Table. Fica na seção export (após condition):\n\nexport:\n  write_row(%minha_tabela) {\n    key: $user\n    ip_address: $ip\n    login_count: $count\n  }\n\nSe a chave já existe, sobrescreve. Deve ser o último bloco da regra." },
      { q:"Quando usar Data Table vs Reference List?", a:"Reference List: uma coluna simples. Use para listas de IOCs simples.\n\nData Table: multiplas colunas. Use quando precisar de:\n- Multiplos atributos por IOC (dominio + categoria + score)\n- write_row para enriquecer com dados calculados por regras\n- Substituir dezenas de regras estaticas por 1 regra flexivel\n\nTipos de coluna: STRING, REGEX, CIDR (mesmo que Reference Lists)." },
    ],
    challenges:[
      { type:"complete", sentence:"A função write_row fica na seção ____ de uma regra YARA-L.", blank:"export", hint:"A seção export é exclusiva para write_row. Fica após condition e deve ser o último bloco da regra. Ref: cloud.google.com/chronicle/docs/investigation/data-tables", options:["export","outcome","condition","match"] },
      { type:"truefalse", statement:"write_row pode sobrescrever uma linha existente na Data Table se a chave já existir.", answer:true, hint:"Correto. Se a chave já existe, write_row sobrescreve a linha. Se não existe, cria nova linha. Ref: cloud.google.com/chronicle/docs/investigation/data-tables" },
      { type:"complete", sentence:"Data Tables diferem de Reference Lists porque suportam múltiplas ____.", blank:"colunas", hint:"Reference Lists: coluna única ($e.field in %lista). Data Tables: múltiplas colunas ($e.field in %tabela.coluna). Ideal para lookups complexos.", options:["colunas","linhas","tipos","chaves"] },
      { type:"complete", sentence:"Para filtrar por Data Table em YARA-L: $e.target.hostname in %tabela.____.", blank:"coluna", hint:"Sintaxe: %nome_tabela.nome_coluna. Você especifica qual coluna comparar. Diferente de Reference Lists onde não há coluna. Ref: cloud.google.com/chronicle/docs/yara-l/reference-list-syntax", options:["coluna","campo","key","index"] },
    ]},
  { id:7, icon:"📊", title:"Risk Analytics & UEBA",
    cards:[
      { q:"O que é Risk Analytics no Google SecOps?", a:"UEBA (User and Entity Behavior Analytics) integrado ao SecOps. Inverte o modelo de detecção: em vez de perguntar 'este evento é malicioso?', pergunta 'quão arriscada é esta entidade agora?'\n\nO Risk Engine agrega sinais, anomalias e detecções de uma entidade (usuário ou asset) numa janela de tempo deslizante com decaimento. O Dashboard Risk Analytics mostra entidades com maior risco acumulado." },
      { q:"Como o $risk_score conecta uma regra YARA-L ao Risk Engine?", a:"Use $risk_score na seção outcome. Se omitido, o SecOps usa defaults:\n• Alert gerado por regra = 40 pontos\n• Detection sem score explícito = 15 pontos\n\nCom $risk_score explícito:\noutcome:\n  $risk_score = max(if($e.security_result.action = \"FAIL\", 40, 0) +\n                   if($e.target.port = 22, 20, 0))\n\ncondition: $e and $risk_score > 0\n\nO SecOps acumula scores de múltiplas regras por entidade." },
      { q:"Score condicional baseado em criticidade do asset:", a:"rule risk_by_asset_criticality {\n  meta:\n    type = \"MULTI_EVENT\"\n  events:\n    $e.metadata.event_type = \"USER_LOGIN\"\n    $e.security_result.action = \"FAIL\"\n    $e.target.hostname = $host\n  match: $host over 10m\n  outcome:\n    $risk_score = max(\n      if($host = \"dc01\", 80,\n      if($host = \"prod-srv\", 60, 20)))\n    $count = count($e.metadata.event_type)\n  condition: $e and $count >= 5\n}" },
      { q:"O que são baselines comportamentais automáticos?", a:"O SecOps calcula métricas comportamentais automaticamente (UEBA nativo):\n• Logins por hora/dia por usuário\n• Bytes enviados por dia\n• Países de acesso\n• Processos lançados\n\nVocê pode acessar desvios dessas métricas em YARA-L sem configuração manual. Ex: detectar usuário que de repente acessa de 5+ cidades diferentes — Impossible Travel / VPN Anomaly." },
      { q:"Alert Suppression com Data Tables + $risk_score:", a:"Padrão avançado: regras com $risk_score baixo não disparam se estiverem na suppression list:\n\noutcome:\n  $risk = max(50 - if($host in %trusted_hosts.hostname, 50, 0))\ncondition: $e and $risk > 0\n\nOutra abordagem: Data Table como supressão dinâmica\n→ Playbook adiciona entidade na tabela\n→ Regra verifica: not $host in %suppressed.hostname\nReduz alert fatigue sem perder visibilidade." },
    ],
    challenges:[
      { type:"complete", sentence:"Se $risk_score é omitido no outcome, o SecOps usa ____ pontos para Alerts.", blank:"40", hint:"Defaults do Risk Engine: Alert gerado por uma regra = 40 pontos. Detection sem score explícito = 15 pontos. Ao definir $risk_score explicitamente, você controla a contribuição desta regra para o perfil de risco da entidade. Ref: security.googlecloudcommunity.com/google-security-operations-66/adoption-guide-risk-analytics", options:["40","15","100","0"] },
      { type:"truefalse", statement:"O $risk_score no outcome conecta a regra YARA-L ao Risk Analytics Engine do SecOps.", answer:true, hint:"Correto. Qualquer regra com $risk_score na seção outcome alimenta o Risk Engine. O score é acumulado por entidade (user ou asset) ao longo do tempo com decaimento. O Dashboard Risk Analytics exibe as entidades com maior risco acumulado. Ref: community adoption guide Risk Analytics" },
      { type:"complete", sentence:"O Risk Analytics usa ____ como unidade primária de análise (não o evento individual).", blank:"entidade", hint:"Entity-centric detection: a entidade (usuário ou asset) é o foco. O Risk Engine agrega sinais de MÚLTIPLAS regras para a MESMA entidade. Um único evento de baixo risco pode ser normal — mas 10 eventos de risco médio para a mesma entidade em 1h é um alerta. Ref: adoption guide Risk Analytics" , options:["entidade","evento","alerta","regra"] },
      { type:"truefalse", statement:"Alert Suppression com Data Tables evita alertas duplicados sem perder visibilidade nos logs.", answer:true, hint:"Correto. O padrão usa Data Table como suppression list dinâmica. A regra YARA-L verifica: not $host in %suppressed.hostname — eventos continuam sendo ingeridos e armazenados, mas não geram alerta. O Playbook SOAR adiciona entidades confiáveis à tabela. Ref: adoption guide Alert Suppression" },
    ]},
];

const M5_FINAL_CHALLENGE = [
  { type:"complete", sentence:"A seção ____ armazena variáveis calculadas como sum() e count().", blank:"outcome", hint:"outcome é a 5ª seção do YARA-L (opcional). Contém funções de agregação: sum(), max(), min(), count(), count_distinct(), array(), array_distinct().", options:["outcome","result","meta","events"] },
  { type:"truefalse", statement:"Reference lists se atualizam automaticamente em todas as regras.", answer:true, hint:"Correto. Atualizar uma reference list no console atualiza automaticamente todas as regras que a referenciam — sem precisar editar o código YARA-L." },
  { type:"complete", sentence:"Para referenciar uma reference list: $e.target.hostname ____ %blocklist.", blank:"in", hint:"Sintaxe: $e.campo in %nome_lista. Para negação: not $e.campo in %lista. Para CIDR: in cidr %lista. O % identifica reference lists e data tables.", options:["in","equals","matches","contains"] },
  { type:"complete", sentence:"A função que extrai um grupo de captura em YARA-L é ____.", blank:"re.capture()", hint:"re.capture($e.field, `pattern`) extrai o primeiro grupo de captura. Ex: re.capture($e.network.dns.questions.name, `.([^.]+).[^.]+$`) extrai o domínio raiz.", options:["re.capture()","re.extract()","re.group()","strings.capture()"] },
  { type:"truefalse", statement:"Composite rules operam diretamente sobre eventos UDM.", answer:false, hint:"Incorreto. Composite rules operam sobre DETECÇÕES ($d.detection.*). Campos: $d.detection.outcomes[campo] (outcomes), $d.detection.risk_score, $d.detection.rule_labels.key/value." },
  { type:"complete", sentence:"Na meta YARA-L, o campo ____ define a tática MITRE (padrão oficial Google).", blank:"tactic", hint:"A doc oficial usa: tactic = 'Credential Access'. Nas composite rules: rule_labels['tactic']. Meta aceita qualquer chave livre.", options:["tactic","mitre_attack_tactic","attack_tactic","mitre_tactic"] },
  { type:"complete", sentence:"write_row fica na seção ____ de uma regra YARA-L.", blank:"export", hint:"A seção export é exclusiva para write_row — deve ser o último bloco da regra. Ref: cloud.google.com/chronicle/docs/investigation/data-tables", options:["export","outcome","condition","match"] },
  { type:"truefalse", statement:"Data Table suporta múltiplas colunas, diferente de Reference List.", answer:true, hint:"Correto. Reference Lists: coluna única. Data Tables: múltiplas colunas ($e.field in %tabela.coluna). Ideal para lookups complexos." },
  { type:"complete", sentence:"Curated Detections estão disponíveis a partir do pacote ____.", blank:"Enterprise", hint:"Curated Detections requerem pacote Enterprise ou Enterprise Plus. No Standard, só regras customizadas.", options:["Enterprise","Standard","Essentials","Free"] },
  { type:"complete", sentence:"A função ____ retorna o primeiro valor não-nulo entre dois campos.", blank:"strings.coalesce()", hint:"strings.coalesce(a, b, c...) retorna o primeiro argumento não-nulo. Útil para campos opcionais.", options:["strings.coalesce()","strings.first()","strings.or()","strings.fallback()"] },
  { type:"truefalse", statement:"Em regras multi-event (com match), todas as variáveis de outcome devem usar aggregation.", answer:true, hint:"Correto. Doc: every outcome variable must be encapsulated within an aggregation function. Em single-event (sem match) não é obrigatório." },
  { type:"complete", sentence:"Para garantir ordem cronológica: $e1.metadata.event_timestamp.____ < $e2.metadata.event_timestamp.seconds.", blank:"seconds", hint:"Campos de timestamp: .seconds e .nanos. Comparar .seconds garante que $e1 ocorre antes de $e2. Essencial em correlações sequenciais.", options:["seconds","millis","timestamp","nanos"] },
  { type:"complete", sentence:"Se $risk_score é omitido no outcome, o Risk Engine usa ____ pontos por padrão (para Alerts).", blank:"40", hint:"Defaults do Risk Engine: Alert = 40 pontos, Detection sem score = 15 pontos. Ao definir $risk_score explicitamente, você controla a contribuição da regra para o perfil de risco da entidade. Ref: adoption guide Risk Analytics", options:["40","15","100","0"] },
  { type:"truefalse", statement:"O Risk Analytics usa a entidade (usuário ou asset) como unidade primária de análise.", answer:true, hint:"Correto. Entity-centric: o Risk Engine agrega sinais de MÚLTIPLAS regras para a MESMA entidade ao longo do tempo. Um único evento pode ser normal — mas acumulação de sinais indica comprometimento. Ref: adoption guide Risk Analytics" },
];

const M6_PUZZLES = [
  {
    id:"windows", emoji:"🖥", title:"Windows Events",
    tag:"WinEVT + Sysmon", color:"#00c4cc", xp:150,
    story:"DC01 está gerando eventos de segurança — logins, processos, alterações de arquivo. Monte o caminho completo desde o endpoint Windows até a resposta automática do SOAR.",
    nodes:[
      { id:"dc01",     label:"DC01",              sub:"Windows Server 2022 · 10.10.10.10",  icon:"🖥", color:"#00c4cc",   blank:false },
      { id:"sysmon",   label:"Sysmon",            sub:"Coleta eventos granulares no host",  icon:"📡", color:"#00c4cc",   blank:true  },
      { id:"bp_agent", label:"BindPlane Agent",   sub:"Encaminha logs ao gateway local",    icon:"⚙️", color:"#fbbf24",  blank:false },
      { id:"bp_gw",    label:"BindPlane Gateway", sub:"10.10.10.40 — roteia telemetria",    icon:"🔀", color:"#fbbf24",  blank:true  },
      { id:"secops",   label:"Google SecOps",     sub:"Ingere via Ingestion API (BP Gateway envia direto)",  icon:"🏛", color:"#22d3a0",  blank:true  },
      { id:"parser",   label:"Parser Windows",    sub:"Normaliza WinEVT/Sysmon → UDM",     icon:"🔄", color:"#22d3a0",  blank:false },
      { id:"udm",      label:"UDM Events",        sub:"USER_LOGIN · PROCESS_LAUNCH etc.",   icon:"📊", color:"#a78bfa", blank:true  },
      { id:"yaral",    label:"YARA-L Rules",      sub:"Detecta padrões de ameaça",          icon:"🎯", color:"#a78bfa", blank:false },
      { id:"detect",   label:"Detection",         sub:"Alerta gerado na fila do SOC",       icon:"🚨", color:"#ff4d4d",    blank:true  },
      { id:"soar",     label:"SOAR Playbook",     sub:"Resposta automática",                icon:"🤖", color:"#ff4d4d",    blank:false },
    ],
    distractors:["Syslog TCP","DHCP Server","BindPlane Gateway","DNS Resolver"],
    explanation:[
      { node:"Sysmon",            info:"Sysmon é um driver do sistema que captura eventos granulares: criação de processo, conexões de rede, modificação de arquivo. Muito mais detalhe que o WinEVT padrão." },
      { node:"BindPlane Gateway", info:"O Gateway recebe logs de todos os agents na LAN e envia DIRETAMENTE ao Google SecOps via Ingestion API (malachiteingestion-pa.googleapis.com) — sem passar por BindPlane Cloud, que é o plano de gerenciamento (console). Uma única conexão de saída consolida múltiplos agents." },
      { node:"Google SecOps",     info:"Recebe logs via Ingestion API e armazena em dois formatos: raw log (original) e UDM normalizado. Retenção padrão: 12 meses." },
      { node:"UDM Events",        info:"UDM normaliza logs de qualquer fabricante. Evento Sysmon de processo vira $e.metadata.event_type = 'PROCESS_LAUNCH' com campos padronizados." },
      { node:"Detection",         info:"Quando uma regra YARA-L casa com eventos no Rules Engine, uma Detection é gerada e aparece na fila de triagem do SOC." },
    ],
  },
  {
    id:"linux", emoji:"🐧", title:"Linux auditd",
    tag:"auditd → BindPlane → SecOps", color:"#22d3a0", xp:150,
    story:"Ubuntu-SRV está gerando logs de auditoria do kernel. Monte o fluxo completo desde o servidor Linux até a detecção e resposta automática.",
    nodes:[
      { id:"ubuntu",   label:"Ubuntu Server",     sub:"10.10.10.30 · Ubuntu 22.04",         icon:"🐧", color:"#22d3a0",  blank:false },
      { id:"auditd",   label:"auditd",            sub:"Daemon de auditoria do kernel Linux", icon:"📋", color:"#22d3a0",  blank:true  },
      { id:"bp_agent", label:"BindPlane Agent",   sub:"Coleta e encaminha logs locais",      icon:"⚙️", color:"#fbbf24",  blank:false },
      { id:"bp_gw",    label:"BindPlane Gateway", sub:"10.10.10.40 — roteia telemetria",     icon:"🔀", color:"#fbbf24",  blank:true  },
      { id:"secops",   label:"Google SecOps",     sub:"Ingere e processa os logs",           icon:"🏛", color:"#00c4cc",   blank:false },
      { id:"parser",   label:"Parser Linux",      sub:"Normaliza auditd logs → UDM",         icon:"🔄", color:"#00c4cc",   blank:true  },
      { id:"udm",      label:"UDM Events",        sub:"PROCESS_LAUNCH · FILE_CREATION",      icon:"📊", color:"#a78bfa", blank:false },
      { id:"yaral",    label:"YARA-L Rules",      sub:"Ex: Process Injection detection",     icon:"🎯", color:"#a78bfa", blank:true  },
      { id:"detect",   label:"Detection",         sub:"Alerta no SOC",                       icon:"🚨", color:"#ff4d4d",    blank:false },
      { id:"soar",     label:"SOAR Playbook",     sub:"SSH block · Isolate host",            icon:"🤖", color:"#ff4d4d",    blank:true  },
    ],
    distractors:["WinRM Agent","Active Directory","DHCP Server","IIS Server"],
    explanation:[
      { node:"auditd",            info:"auditd é o framework de auditoria do kernel Linux. Monitora syscalls, acessos a arquivos, mudanças de permissão e execução de comandos com precisão de processo." },
      { node:"BindPlane Gateway", info:"Um único Gateway na LAN centraliza logs de múltiplos servidores Linux antes de enviar ao cloud — reduz conexões de saída e simplifica o firewall." },
      { node:"Parser Linux",      info:"Converte o formato texto do auditd para campos UDM: syscalls mapeiam para PROCESS_LAUNCH, FILE_CREATION etc." },
      { node:"YARA-L Rules",      info:"A mesma sintaxe YARA-L funciona para logs Linux e Windows — porque ambos são normalizados para UDM antes da detecção." },
      { node:"SOAR Playbook",     info:"O SOAR responde via SSH para isolar o host Linux, bloqueia o IP no FortiGate via REST API e abre ticket automaticamente." },
    ],
  },
  {
    id:"fortigate", emoji:"🔥", title:"FortiGate Firewall",
    tag:"Syslog → BindPlane → SecOps", color:"#f97316", xp:175,
    story:"O FortiGate envia logs via Syslog para um BindPlane Agent que atua como coletor. O BindPlane Gateway consolida e encaminha ao Google SecOps. Monte este fluxo correto.",
    nodes:[
      { id:"fg",       label:"FortiGate VM",      sub:"WAN 192.168.1.60 · FortiOS 7.4",       icon:"🔥", color:"#f97316", blank:false },
      { id:"syslog",   label:"Syslog UDP 514",    sub:"FortiGate envia ao BindPlane Agent",    icon:"📤", color:"#f97316", blank:true  },
      { id:"bp_agent", label:"BindPlane Agent",   sub:"Recebe Syslog · coleta no collector",   icon:"⚙️", color:"#fbbf24",  blank:false },
      { id:"bp_gw",    label:"BindPlane Gateway", sub:"Consolida e encaminha ao SecOps",       icon:"🔀", color:"#fbbf24",  blank:true  },
      { id:"secops",   label:"Google SecOps",     sub:"Ingere via Ingestion API",              icon:"🏛", color:"#22d3a0",  blank:false },
      { id:"parser",   label:"Parser FortiGate",  sub:"Normaliza FortiOS logs → UDM",          icon:"🔄", color:"#22d3a0",  blank:true  },
      { id:"udm",      label:"UDM Events",        sub:"NETWORK_CONNECTION · USER_LOGIN",       icon:"📊", color:"#a78bfa", blank:false },
      { id:"yaral",    label:"YARA-L Rules",      sub:"C2 Beaconing · DNS Tunneling",          icon:"🎯", color:"#a78bfa", blank:true  },
      { id:"detect",   label:"Detection",         sub:"Alerta gerado na fila do SOC",          icon:"🚨", color:"#ff4d4d",    blank:false },
      { id:"soar",     label:"SOAR Playbook",     sub:"Chama FortiGate REST API",              icon:"🤖", color:"#ff4d4d",    blank:true  },
      { id:"action",   label:"Block IP Policy",   sub:"Política de bloqueio automático",       icon:"🛡", color:"#ff4d4d",    blank:false },
    ],
    distractors:["Syslog direto ao SecOps","WinRM","auditd","SNMP Trap"],
    explanation:[
      { node:"Syslog UDP 514",    info:"O FortiGate é configurado em Log & Report → Log Settings para enviar Syslog UDP 514 ao IP do servidor onde o BindPlane Agent está instalado — NÃO diretamente ao SecOps. Ref: docs.bindplane.observiq.com" },
      { node:"BindPlane Gateway", info:"O BindPlane Gateway recebe os dados de múltiplos agents na rede local e os encaminha ao Google SecOps via Ingestion API HTTPS — uma única conexão de saída para o firewall. Ref: cloud.google.com/chronicle/docs/forwarder-overview" },
      { node:"Parser FortiGate",  info:"Parser nativo converte logs de tráfego FortiOS para UDM: network.sent_bytes, network.received_bytes, security_result.action (ALLOW/BLOCK), target.port. Ref: cloud.google.com/chronicle/docs/parsers" },
      { node:"YARA-L Rules",      info:"Com logs do FortiGate no UDM, regras de C2 Beaconing e DNS Tunneling funcionam — os mesmos campos UDM independente da fonte do log." },
      { node:"SOAR Playbook",     info:"O SOAR chama a REST API do FortiGate (FortiManager ou diretamente) para criar policy de bloqueio em tempo real. Ref: cloud.google.com/chronicle/docs/soar" },
    ],
  },
  {
    id:"cloud", emoji:"☁️", title:"Cloud APIs (Feed)",
    tag:"GCP · AWS · Azure via Feed pull", color:"#00c4cc", xp:200,
    story:"Para GCP, logs chegam via Cloud Logging → Pub/Sub → SecOps (integração nativa, sem BindPlane). Para AWS/Azure, usa-se Feed com pull do bucket S3/Blob. Monte o fluxo GCP nativo.",
    nodes:[
      { id:"gcp",      label:"GCP Services",      sub:"Cloud Audit · VPC Flow · DNS",        icon:"☁️", color:"#00c4cc",   blank:false },
      { id:"clogging", label:"Cloud Logging",     sub:"Centraliza logs nativos do GCP",       icon:"📋", color:"#00c4cc",   blank:true  },
      { id:"pubsub",   label:"Pub/Sub Topic",     sub:"Exporta logs em tempo real",           icon:"📨", color:"#00c4cc",   blank:false },
      { id:"secops",   label:"Google SecOps",     sub:"Subscreve o Pub/Sub — sem agente",     icon:"🏛", color:"#00c4cc",   blank:true  },
      { id:"parser",   label:"Parser GCP",        sub:"Cloud Audit Logs → UDM",               icon:"🔄", color:"#22d3a0",  blank:false },
      { id:"udm",      label:"UDM Events",        sub:"USER_RESOURCE_UPDATE · USER_LOGIN",    icon:"📊", color:"#a78bfa", blank:true  },
      { id:"yaral",    label:"YARA-L Rules",      sub:"Privilege Escalation · Impossible Travel", icon:"🎯", color:"#a78bfa", blank:false },
      { id:"detect",   label:"Detection",         sub:"Alerta de atividade suspeita",         icon:"🚨", color:"#ff4d4d",    blank:true  },
      { id:"soar",     label:"SOAR Playbook",     sub:"Revoke IAM · Disable service account", icon:"🤖", color:"#ff4d4d",   blank:false },
    ],
    distractors:["BindPlane Agent","Syslog UDP","Storage Bucket direto","SNMP"],
    explanation:[
      { node:"Cloud Logging",  info:"GCP Cloud Logging coleta automaticamente logs de todos os serviços GCP: Cloud Audit Logs (admin, data access, system events), VPC Flow Logs, Cloud DNS. Ref: cloud.google.com/logging/docs" },
      { node:"Pub/Sub Topic",  info:"Um Log Sink exporta logs do Cloud Logging para um tópico Pub/Sub em tempo real. O Google SecOps assina este tópico diretamente — integração nativa GCP sem BindPlane. Ref: cloud.google.com/chronicle/docs/ingestion/cloud-pubsub" },
      { node:"Google SecOps",  info:"Para GCP: integração nativa via Pub/Sub. Para AWS (CloudTrail) e Azure: Feed com pull do bucket S3/Azure Blob Storage. BindPlane NÃO é necessário para logs cloud nativos. Ref: cloud.google.com/chronicle/docs/ingestion" },
      { node:"UDM Events",     info:"Atividades cloud mapeiam para UDM: mudança de role IAM → USER_RESOURCE_UPDATE_PERMISSIONS, criação de VM → RESOURCE_CREATION, login → USER_LOGIN com geolocalização via IP." },
      { node:"Detection",      info:"Regras de Impossible Travel, Privilege Escalation e Shadow AI funcionam com logs de cloud — os mesmos campos UDM independente da fonte do log." },
    ],
  },
  {
    id:"email", emoji:"📧", title:"Email Security",
    tag:"Gmail · O365 via Feed API", color:"#ec4899", xp:175,
    story:"Logs de email corporativo chegam via Feed usando APIs autenticadas. Monte o fluxo para detectar exfiltração de dados via email e phishing.",
    nodes:[
      { id:"email_src",label:"Email Provider",    sub:"Gmail Enterprise · Microsoft 365",    icon:"📧", color:"#ec4899",   blank:false },
      { id:"api",      label:"Email API",         sub:"Gmail API · Graph API (O365)",         icon:"🔌", color:"#ec4899",   blank:true  },
      { id:"feed",     label:"SecOps Feed",       sub:"Pull via API autenticada (OAuth)",     icon:"📥", color:"#818cf8", blank:false },
      { id:"secops",   label:"Google SecOps",     sub:"Ingere eventos de email",             icon:"🏛", color:"#818cf8", blank:true  },
      { id:"parser",   label:"Parser Email",      sub:"Normaliza headers e metadados → UDM", icon:"🔄", color:"#22d3a0",  blank:false },
      { id:"udm",      label:"UDM Events",        sub:"EMAIL_TRANSACTION · destinatários",   icon:"📊", color:"#a78bfa", blank:true  },
      { id:"yaral",    label:"YARA-L Rules",      sub:"Email Exfiltration · Phishing detection", icon:"🎯", color:"#a78bfa", blank:false },
      { id:"detect",   label:"Detection",         sub:"Alerta de exfiltração por email",     icon:"🚨", color:"#ff4d4d",    blank:true  },
      { id:"soar",     label:"SOAR Playbook",     sub:"Quarantine · Block sender",           icon:"🤖", color:"#ff4d4d",    blank:false },
    ],
    distractors:["Syslog UDP","BindPlane Agent","LDAP","SNMP"],
    explanation:[
      { node:"Email API",    info:"Para Gmail Enterprise, usa service account com Gmail API. Para Office 365, usa Microsoft Graph API. Ambas retornam metadados: remetente, destinatário, assunto, anexos." },
      { node:"Google SecOps",info:"O Feed faz pull dos logs periodicamente com credenciais OAuth. Sem agente de email — só autenticação via API do provider." },
      { node:"UDM Events",   info:"Emails viram eventos EMAIL_TRANSACTION com campos específicos: network.email.to.user.email_addresses (destinatários), network.email.subject (assunto)." },
      { node:"Detection",    info:"A regra de Email Exfiltration usa 'in %corporate_domains' com reference list. Mais de 20 emails externos em 1h gera alerta de insider threat." },
    ],
  },
  {
    id:"webhook", emoji:"🔗", title:"Webhook HTTPS Push",
    tag:"HTTPS Push → SecOps Feed", color:"#818cf8", xp:175,
    story:"Uma ferramenta de segurança SaaS (ex: CrowdStrike, SentinelOne) suporta webhook. Em vez de usar Feed pull com polling, você vai configurar o push direto ao endpoint HTTPS do Google SecOps. Monte este fluxo.",
    nodes:[
      { id:"saas",     label:"SaaS Security Tool",  sub:"CrowdStrike · SentinelOne · Okta etc.",   icon:"🛡", color:"#818cf8",  blank:false },
      { id:"webhook",  label:"Webhook Config",       sub:"URL + API Key no header da ferramenta",   icon:"🔗", color:"#818cf8",  blank:true  },
      { id:"https",    label:"HTTPS Endpoint",       sub:"SecOps Feed URL — push até 4MB/req",       icon:"📡", color:"#00c4cc",   blank:false },
      { id:"feed",     label:"SecOps Feed",          sub:"Tipo: HTTPS Push · autentica via API key", icon:"📥", color:"#00c4cc",   blank:true  },
      { id:"secops",   label:"Google SecOps",        sub:"Recebe e processa o payload JSON",         icon:"🏛", color:"#22d3a0",  blank:false },
      { id:"parser",   label:"Parser SaaS",          sub:"Normaliza payload JSON → UDM",             icon:"🔄", color:"#22d3a0",  blank:true  },
      { id:"udm",      label:"UDM Events",           sub:"PROCESS_LAUNCH · USER_LOGIN etc.",         icon:"📊", color:"#a78bfa", blank:false },
      { id:"yaral",    label:"YARA-L Rules",         sub:"Detecção de ameaças nos eventos",          icon:"🎯", color:"#a78bfa", blank:true  },
      { id:"detect",   label:"Detection",            sub:"Alerta gerado na fila do SOC",             icon:"🚨", color:"#ff4d4d",    blank:false },
    ],
    distractors:["BindPlane Agent","Syslog UDP","Pub/Sub","Feed Pull (S3)"],
    explanation:[
      { node:"Webhook Config",  info:"Na ferramenta SaaS, configure o destino webhook com a URL do feed do SecOps e o API key no header X-Chronicle-Access-Token (recomendado) ou como query param ?key=. Limite: 4MB por request, 15.000 QPS. Ref: cloud.google.com/chronicle/docs/administration/feed-management" },
      { node:"SecOps Feed",     info:"No SecOps: Settings → Feeds → Add Feed → HTTPS Push. O SecOps gera uma URL única e um secret. Configure o log type para o parser correto da ferramenta. Feed Pull vs Webhook: pull faz polling periódico, webhook é tempo real. Ref: cloud.google.com/chronicle/docs/administration/feed-management" },
      { node:"Parser SaaS",     info:"Cada ferramenta tem um parser dedicado no SecOps (+500 parsers disponíveis). O parser extrai campos do JSON da ferramenta e mapeia para UDM: alertas → security_result, processos → PROCESS_LAUNCH, usuários → principal.user.userid." },
      { node:"YARA-L Rules",    info:"Com os dados no UDM, as mesmas regras YARA-L funcionam — independente de a fonte ter chegado via webhook, BindPlane ou Pub/Sub. O UDM é o normalizador universal." },
    ],
  },
  {
    id:"onboarding", emoji:"🚀", title:"Ativação da Instância SecOps",
    tag:"Day 1 · Onboarding do Cliente", color:"#818cf8", xp:200,
    story:"Um novo cliente adquiriu o Google SecOps Enterprise. Você é o arquiteto do Day 1. Monte a sequência correta para ativar e configurar a instância — do GCP Project até a primeira detecção.",
    nodes:[
      { id:"gcp",     label:"GCP Project",        sub:"Projeto GCP com billing e APIs habilitadas",        icon:"☁️", color:"#00c4cc",   blank:false },
      { id:"iam",     label:"IAM & Roles",         sub:"Papéis: Chronicle Admin · Editor · Viewer",         icon:"🔐", color:"#00c4cc",   blank:true  },
      { id:"idp",     label:"Identity Provider",   sub:"Google Workspace / Cloud Identity / 3rd-party IdP", icon:"🪪", color:"#00c4cc",  blank:false },
      { id:"console", label:"SecOps Console",      sub:"Acesso autenticado via IDP configurado",             icon:"🖥", color:"#00c4cc",  blank:true  },
      { id:"ingest",  label:"Fonte de Dados",      sub:"1º Feed ou BindPlane Agent configurado",             icon:"📡", color:"#22d3a0", blank:false },
      { id:"parser",  label:"Parser UDM",          sub:"Normaliza logs no schema UDM",                       icon:"🔄", color:"#22d3a0", blank:true  },
      { id:"rules",   label:"Curated Detections",  sub:"Regras prontas ativas no Rules Engine",              icon:"🎯", color:"#fbbf24", blank:false },
      { id:"alert",   label:"1ª Detection",        sub:"Primeiro alerta — fluxo end-to-end validado",        icon:"🚨", color:"#fbbf24", blank:true  },
    ],
    distractors:["SIEM Legacy Migration","SSO Token","Firewall Rule","GKE Cluster"],
    explanation:[
      { node:"IAM & Roles",       info:"O SecOps usa IAM com papéis pré-definidos: Chronicle Admin (acesso total), Chronicle Editor, Chronicle Viewer (somente leitura), Chronicle SOAR Admin. Devem ser atribuídos antes de qualquer usuário acessar o console. Ref: community Step 1.1 Initial Config" },
      { node:"SecOps Console",    info:"O console é acessado via URL do cliente (ex: customer.backstory.chronicle.security). Requer IDP configurado — sem isso nenhum usuário consegue logar. Suporta Google Workspace, Cloud Identity ou IdPs externos (Okta, Azure AD) via SAML/OIDC. Ref: community Step 1.1 Configure IDP" },
      { node:"Parser UDM",        info:"Ao configurar o primeiro Feed ou BindPlane Agent, o SecOps aplica automaticamente o parser do fabricante. Se não existe parser pronto (+500 disponíveis), é necessário criar um custom parser (CBN/ANTLR) antes da normalização UDM. Ref: community Step 2.1" },
      { node:"1ª Detection",      info:"O milestone do Day 1 é validar o fluxo end-to-end: log ingerido → UDM normalizado → regra disparou → alerta na fila. Com Curated Detections ativas (Enterprise/Enterprise+), esse fluxo funciona sem escrever uma linha de YARA-L. Ref: community Step 3.1 Threat Detection" },
    ],
  },
  {
    id:"kali", emoji:"☠️", title:"Simulação de Ataque",
    tag:"Kali DMZ → Detecção → Resposta SOAR", color:"#ff6b6b", xp:250,
    story:"Kali-Lab (10.10.20.100) está realizando SSH Brute Force contra Ubuntu-SRV. Monte o fluxo de como o SecOps detecta e bloqueia automaticamente.",
    nodes:[
      { id:"kali",     label:"Kali Linux",        sub:"10.10.20.100 · DMZ Attacker",         icon:"☠️", color:"#ff6b6b", blank:false },
      { id:"attack",   label:"SSH Brute Force",   sub:"Centenas de tentativas porta 22",      icon:"⚔️", color:"#ff6b6b", blank:true  },
      { id:"fg",       label:"FortiGate Logs",    sub:"Registra BLOCK na política DMZ→LAN",   icon:"🔥", color:"#f97316",  blank:false },
      { id:"syslog",   label:"Syslog UDP 514",    sub:"FortiGate envia logs via UDP:514 ao BindPlane",  icon:"📤", color:"#f97316",  blank:true  },
      { id:"bp",       label:"BindPlane Agent",   sub:"Recebe syslog e encaminha ao SecOps",            icon:"⚙️", color:"#fbbf24",   blank:false },
      { id:"secops",   label:"Google SecOps",     sub:"Correlaciona eventos do firewall",               icon:"🏛", color:"#22d3a0",   blank:true  },
      { id:"udm",      label:"UDM Events",        sub:"USER_LOGIN BLOCK · principal.ip=$kali", icon:"📊", color:"#a78bfa", blank:true  },
      { id:"yaral",    label:"YARA-L: SSH BF",    sub:"#e > 5 do mesmo $ip em 10min",        icon:"🎯", color:"#a78bfa",  blank:false },
      { id:"detect",   label:"Detection",         sub:"SSH Brute Force alertado",             icon:"🚨", color:"#ff4d4d",     blank:true  },
      { id:"soar",     label:"SOAR Playbook",     sub:"Chama FortiGate REST API",             icon:"🤖", color:"#ff4d4d",     blank:false },
      { id:"blocked",  label:"IP Bloqueado",      sub:"Kali isolado automaticamente",         icon:"🛡", color:"#ff4d4d",     blank:true  },
    ],
    distractors:["BindPlane Agent","auditd","DNS Feed","Cloud API"],
    explanation:[
      { node:"SSH Brute Force", info:"O Kali usa Hydra ou Medusa para tentar centenas de senhas via SSH (porta 22). Cada tentativa gera um evento USER_LOGIN BLOCK no FortiGate com o IP do Kali." },
      { node:"Syslog UDP 514",  info:"O FortiGate envia cada evento de bloqueio via Syslog para o Google SecOps em tempo real — sem agente, sem delay." },
      { node:"UDM Events",      info:"O parser FortiGate normaliza: IP do Kali → principal.ip, Ubuntu → target.ip, porta 22 → target.port, decisão → security_result.action = BLOCK." },
      { node:"Detection",       info:"A regra SSH Brute Force detecta >5 eventos USER_LOGIN BLOCK do mesmo $ip em 10min. O Kali fazendo centenas de tentativas dispara em segundos." },
      { node:"IP Bloqueado",    info:"O SOAR chama a REST API do FortiGate para criar policy de bloqueio do IP do Kali. Resposta completa e automática em menos de 1 minuto." },
    ],
  },
];

const MISSIONS = [
  // DETECÇÃO TÉCNICA
  { id:1,cat:"TÉCNICA",emoji:"🔐",title:"Brute Force SSH",tag:"AUTENTICAÇÃO",tagColor:"#00c4cc",xp:150,mitre:"T1110",
    story:"Detecte mais de 5 falhas de autenticação via SSH do mesmo IP em 10 minutos.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados da regra",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "ssh_brute_force"',correct:true},{id:"b",text:'rule_name = "login_ok"',correct:false},
        {id:"c",text:'severity = "HIGH"',correct:true},{id:"d",text:'severity = "INFO"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Filtre os eventos corretos",multi:true,minCorrect:4,options:[
        {id:"a",text:'$e.metadata.event_type = "USER_LOGIN"',correct:true},
        {id:"b",text:'$e.metadata.event_type = "NETWORK_CONNECTION"',correct:false},
        {id:"c",text:'$e.security_result.action = "FAIL"',correct:true},
        {id:"d",text:'$e.security_result.action = "BLOCK"',correct:false},
        {id:"e",text:"$e.target.port = 22",correct:true},
        {id:"f",text:"$e.target.port = 443",correct:false},
        {id:"g",text:"$e.principal.ip = $ip",correct:true}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por IP em 10 min",multi:false,minCorrect:1,options:[
        {id:"a",text:"$ip over 10m",correct:true},{id:"b",text:"$ip over 1h",correct:false},{id:"c",text:"$user over 10m",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Dispare com mais de 5 tentativas",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e > 5",correct:true},{id:"b",text:"#e > 1",correct:false},{id:"c",text:"#e > 100",correct:false}]},
    ],
    logs:[
      {id:1,icon:"🖥",desc:"192.168.1.50",detail:"8× BLOCK · USER_LOGIN · porta 22",alert:true},
      {id:2,icon:"✅",desc:"10.0.0.1",detail:"1× ALLOW · USER_LOGIN · porta 22",alert:false},
      {id:3,icon:"🌐",desc:"172.16.0.99",detail:"15× BLOCK · NETWORK_CONNECTION · porta 22",alert:false},
      {id:4,icon:"🖥",desc:"45.33.32.156",detail:"12× BLOCK · USER_LOGIN · porta 22 · 8min",alert:true},
    ],
    explanation:'USER_LOGIN + BLOCK + porta 22, agrupado por $ip em 10min. #e > 5 captura brute force sem alertar tentativas legítimas ocasionais.',
  },
  { id:2,cat:"TÉCNICA",emoji:"📤",title:"Exfiltração de Dados",tag:"DATA LOSS",tagColor:"#ff4d4d",xp:200,mitre:"T1048",
    story:"Detecte transferências acima de 100 MB (104857600 bytes) para IPs fora da rede interna.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados da regra",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "data_exfiltration"',correct:true},{id:"b",text:'severity = "CRITICAL"',correct:true},
        {id:"c",text:'severity = "LOW"',correct:false},{id:"d",text:'rule_name = "file_upload"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Filtre NETWORK_CONNECTION com volume alto e IP externo",multi:true,minCorrect:4,options:[
        {id:"a",text:'$e.metadata.event_type = "NETWORK_CONNECTION"',correct:true},
        {id:"b",text:'$e.metadata.event_type = "USER_LOGIN"',correct:false},
        {id:"c",text:"$e.network.sent_bytes > 104857600",correct:true},
        {id:"d",text:"$e.network.sent_bytes > 1024",correct:false},
        {id:"e",text:'not net.ip_in_range_cidr($e.target.ip, "10.0.0.0/8")',correct:true},
        {id:"f",text:'$e.target.ip = "10.0.0.1"',correct:false},
        {id:"g",text:"$e.principal.user.userid = $user",correct:true}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por usuário em 1h",multi:false,minCorrect:1,options:[
        {id:"a",text:"$user over 1h",correct:true},{id:"b",text:"$user over 5m",correct:false},{id:"c",text:"$ip over 1h",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Um único evento já basta",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e >= 1",correct:true},{id:"b",text:"#e > 10",correct:false},{id:"c",text:"$e",correct:false}]},
    ],
    logs:[
      {id:1,icon:"📤",desc:"jsilva → 203.45.67.89",detail:"500 MB · NETWORK_CONNECTION · IP externo",alert:true},
      {id:2,icon:"📁",desc:"maria → 10.0.0.5",detail:"50 MB · NETWORK_CONNECTION · IP interno",alert:false},
      {id:3,icon:"🔑",desc:"admin → 8.8.8.8",detail:"200 MB · USER_LOGIN (event_type errado)",alert:false},
      {id:4,icon:"📤",desc:"pedro → 185.220.101.1",detail:"2 GB · NETWORK_CONNECTION · IP externo",alert:true},
    ],
    explanation:'NETWORK_CONNECTION + network.sent_bytes > 100MB + net.ip_in_range_cidr() para excluir RFC1918. Um evento já é suficiente — exfiltração não precisa de repetição.',
  },
  { id:3,cat:"TÉCNICA",emoji:"🌀",title:"DNS Tunneling",tag:"C2 EXFIL",tagColor:"#00c4cc",xp:250,mitre:"T1071.004",
    story:"Detecte quando um host faz mais de 50 consultas DNS para o mesmo domínio em 5 minutos.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "dns_tunneling"',correct:true},{id:"b",text:'severity = "HIGH"',correct:true},
        {id:"c",text:'rule_name = "dns_query"',correct:false},{id:"d",text:'severity = "LOW"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Use NETWORK_DNS e os campos corretos",multi:true,minCorrect:3,options:[
        {id:"a",text:'$e.metadata.event_type = "NETWORK_DNS"',correct:true},
        {id:"b",text:'$e.metadata.event_type = "NETWORK_CONNECTION"',correct:false},
        {id:"c",text:"$e.network.dns.questions.name = $domain",correct:true},
        {id:"d",text:"$e.network.dns.response_code = 0",correct:false},
        {id:"e",text:"$e.principal.hostname = $host",correct:true},
        {id:"f",text:"$e.target.port = 53",correct:false}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por host E domínio em 5min",multi:false,minCorrect:1,options:[
        {id:"a",text:"$host, $domain over 5m",correct:true},{id:"b",text:"$host over 5m",correct:false},{id:"c",text:"$domain over 1h",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Mais de 50 queries",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e > 50",correct:true},{id:"b",text:"#e > 5",correct:false},{id:"c",text:"#e >= 1",correct:false}]},
    ],
    logs:[
      {id:1,icon:"🌀",desc:"host-01 → evil.c2.io",detail:"87× NETWORK_DNS · 4min · subdomains aleatórios",alert:true},
      {id:2,icon:"✅",desc:"host-02 → google.com",detail:"12× NETWORK_DNS · 5min · consultas normais",alert:false},
      {id:3,icon:"🌀",desc:"host-03 → malware-c2.ru",detail:"120× NETWORK_DNS · 3min · payload em subdomínio",alert:true},
      {id:4,icon:"✅",desc:"host-04 → corp-dns.local",detail:"30× NETWORK_DNS · 5min · abaixo do limiar",alert:false},
    ],
    explanation:'NETWORK_DNS (não NETWORK_CONNECTION!) com network.dns.questions.name. Agrupamento duplo $host,$domain evita falsos positivos. 50+ queries/5min é o padrão de tunelamento.',
  },
  { id:4,cat:"TÉCNICA",emoji:"💉",title:"Process Injection",tag:"ENDPOINT",tagColor:"#f97316",xp:300,mitre:"T1055",
    story:"lsass.exe ou winlogon.exe nunca devem lançar shells. Detecte PROCESS_LAUNCH com pai suspeito e filho sendo cmd.exe ou powershell.exe.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "process_injection"',correct:true},{id:"b",text:'severity = "CRITICAL"',correct:true},
        {id:"c",text:'severity = "LOW"',correct:false},{id:"d",text:'rule_name = "new_process"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Filtre processo pai e filho corretos",multi:true,minCorrect:3,options:[
        {id:"a",text:'$e.metadata.event_type = "PROCESS_LAUNCH"',correct:true},
        {id:"b",text:'$e.metadata.event_type = "USER_LOGIN"',correct:false},
        {id:"c",text:'re.regex($e.principal.process.file.full_path, `lsass\\.exe|winlogon\\.exe`) nocase',correct:true},
        {id:"d",text:'$e.principal.process.file.full_path = "explorer.exe"',correct:false},
        {id:"e",text:'re.regex($e.target.process.file.full_path, `cmd\\.exe|powershell\\.exe`) nocase',correct:true},
        {id:"f",text:'$e.principal.hostname = "DC01"',correct:false}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por host em 5min",multi:false,minCorrect:1,options:[
        {id:"a",text:"$e.principal.hostname over 5m",correct:true},{id:"b",text:"$e.principal.ip over 5m",correct:false},{id:"c",text:"$e.principal.user.userid over 5m",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Um evento já é crítico",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e >= 1",correct:true},{id:"b",text:"#e > 3",correct:false},{id:"c",text:"#e > 10",correct:false}]},
    ],
    logs:[
      {id:1,icon:"💉",desc:"lsass.exe → cmd.exe",detail:"PROCESS_LAUNCH · DC01 · injeção clássica",alert:true},
      {id:2,icon:"✅",desc:"explorer.exe → notepad.exe",detail:"PROCESS_LAUNCH · processo pai legítimo",alert:false},
      {id:3,icon:"💉",desc:"winlogon.exe → powershell",detail:"PROCESS_LAUNCH · WS01 · shell suspeito",alert:true},
      {id:4,icon:"✅",desc:"chrome.exe → chrome.exe",detail:"PROCESS_LAUNCH · subprocesso normal",alert:false},
    ],
    explanation:'PROCESS_LAUNCH com re.regex() em principal.process (pai) e target.process (filho). O operador nocase é nativo YARA-L 2.0. Um único evento deste tipo já é CRÍTICO.',
  },
  { id:5,cat:"TÉCNICA",emoji:"🦠",title:"Ransomware",tag:"ENDPOINT",tagColor:"#ff4d4d",xp:350,mitre:"T1486",
    story:"Endpoint criando centenas de arquivos .encrypted ou .locked em 2 minutos — sinal clássico de ransomware em ação.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "ransomware_encryption"',correct:true},{id:"b",text:'severity = "CRITICAL"',correct:true},
        {id:"c",text:'severity = "MEDIUM"',correct:false},{id:"d",text:'rule_name = "file_create"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"FILE_CREATION com extensão suspeita",multi:true,minCorrect:3,options:[
        {id:"a",text:'$e.metadata.event_type = "FILE_CREATION"',correct:true},
        {id:"b",text:'$e.metadata.event_type = "PROCESS_LAUNCH"',correct:false},
        {id:"c",text:'re.regex($e.target.file.full_path, `\\.encrypted|\\.locked|\\.crypt`) nocase',correct:true},
        {id:"d",text:'$e.target.file.size > 1000000',correct:false},
        {id:"e",text:"$e.principal.hostname = $host",correct:true},
        {id:"f",text:"$e.target.file.mime_type = $mime",correct:false}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por host em 2 minutos",multi:false,minCorrect:1,options:[
        {id:"a",text:"$host over 2m",correct:true},{id:"b",text:"$host over 1h",correct:false},{id:"c",text:"$ip over 2m",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Mais de 20 arquivos suspeitos",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e > 20",correct:true},{id:"b",text:"#e >= 1",correct:false},{id:"c",text:"#e > 500",correct:false}]},
    ],
    logs:[
      {id:1,icon:"🦠",desc:"DESKTOP-01",detail:"350× FILE_CREATION · .encrypted · 1min 40s",alert:true},
      {id:2,icon:"✅",desc:"LAPTOP-05",detail:"3× FILE_CREATION · .docx · arquivos normais",alert:false},
      {id:3,icon:"🦠",desc:"SERVER-DB",detail:"89× FILE_CREATION · .locked · 1min 55s",alert:true},
      {id:4,icon:"✅",desc:"DESKTOP-02",detail:"10× FILE_CREATION · .crypt · abaixo do limiar",alert:false},
    ],
    explanation:'FILE_CREATION + re.regex() nas extensões + janela curtíssima de 2min. Threshold de 20 arquivos elimina deploys legítimos — ransomware é muito mais agressivo.',
  },
  { id:6,cat:"TÉCNICA",emoji:"📡",title:"C2 Beaconing",tag:"C2 COMM",tagColor:"#00c4cc",xp:400,mitre:"T1071",
    story:"Malware faz check-ins periódicos para o servidor do atacante. Detecte 100+ conexões para o mesmo IP externo em 30 minutos.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "c2_beaconing"',correct:true},{id:"b",text:'severity = "CRITICAL"',correct:true},
        {id:"c",text:'severity = "INFO"',correct:false},{id:"d",text:'rule_name = "outbound_conn"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Filtre conexões externas repetitivas",multi:true,minCorrect:4,options:[
        {id:"a",text:'$e.metadata.event_type = "NETWORK_CONNECTION"',correct:true},
        {id:"b",text:'$e.metadata.event_type = "NETWORK_DNS"',correct:false},
        {id:"c",text:'not net.ip_in_range_cidr($e.target.ip, "10.0.0.0/8")',correct:true},
        {id:"d",text:'not net.ip_in_range_cidr($e.target.ip, "192.168.0.0/16")',correct:true},
        {id:"e",text:"$e.principal.hostname = $host",correct:true},
        {id:"f",text:'$e.network.ip_protocol = "UDP"',correct:false}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por host em 30min",multi:false,minCorrect:1,options:[
        {id:"a",text:"$host over 30m",correct:true},{id:"b",text:"$host over 5m",correct:false},{id:"c",text:"$dest over 30m",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Mais de 100 conexões",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e > 100",correct:true},{id:"b",text:"#e > 5",correct:false},{id:"c",text:"#e >= 1",correct:false}]},
    ],
    logs:[
      {id:1,icon:"📡",desc:"WS-FIN-01 → 185.220.101.5",detail:"142× NETWORK_CONNECTION · 28min · externo",alert:true},
      {id:2,icon:"✅",desc:"WS-DEV-03 → github.com",detail:"15× NETWORK_CONNECTION · 30min · normal",alert:false},
      {id:3,icon:"📡",desc:"WS-HR-07 → 91.121.55.34",detail:"230× NETWORK_CONNECTION · 25min · externo",alert:true},
      {id:4,icon:"✅",desc:"WS-IT-04 → 192.168.1.1",detail:"500× NETWORK_CONNECTION · RFC1918 interno",alert:false},
    ],
    explanation:'Dois cidr() com not para excluir RFC1918 (10.x e 192.168.x). 100+ conexões/30min captura o heartbeat do malware sem alertar tráfego legítimo de APIs.',
  },

  // REGRAS COMPORTAMENTAIS
  { id:7,cat:"COMPORTAMENTAL",emoji:"🌙",title:"Acesso Fora do Horário",tag:"COMPORTAMENTAL",tagColor:"#818cf8",xp:300,mitre:"T1078 — Valid Accounts",
    story:"Analistas legítimos não acessam sistemas sensíveis às 3h da manhã. Detecte USER_LOGIN com ALLOW fora do horário comercial (antes das 8h ou depois das 20h) usando a função timestamp.get_hour().",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados da regra comportamental",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "after_hours_access"',correct:true},{id:"b",text:'severity = "MEDIUM"',correct:true},
        {id:"c",text:'severity = "LOW"',correct:false},{id:"d",text:'rule_name = "login_monitor"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Filtre login ALLOW com horário suspeito",multi:true,minCorrect:4,options:[
        {id:"a",text:'$e.metadata.event_type = "USER_LOGIN"',correct:true},
        {id:"b",text:'$e.security_result.action = "ALLOW"',correct:true},
        {id:"c",text:'$e.security_result.action = "BLOCK"',correct:false},
        {id:"d",text:'timestamp.get_hour($e.metadata.event_timestamp, "America/Sao_Paulo") < 8',correct:true},
        {id:"e",text:"$e.principal.user.userid = $user",correct:true},
        {id:"f",text:'timestamp.get_hour($e.metadata.event_timestamp, "UTC") < 8',correct:false}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por usuário em 1h",multi:false,minCorrect:1,options:[
        {id:"a",text:"$user over 1h",correct:true},{id:"b",text:"$user over 5m",correct:false},{id:"c",text:"$e.principal.ip over 1h",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Um único login fora do horário já dispara",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e >= 1",correct:true},{id:"b",text:"#e > 5",correct:false},{id:"c",text:"#e > 10",correct:false}]},
    ],
    logs:[
      {id:1,icon:"🌙",desc:"ana.silva — 03:14",detail:"USER_LOGIN ALLOW · America/SP · fora do horário",alert:true},
      {id:2,icon:"☀️",desc:"carlos.m — 09:30",detail:"USER_LOGIN ALLOW · America/SP · horário normal",alert:false},
      {id:3,icon:"🌙",desc:"root — 02:47",detail:"USER_LOGIN ALLOW · America/SP · madrugada",alert:true},
      {id:4,icon:"🔒",desc:"hacker — 03:00",detail:"USER_LOGIN BLOCK · tentativa bloqueada",alert:false},
      {id:5,icon:"☀️",desc:"pedro.c — 14:22",detail:"USER_LOGIN ALLOW · America/SP · horário comercial",alert:false},
    ],
    explanation:'timestamp.get_hour() é função nativa YARA-L 2.0. Usar timezone correto ("America/Sao_Paulo") é crítico — UTC pode criar falsos negativos. BLOCK não interessa — só logins bem-sucedidos fora do horário.',
  },
  { id:8,cat:"COMPORTAMENTAL",emoji:"✈️",title:"Impossible Travel",tag:"COMPORTAMENTAL",tagColor:"#ec4899",xp:350,mitre:"T1078 — Valid Accounts",
    story:"Mesmo usuário logou em São Paulo e 10 minutos depois em Moscou. Fisicamente impossível. Detecte dois USER_LOGIN ALLOW de países diferentes do mesmo usuário em 30 minutos.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "impossible_travel"',correct:true},{id:"b",text:'severity = "HIGH"',correct:true},
        {id:"c",text:'severity = "LOW"',correct:false},{id:"d",text:'rule_name = "geo_login"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Dois eventos $e1 e $e2 — mesmo usuário",multi:true,minCorrect:4,options:[
        {id:"a",text:'$e1.metadata.event_type = "USER_LOGIN"',correct:true},
        {id:"b",text:'$e2.metadata.event_type = "USER_LOGIN"',correct:true},
        {id:"c",text:'$e1.security_result.action = "ALLOW"',correct:true},
        {id:"d",text:'$e1.security_result.action = "BLOCK"',correct:false},
        {id:"e",text:"$e1.principal.user.userid = $user",correct:true},
        {id:"f",text:"$e2.principal.user.userid = $user",correct:false}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por usuário em 30 minutos",multi:false,minCorrect:1,options:[
        {id:"a",text:"$user over 30m",correct:true},{id:"b",text:"$user over 24h",correct:false},{id:"c",text:"$ip over 30m",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Ambos os eventos presentes",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e1 >= 1 and #e2 >= 1",correct:true},{id:"b",text:"#e1 > 5",correct:false},{id:"c",text:"#e1 >= 1",correct:false}]},
    ],
    logs:[
      {id:1,icon:"✈️",desc:"ana.silva",detail:"LOGIN ALLOW · BR 09:00 → RU 09:10 · impossível",alert:true},
      {id:2,icon:"✅",desc:"carlos.mendes",detail:"LOGIN ALLOW · BR 09:00 → BR 09:30 · mesmo país",alert:false},
      {id:3,icon:"✈️",desc:"pedro.costa",detail:"LOGIN ALLOW · US 14:00 → CN 14:08 · impossível",alert:true},
      {id:4,icon:"🔒",desc:"maria.lima",detail:"LOGIN BLOCK · BR → RU · bloqueado (não ALLOW)",alert:false},
    ],
    explanation:'Correlação de dois event variables ($e1, $e2) via placeholder $user. O campo de geolocalização é principal.ip_geo_artifact.location.country_or_region. Para garantir ordem cronológica, use: $e1.metadata.event_timestamp.seconds < $e2.metadata.event_timestamp.seconds na seção events. Community Guide: timestamp ordering é obrigatório em multi-event correlations.',
  },
  { id:9,cat:"COMPORTAMENTAL",emoji:"📧",title:"Email Exfiltration",tag:"INSIDER THREAT",tagColor:"#ec4899",xp:400,mitre:"T1114.003",
    story:"Funcionário insatisfeito está encaminhando emails corporativos para conta pessoal. Detecte mais de 20 EMAIL_TRANSACTION para domínios externos em 1 hora pelo mesmo usuário.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "email_exfiltration"',correct:true},{id:"b",text:'severity = "HIGH"',correct:true},
        {id:"c",text:'severity = "LOW"',correct:false},{id:"d",text:'rule_name = "email_send"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"EMAIL_TRANSACTION para domínios externos",multi:true,minCorrect:3,options:[
        {id:"a",text:'$e.metadata.event_type = "EMAIL_TRANSACTION"',correct:true},
        {id:"b",text:'$e.metadata.event_type = "NETWORK_CONNECTION"',correct:false},
        {id:"c",text:'not $e.network.email.to.user.email_addresses in %corporate_domains',correct:true},
        {id:"d",text:'$e.network.email.to.user.email_addresses = "external@gmail.com"',correct:false},
        {id:"e",text:"$e.principal.user.userid = $user",correct:true},
        {id:"f",text:"$e.target.port = 25",correct:false}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por usuário em 1h",multi:false,minCorrect:1,options:[
        {id:"a",text:"$user over 1h",correct:true},{id:"b",text:"$user over 5m",correct:false},{id:"c",text:"$dest over 1h",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Mais de 20 emails externos",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e > 20",correct:true},{id:"b",text:"#e >= 1",correct:false},{id:"c",text:"#e > 100",correct:false}]},
    ],
    logs:[
      {id:1,icon:"📧",desc:"jose.silva → gmail.com",detail:"35× EMAIL_TRANSACTION · externo · 45min",alert:true},
      {id:2,icon:"✅",desc:"maria → colega@corp.com",detail:"5× EMAIL_TRANSACTION · domínio interno",alert:false},
      {id:3,icon:"📧",desc:"pedro → hotmail.com",detail:"28× EMAIL_TRANSACTION · externo · 1h",alert:true},
      {id:4,icon:"✅",desc:"ana → parceiro@empresa.com",detail:"3× EMAIL_TRANSACTION · domínio externo mas baixo volume",alert:false},
    ],
    explanation:'EMAIL_TRANSACTION + reference list %corporate_domains (operador in %) para identificar destinatários externos. O operador % referencia listas de referência do Google SecOps — mais flexível que hardcodar domínios.',
  },
  { id:10,cat:"COMPORTAMENTAL",emoji:"🚪",title:"Lateral Movement RDP",tag:"MOVIMENTO",tagColor:"#f97316",xp:400,mitre:"T1021.001",
    story:"Atacante comprometeu uma máquina e está se movendo pela rede via RDP. Detecte 3+ conexões RDP (porta 3389) originárias do mesmo IP para destinos diferentes em 15 minutos.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "rdp_lateral_movement"',correct:true},{id:"b",text:'severity = "HIGH"',correct:true},
        {id:"c",text:'severity = "LOW"',correct:false},{id:"d",text:'rule_name = "rdp_login"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"NETWORK_CONNECTION para porta RDP",multi:true,minCorrect:4,options:[
        {id:"a",text:'$e.metadata.event_type = "NETWORK_CONNECTION"',correct:true},
        {id:"b",text:'$e.metadata.event_type = "USER_LOGIN"',correct:false},
        {id:"c",text:"$e.target.port = 3389",correct:true},
        {id:"d",text:"$e.target.port = 22",correct:false},
        {id:"e",text:'$e.security_result.action = "ALLOW"',correct:true},
        {id:"f",text:"$e.principal.ip = $src",correct:true},
        {id:"g",text:"$e.target.ip = $src",correct:false}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por IP origem em 15min",multi:false,minCorrect:1,options:[
        {id:"a",text:"$src over 15m",correct:true},{id:"b",text:"$src over 1h",correct:false},{id:"c",text:"$dst over 15m",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Mais de 3 conexões RDP",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e > 3",correct:true},{id:"b",text:"#e >= 1",correct:false},{id:"c",text:"#e > 50",correct:false}]},
    ],
    logs:[
      {id:1,icon:"🚪",desc:"192.168.10.5 → múltiplos hosts",detail:"7× NETWORK_CONNECTION · RDP 3389 · ALLOW · 12min",alert:true},
      {id:2,icon:"✅",desc:"192.168.1.100 → 192.168.1.200",detail:"1× NETWORK_CONNECTION · RDP 3389 · admin legítimo",alert:false},
      {id:3,icon:"🚪",desc:"10.0.5.22 → 5 servidores",detail:"5× NETWORK_CONNECTION · RDP 3389 · ALLOW · 10min",alert:true},
      {id:4,icon:"✅",desc:"10.0.0.1 → 10.0.0.2",detail:"2× NETWORK_CONNECTION · SSH porta 22 (não RDP)",alert:false},
    ],
    explanation:'Porta 3389 é RDP. Agrupando por $src detecta um host se movendo para múltiplos destinos. Threshold baixo (>3) porque 3 saltos RDP em 15min é claramente anômalo. Em regras multi-evento, garanta ordem cronológica com $e1.metadata.event_timestamp.seconds < $e2.metadata.event_timestamp.seconds.',
  },
  { id:11,cat:"COMPORTAMENTAL",emoji:"👁",title:"Privilege Escalation",tag:"IDENTIDADE",tagColor:"#a78bfa",xp:450,mitre:"T1078 — Valid Accounts",
    story:"Usuário comum ganhou role de 'admin' em múltiplos sistemas. Detecte USER_RESOURCE_UPDATE_PERMISSIONS com role = admin para qualquer usuário.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "privilege_escalation"',correct:true},{id:"b",text:'severity = "CRITICAL"',correct:true},
        {id:"c",text:'severity = "MEDIUM"',correct:false},{id:"d",text:'rule_name = "admin_login"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Filtre o event_type correto de mudança de role",multi:true,minCorrect:3,options:[
        {id:"a",text:'$e.metadata.event_type = "USER_RESOURCE_UPDATE_PERMISSIONS"',correct:true},
        {id:"b",text:'$e.metadata.event_type = "USER_ACCOUNT_MODIFICATION"',correct:false},
        {id:"c",text:'$e.target.user.attribute.roles.name = "admin"',correct:true},
        {id:"d",text:'$e.target.user.attribute.roles.name = "viewer"',correct:false},
        {id:"e",text:"$e.principal.user.userid = $user",correct:true},
        {id:"f",text:"$e.principal.ip = $ip",correct:false}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por usuário em 15min",multi:false,minCorrect:1,options:[
        {id:"a",text:"$user over 15m",correct:true},{id:"b",text:"$user over 24h",correct:false},{id:"c",text:"$ip over 15m",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Um único evento já é crítico",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e >= 1",correct:true},{id:"b",text:"#e > 5",correct:false},{id:"c",text:"#e > 10",correct:false}]},
    ],
    logs:[
      {id:1,icon:"👑",desc:"hacker_user",detail:"USER_RESOURCE_UPDATE → role: admin · 3 sistemas",alert:true},
      {id:2,icon:"👤",desc:"normal_user",detail:"USER_RESOURCE_UPDATE → role: viewer",alert:false},
      {id:3,icon:"👑",desc:"svc_account",detail:"USER_RESOURCE_UPDATE → role: admin · 1 sistema",alert:true},
      {id:4,icon:"🔐",desc:"john.doe",detail:"USER_ACCOUNT_MODIFICATION (event_type diferente)",alert:false},
    ],
    explanation:'USER_RESOURCE_UPDATE_PERMISSIONS é o event_type real do UDM para mudança de roles. target.user.attribute.roles.name é o campo exato da documentação Google SecOps.',
  },
  { id:12,cat:"COMPORTAMENTAL",emoji:"🗂",title:"Mass File Deletion",tag:"INSIDER THREAT",tagColor:"#ff4d4d",xp:500,mitre:"T1485 — Data Destruction",
    story:"Funcionário demitido está deletando arquivos críticos antes de sair. Detecte mais de 50 FILE_DELETION em 5 minutos pelo mesmo usuário.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "mass_file_deletion"',correct:true},{id:"b",text:'severity = "CRITICAL"',correct:true},
        {id:"c",text:'severity = "LOW"',correct:false},{id:"d",text:'rule_name = "file_removed"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"FILE_DELETION com usuário identificado",multi:true,minCorrect:3,options:[
        {id:"a",text:'$e.metadata.event_type = "FILE_DELETION"',correct:true},
        {id:"b",text:'$e.metadata.event_type = "FILE_CREATION"',correct:false},
        {id:"c",text:"$e.principal.user.userid = $user",correct:true},
        {id:"d",text:"$e.target.file.size > 0",correct:false},
        {id:"e",text:"$e.principal.hostname = $host",correct:true},
        {id:"f",text:"$e.target.file.mime_type = $mime",correct:false}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por usuário em 5 minutos",multi:false,minCorrect:1,options:[
        {id:"a",text:"$user over 5m",correct:true},{id:"b",text:"$user over 1h",correct:false},{id:"c",text:"$host over 5m",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Mais de 50 deletions em 5min",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e > 50",correct:true},{id:"b",text:"#e > 5",correct:false},{id:"c",text:"#e >= 1",correct:false}]},
    ],
    logs:[
      {id:1,icon:"🗂",desc:"pedro.demitido",detail:"380× FILE_DELETION · pasta /projetos · 4min",alert:true},
      {id:2,icon:"✅",desc:"sistema_backup",detail:"20× FILE_DELETION · rotina noturna · normal",alert:false},
      {id:3,icon:"🗂",desc:"maria.insatisfeita",detail:"95× FILE_DELETION · /financeiro · 3min",alert:true},
      {id:4,icon:"✅",desc:"dev.auto",detail:"10× FILE_DELETION · arquivos temporários",alert:false},
    ],
    explanation:'FILE_DELETION é o event_type correto para deletions no UDM. Janela de 5min com threshold 50 captura destruição em massa sem alertar limpezas de temp files ou rotinas de backup.',
  },

  // RISCOS DE IA
  { id:13,cat:"IA",emoji:"🤖",title:"Shadow AI",tag:"AI RISK",tagColor:"#a78bfa",xp:300,mitre:"T1567 — Exfil Over Web Service",
    story:"Política corporativa proíbe o uso de serviços de IA externos não aprovados. Detecte funcionários acessando ChatGPT, Claude, Gemini ou similares usando a reference list %unauthorized_ai_services — mais de 5 conexões em 1 hora dispara alerta.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados da regra",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "shadow_ai_usage"',correct:true},
        {id:"b",text:'severity = "MEDIUM"',correct:true},
        {id:"c",text:'rule_name = "ai_access"',correct:false},
        {id:"d",text:'severity = "LOW"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"NETWORK_CONNECTION com reference list de domínios de IA",multi:true,minCorrect:3,options:[
        {id:"a",text:'$e.metadata.event_type = "NETWORK_CONNECTION"',correct:true},
        {id:"b",text:'$e.metadata.event_type = "NETWORK_DNS"',correct:false},
        {id:"c",text:"$e.target.hostname in %unauthorized_ai_services",correct:true},
        {id:"d",text:'$e.target.hostname = "openai.com"',correct:false},
        {id:"e",text:"$e.principal.user.userid = $user",correct:true},
        {id:"f",text:"$e.security_result.action = $act",correct:false}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por usuário em 1h",multi:false,minCorrect:1,options:[
        {id:"a",text:"$user over 1h",correct:true},
        {id:"b",text:"$user over 5m",correct:false},
        {id:"c",text:"$e.target.hostname over 1h",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Mais de 5 conexões para IA não autorizada",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e > 5",correct:true},
        {id:"b",text:"#e >= 1",correct:false},
        {id:"c",text:"#e > 50",correct:false}]},
    ],
    logs:[
      {id:1,icon:"🤖",desc:"joao.silva → chat.openai.com",detail:"18× NETWORK_CONNECTION · 45min · IP corporativo",alert:true},
      {id:2,icon:"✅",desc:"maria.dev → vertex.ai.google",detail:"3× NETWORK_CONNECTION · GCP aprovado via política",alert:false},
      {id:3,icon:"🤖",desc:"pedro.hr → claude.ai",detail:"12× NETWORK_CONNECTION · 1h · não autorizado",alert:true},
      {id:4,icon:"✅",desc:"ana.ti → gemini.google.com",detail:"2× NETWORK_CONNECTION · abaixo do limiar",alert:false},
      {id:5,icon:"🤖",desc:"carlos.fin → api.anthropic.com",detail:"9× NETWORK_CONNECTION · 30min · não autorizado",alert:true},
    ],
    explanation:'Reference lists (%unauthorized_ai_services) são listas mantidas centralmente no Google SecOps — muito mais flexíveis que hardcodar domínios. Ao adicionar um novo serviço de IA à lista, todas as regras que a referenciam passam a detectá-lo automaticamente.',
  },

  { id:14,cat:"IA",emoji:"🧠",title:"Exfiltração de Modelo ML",tag:"AI RISK",tagColor:"#a78bfa",xp:450,mitre:"T1048 — Exfiltration Over Alternative Protocol",
    story:"Pesquisador de ML está enviando um modelo proprietário treinado internamente para um servidor externo. Arquivos .safetensors, .onnx ou .pkl acima de 1 GB enviados para fora da rede são sinal claro de roubo de propriedade intelectual de IA.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados da regra",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "ml_model_exfiltration"',correct:true},
        {id:"b",text:'severity = "CRITICAL"',correct:true},
        {id:"c",text:'severity = "LOW"',correct:false},
        {id:"d",text:'rule_name = "file_upload"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Arquivo de modelo ML grande enviado para exterior",multi:true,minCorrect:4,options:[
        {id:"a",text:'$e.metadata.event_type = "NETWORK_CONNECTION"',correct:true},
        {id:"b",text:'$e.metadata.event_type = "FILE_CREATION"',correct:false},
        {id:"c",text:"$e.network.sent_bytes > 1073741824",correct:true},
        {id:"d",text:"$e.network.sent_bytes > 1024",correct:false},
        {id:"e",text:'re.regex($e.principal.process.file.full_path, `python|jupyter|pytorch`) nocase',correct:true},
        {id:"f",text:'not net.ip_in_range_cidr($e.target.ip, "10.0.0.0/8")',correct:true},
        {id:"g",text:'$e.target.port = 443',correct:false}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por usuário em 30 minutos",multi:false,minCorrect:1,options:[
        {id:"a",text:"$e.principal.user.userid over 30m",correct:true},
        {id:"b",text:"$e.principal.ip over 30m",correct:false},
        {id:"c",text:"$e.target.ip over 30m",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Um único envio já é suficiente",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e >= 1",correct:true},
        {id:"b",text:"#e > 5",correct:false},
        {id:"c",text:"#e > 10",correct:false}]},
    ],
    logs:[
      {id:1,icon:"🧠",desc:"researcher01 · python3",detail:"1.8 GB · NETWORK_CONNECTION → 185.45.12.99 · externo",alert:true},
      {id:2,icon:"✅",desc:"ml.team · jupyter",detail:"500 MB · NETWORK_CONNECTION → 10.0.1.50 · MLflow interno",alert:false},
      {id:3,icon:"🧠",desc:"data.sci · pytorch",detail:"3.2 GB · NETWORK_CONNECTION → 203.0.113.5 · externo",alert:true},
      {id:4,icon:"✅",desc:"devops · kubectl",detail:"50 MB · NETWORK_CONNECTION → externo · processo não é ML",alert:false},
    ],
    explanation:'1073741824 bytes = 1 GB. Modelos de IA modernos (LLaMA, Stable Diffusion etc.) pesam vários GB — muito acima de transferências normais. re.regex() no processo (python/jupyter/pytorch) reduz falsos positivos: exfiltração de modelo é quase sempre feita via ferramentas ML.',
  },

  { id:15,cat:"IA",emoji:"👾",title:"LLM como Canal C2",tag:"AI RISK",tagColor:"#a78bfa",xp:550,mitre:"T1102 — Web Service as C2",
    story:"Malware avançado usa APIs de LLMs (OpenAI, Anthropic) como canal de C2 — os comandos chegam disfarçados de respostas do chatbot. Detecte um processo não-browser fazendo beaconing regular para endpoints conhecidos de IA mais de 60 vezes em 15 minutos.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados da regra",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "llm_c2_channel"',correct:true},
        {id:"b",text:'severity = "CRITICAL"',correct:true},
        {id:"c",text:'severity = "LOW"',correct:false},
        {id:"d",text:'rule_name = "ai_usage"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Processo suspeito beaconando para APIs de IA",multi:true,minCorrect:4,options:[
        {id:"a",text:'$e.metadata.event_type = "NETWORK_CONNECTION"',correct:true},
        {id:"b",text:'$e.metadata.event_type = "NETWORK_DNS"',correct:false},
        {id:"c",text:"$e.target.hostname in %ai_api_endpoints",correct:true},
        {id:"d",text:'$e.target.hostname = "openai.com"',correct:false},
        {id:"e",text:'not re.regex($e.principal.process.file.full_path, `chrome|firefox|edge|safari`) nocase',correct:true},
        {id:"f",text:"$e.principal.hostname = $host",correct:true},
        {id:"g",text:'$e.security_result.action = "BLOCK"',correct:false}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe por host em 15 minutos",multi:false,minCorrect:1,options:[
        {id:"a",text:"$host over 15m",correct:true},
        {id:"b",text:"$host over 1h",correct:false},
        {id:"c",text:"$e.principal.ip over 15m",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Mais de 60 chamadas em 15min — beaconing de LLM",multi:false,minCorrect:1,options:[
        {id:"a",text:"#e > 60",correct:true},
        {id:"b",text:"#e > 5",correct:false},
        {id:"c",text:"#e >= 1",correct:false}]},
    ],
    logs:[
      {id:1,icon:"👾",desc:"WS-FIN-03 · svchost.exe",detail:"95× NETWORK_CONNECTION → api.openai.com · 12min · não-browser",alert:true},
      {id:2,icon:"✅",desc:"WS-DEV-01 · chrome.exe",detail:"40× NETWORK_CONNECTION → api.anthropic.com · browser legítimo",alert:false},
      {id:3,icon:"👾",desc:"WS-HR-09 · updater.exe",detail:"130× NETWORK_CONNECTION → api.openai.com · 10min · processo suspeito",alert:true},
      {id:4,icon:"✅",desc:"WS-IT-02 · python.exe",detail:"20× NETWORK_CONNECTION → api.openai.com · abaixo do limiar",alert:false},
      {id:5,icon:"✅",desc:"WS-MKT-05 · msedge.exe",detail:"80× NETWORK_CONNECTION → claude.ai · browser detectado",alert:false},
    ],
    explanation:'LLM-as-C2 é uma técnica emergente: malware envia dados no prompt e recebe comandos na resposta — tráfego parece legítimo para um firewall. A chave é excluir browsers (re.regex + not) e detectar processos incomuns batendo em AI APIs com frequência de beaconing (>60/15min).',
  },
  // ─── CLOUD 1: GCP Storage Bucket Público ───────────────────────────────────
  { id:16,cat:"CLOUD",emoji:"🪣",title:"GCP Storage Bucket Público",tag:"GCP STORAGE",tagColor:"#4285F4",xp:200,mitre:"T1562",
    story:"Um bucket do Cloud Storage foi aberto para a internet ao adicionar 'allUsers' na policy IAM. Detecte mudanças de permissão que expõem buckets publicamente.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados da regra",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "gcp_storage_bucket_public"',correct:true},
        {id:"b",text:'rule_name = "bucket_ok"',correct:false},
        {id:"c",text:'severity = "HIGH"',correct:true},
        {id:"d",text:'severity = "INFO"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Filtre eventos IAM em Storage buckets",multi:true,minCorrect:4,options:[
        {id:"a",text:'$gcp.metadata.event_type = "USER_RESOURCE_UPDATE_PERMISSIONS"',correct:true},
        {id:"b",text:'$gcp.metadata.event_type = "USER_LOGIN"',correct:false},
        {id:"c",text:'$gcp.metadata.product_name = "Google Cloud Storage"',correct:true},
        {id:"d",text:'$gcp.target.resource.resource_type = "STORAGE_BUCKET"',correct:true},
        {id:"e",text:'$gcp.target.resource.resource_type = "VM_INSTANCE"',correct:false},
        {id:"f",text:'$gcp.target.resource.attribute.labels["ser_binding_deltas_member"] = /allUsers|allAuthenticatedUsers/',correct:true}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe pelo nome do bucket em 1h",multi:false,minCorrect:1,options:[
        {id:"a",text:"$bucket over 1h",correct:true},
        {id:"b",text:"$ip over 30d",correct:false},
        {id:"c",text:"$user over 1s",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Dispare em qualquer ocorrência",multi:false,minCorrect:1,options:[
        {id:"a",text:"#gcp >= 1",correct:true},
        {id:"b",text:"#gcp > 1000",correct:false},
        {id:"c",text:"#gcp < 0",correct:false}]},
    ],
    logs:[
      {id:1,icon:"🪣",desc:"prod-backups",detail:"setIamPermissions · ADD allUsers · roles/storage.objectViewer",alert:true},
      {id:2,icon:"✅",desc:"team-shared",detail:"setIamPermissions · ADD user:ana@empresa.com",alert:false},
      {id:3,icon:"🪣",desc:"customer-data",detail:"setIamPermissions · ADD allAuthenticatedUsers · roles/storage.admin",alert:true},
      {id:4,icon:"✅",desc:"logs-archive",detail:"setIamPermissions · REMOVE allUsers",alert:false},
    ],
    explanation:'A regra real do Google detecta storage.setIamPermissions com ADD de allUsers ou allAuthenticatedUsers em STORAGE_BUCKET. Esses dois membros expõem o bucket à internet inteira — MITRE T1562 (Impair Defenses). Adicionar usuário nomeado (log 2) ou remover acesso público (log 4) são operações legítimas.',
  },

  // ─── CLOUD 2: GCP Firewall Aberto pro Mundo ────────────────────────────────
  { id:17,cat:"CLOUD",emoji:"🔥",title:"GCP Firewall Aberto pro Mundo",tag:"GCP NETWORK",tagColor:"#EA4335",xp:225,mitre:"T1562",
    story:"Uma regra de firewall do Compute Engine foi criada liberando 0.0.0.0/0 em todos os protocolos. Qualquer IP do mundo pode acessar a VM. Detecte essa criação antes que seja tarde.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados da regra",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "gcp_firewall_opened_to_world"',correct:true},
        {id:"b",text:'rule_name = "firewall_ok"',correct:false},
        {id:"c",text:'severity = "HIGH"',correct:true},
        {id:"d",text:'severity = "LOW"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Filtre a criação de firewall aberta ao mundo",multi:true,minCorrect:4,options:[
        {id:"a",text:'$gcp.metadata.event_type = "RESOURCE_CREATION"',correct:true},
        {id:"b",text:'$gcp.metadata.event_type = "USER_LOGIN"',correct:false},
        {id:"c",text:'$gcp.metadata.product_name = "Google Compute Engine"',correct:true},
        {id:"d",text:'$gcp.metadata.product_event_type = /compute.firewalls.insert$/ nocase',correct:true},
        {id:"e",text:'$gcp.metadata.product_event_type = /compute.firewalls.delete$/ nocase',correct:false},
        {id:"f",text:'$gcp.target.resource.attribute.labels["source_ranges"] = "0.0.0.0/0"',correct:true},
        {id:"g",text:'$gcp.security_result.detection_fields["allowed_ipprotocol"] = "all"',correct:true}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Sem agrupamento — disparar por evento",multi:false,minCorrect:1,options:[
        {id:"a",text:"(sem cláusula match — dispara por evento individual)",correct:true},
        {id:"b",text:"$ip over 10m",correct:false},
        {id:"c",text:"$rule over 1h",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Dispare em qualquer ocorrência",multi:false,minCorrect:1,options:[
        {id:"a",text:"#gcp >= 1",correct:true},
        {id:"b",text:"#gcp > 100",correct:false},
        {id:"c",text:"#gcp = 0",correct:false}]},
    ],
    logs:[
      {id:1,icon:"🔥",desc:"allow-all-world",detail:"compute.firewalls.insert · source_ranges=0.0.0.0/0 · protocol=all · RUNNING",alert:true},
      {id:2,icon:"✅",desc:"allow-http-internal",detail:"compute.firewalls.insert · source_ranges=10.0.0.0/8 · protocol=tcp:80",alert:false},
      {id:3,icon:"🔥",desc:"debug-open-fw",detail:"compute.firewalls.insert · source_ranges=0.0.0.0/0 · protocol=all · RUNNING",alert:true},
      {id:4,icon:"✅",desc:"deny-all-ingress",detail:"compute.firewalls.insert · direction=INGRESS · action=DENY · priority=65534",alert:false},
    ],
    explanation:'A regra real do Google detecta compute.firewalls.insert com source_ranges=0.0.0.0/0 E protocol=all — os dois juntos significam qualquer IP, qualquer protocolo. Sem cláusula match, a regra dispara por evento individual. Uma regra com source_ranges interno (log 2) ou DENY (log 4) é legítima. MITRE T1562 (Impair Defenses).',
  },

  // ─── CLOUD 3: Service Account Key Criada ───────────────────────────────────
  { id:18,cat:"CLOUD",emoji:"🔑",title:"Service Account Key Criada",tag:"GCP IAM",tagColor:"#FBBC04",xp:250,mitre:"T1098.001",
    story:"Um atacante com acesso ao IAM criou ou fez upload de uma chave de service account — uma técnica clássica de persistência em GCP. Detecte a criação/upload de chaves em janela de 30 minutos.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados da regra",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "gcp_service_account_key_created"',correct:true},
        {id:"b",text:'rule_name = "sa_login_ok"',correct:false},
        {id:"c",text:'severity = "MEDIUM"',correct:true},
        {id:"d",text:'severity = "INFO"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Filtre criação e upload de chaves IAM",multi:true,minCorrect:3,options:[
        {id:"a",text:'$gc.metadata.log_type = "GCP_CLOUDAUDIT"',correct:true},
        {id:"b",text:'$gc.metadata.product_name = "Google Cloud IAM"',correct:true},
        {id:"c",text:'$gc.metadata.product_name = "Google Cloud Storage"',correct:false},
        {id:"d",text:'$gc.metadata.product_event_type = "google.iam.admin.v1.CreateServiceAccountKey"',correct:true},
        {id:"e",text:'$gc.metadata.product_event_type = "google.iam.admin.v1.DeleteServiceAccountKey"',correct:false},
        {id:"f",text:'$gc.security_result.action = "ALLOW"',correct:true}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Agrupe pelo ID da chave em 30 minutos",multi:false,minCorrect:1,options:[
        {id:"a",text:"$sa_key_id over 30m",correct:true},
        {id:"b",text:"$user over 1h",correct:false},
        {id:"c",text:"$sa_key_id over 7d",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Dispare em qualquer ocorrência",multi:false,minCorrect:1,options:[
        {id:"a",text:"#gc >= 1",correct:true},
        {id:"b",text:"#gc > 50",correct:false},
        {id:"c",text:"#gc < 0",correct:false}]},
    ],
    logs:[
      {id:1,icon:"🔑",desc:"sa-prod@proj.iam",detail:"CreateServiceAccountKey · key_id=abc123 · ALLOW · user:hacker@ext.com",alert:true},
      {id:2,icon:"✅",desc:"terraform@proj.iam",detail:"CreateServiceAccountKey · key_id=tf456 · ALLOW · user:terraform-automation@proj.iam",alert:false},
      {id:3,icon:"🔑",desc:"sa-admin@proj.iam",detail:"UploadServiceAccountKey · key_id=upl789 · ALLOW · user:admin@empresa.com · IP externo",alert:true},
      {id:4,icon:"✅",desc:"ci-runner@proj.iam",detail:"DeleteServiceAccountKey · key_id=old111 · ALLOW · rotação automática",alert:false},
    ],
    explanation:'A regra detecta CreateServiceAccountKey OU UploadServiceAccountKey com ALLOW no Cloud IAM. Chaves de service account são credenciais de longa duração — atacantes as criam para manter acesso mesmo após remoção do usuário comprometido. Deleção (log 4) é legítima. O match por $sa_key_id over 30m agrupa eventos da mesma chave. MITRE T1098.001 (Account Manipulation: Additional Cloud Credentials).',
  },

  // ─── CLOUD 4: Google Workspace MFA Desativado ──────────────────────────────
  { id:19,cat:"CLOUD",emoji:"🔓",title:"Workspace MFA Desativado",tag:"WORKSPACE",tagColor:"#34A853",xp:275,mitre:"T1556",
    story:"Um administrador desativou o MFA obrigatório na organização do Google Workspace. Sem MFA, qualquer senha comprometida vira acesso total. Detecte essa mudança crítica de configuração.",
    steps:[
      {id:"meta",label:"META",color:"#fbbf24",icon:"🏷",instruction:"Metadados da regra",multi:true,minCorrect:2,options:[
        {id:"a",text:'rule_name = "workspace_mfa_disabled"',correct:true},
        {id:"b",text:'rule_name = "mfa_ok"',correct:false},
        {id:"c",text:'severity = "HIGH"',correct:true},
        {id:"d",text:'severity = "LOW"',correct:false}]},
      {id:"events",label:"EVENTS",color:"#00c4cc",icon:"📡",instruction:"Filtre eventos de desativação de MFA no Workspace",multi:true,minCorrect:4,options:[
        {id:"a",text:'$ws.metadata.vendor_name = "Google Workspace"',correct:true},
        {id:"b",text:'$ws.metadata.vendor_name = "Google Cloud Platform"',correct:false},
        {id:"c",text:'$ws.metadata.product_name = "admin"',correct:true},
        {id:"d",text:'$ws.metadata.product_event_type = "ENFORCE_STRONG_AUTHENTICATION"',correct:true},
        {id:"e",text:'$ws.metadata.product_event_type = "CREATE_USER"',correct:false},
        {id:"f",text:'$ws.target.labels["new_value"] = "false"',correct:true}]},
      {id:"match",label:"MATCH",color:"#a78bfa",icon:"🔗",instruction:"Sem agrupamento — disparar por evento",multi:false,minCorrect:1,options:[
        {id:"a",text:"(sem cláusula match — dispara por evento individual)",correct:true},
        {id:"b",text:"$admin over 1h",correct:false},
        {id:"c",text:"$org over 24h",correct:false}]},
      {id:"condition",label:"CONDITION",color:"#22d3a0",icon:"⚡",instruction:"Dispare em qualquer ocorrência",multi:false,minCorrect:1,options:[
        {id:"a",text:"#ws >= 1",correct:true},
        {id:"b",text:"#ws > 10",correct:false},
        {id:"c",text:"#ws = 0",correct:false}]},
    ],
    logs:[
      {id:1,icon:"🔓",desc:"admin@empresa.com",detail:"ENFORCE_STRONG_AUTHENTICATION · new_value=false · org=empresa.com",alert:true},
      {id:2,icon:"✅",desc:"admin@empresa.com",detail:"ENFORCE_STRONG_AUTHENTICATION · new_value=true · MFA reativado",alert:false},
      {id:3,icon:"🔓",desc:"superadmin@corp.com",detail:"ALLOW_STRONG_AUTHENTICATION · new_value=false · org=corp.com",alert:true},
      {id:4,icon:"✅",desc:"it@empresa.com",detail:"CREATE_USER · new_user=joao@empresa.com · MFA não alterado",alert:false},
    ],
    explanation:'A regra real do Google detecta ENFORCE_STRONG_AUTHENTICATION ou ALLOW_STRONG_AUTHENTICATION com new_value=false no log de admin do Workspace. Ativar MFA (new_value=true, log 2) é legítimo. Criar usuário (log 4) não altera MFA. Sem match porque cada evento de desativação é crítico individualmente. MITRE T1556 (Modify Authentication Process).',
  },

];

export {
  M0_PUZZLE,
  M1_LESSONS,
  M1_FINAL_CHALLENGE,
  M2_CHALLENGE,
  M3_LESSONS,
  M3_SKIP_CHALLENGE,
  M5_LESSONS,
  M5_FINAL_CHALLENGE,
  M6_PUZZLES,
  MISSIONS,
};
