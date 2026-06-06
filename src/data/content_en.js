// ─── TRADUÇÕES EN — sobrepõe strings do content.js ───────────────────────────
// Apenas campos em português são substituídos; termos técnicos permanecem iguais

export const M0_PUZZLE_EN = {
  nodes: [
    { id:"source",    label:"Log Source",           sub:"Endpoint · Firewall · Cloud · SaaS" },
    { id:"collect",   label:"Collection / Ingestion",sub:"Forwarder · BindPlane · Feed · Webhook" },
    { id:"secops",    label:"Google SecOps",          sub:"Cloud native SIEM/SOAR Platform" },
    { id:"parser",    label:"Parser → UDM",           sub:"Normalizes raw logs to UDM schema" },
    { id:"rules",     label:"YARA-L Rules",           sub:"Rules Engine detects patterns in UDM events" },
    { id:"detection", label:"Detection / Alert",      sub:"Appears in the SOC triage queue" },
    { id:"invest",    label:"Investigation",          sub:"Cases & Alerts · Graph Investigator · Search" },
    { id:"soar",      label:"SOAR Playbook",          sub:"Orchestration and response automation" },
    { id:"response",  label:"Automated Response",     sub:"Block IP · Isolate · Ticket · Notify" },
  ],
  distractors: ["Chronicle Forwarder v1","Direct Syslog","SOAR Connector","Dashboard Widget"],
  explanation: [
    { node:"Collection / Ingestion", info:"Google SecOps supports multiple methods: Forwarder/BindPlane Agent (on-prem), Feeds (pull from SaaS APIs and cloud buckets), HTTPS Webhooks (push from source), Pub/Sub (native GCP) and SOAR Connectors (Content Hub)." },
    { node:"Parser → UDM",           info:"Parsers normalize raw logs from any vendor to the UDM schema. Google maintains 500+ ready-made parsers. You can create custom parsers (CBN/ANTLR). SecOps stores both: raw log and normalized UDM." },
    { node:"Detection / Alert",      info:"When a YARA-L rule matches UDM events, the Rules Engine generates a Detection. It appears in the SOC alert queue with entity context, severity, and MITRE ATT&CK mapping." },
    { node:"Investigation",          info:"Step 4 of the official journey: Cases & Alerts group related detections. The Graph Investigator visualizes the who/what/when of the attack. UDM search lets you investigate up to 12 months of history." },
    { node:"SOAR Playbook",          info:"Step 5: after investigation, SOAR runs automated response playbooks configured in the Playbook Designer. Integrates with external tools via Content Hub (Jira, PagerDuty, firewalls, etc.)." },
  ],
};

export const M1_LESSONS_EN = [
  { id:1, title:"What is a SIEM?",
    cards:[
      { q:"What does SIEM stand for?",           a:"Security Information and Event Management — a system that collects, correlates, and analyzes security logs in real time." },
      { q:"Why does a SIEM exist?",               a:"Without it, an analyst would need to open dozens of different consoles. The SIEM centralizes everything in one place and a single timeline." },
      { q:"What is Google SecOps?",               a:"Google Security Operations (Google SecOps) is a fully managed Cloud native SIEM/SOAR platform by Google, requiring no infrastructure of your own." },
      { q:"What is the default log retention in Google SecOps?", a:"All Google SecOps tiers include 12 months of hot data retention. Licensing is based on ingestion volume (TB/year) — not by EPS or per user." },
      { q:"Does Google SecOps have artificial intelligence?", a:"Yes. It has built-in AI agents: Gemini for autonomous investigation, Triage Agent to prioritize alerts, and AI-powered detections with automatically suggested rules." },
      { q:"What does Google SecOps store?",       a:"Each event in two formats: the original raw log and the record normalized to the UDM (Unified Data Model) schema." },
    ],
    challenges:[
      { sentence:"Google SecOps is a Cloud native SIEM/____ platform by Google.", blank:"SOAR", options:["SOAR","DNS","WAF","EDR"] },
      { statement:"The default hot data retention in Google SecOps Standard is 30 days.", answer:false },
      { sentence:"Google SecOps has built-in ____ agents, such as Gemini.", blank:"AI", options:["AI","firewall","VLAN","parser"] },
      { sentence:"The SIEM centralizes logs so the analyst doesn't need to open dozens of different ____.", blank:"consoles", options:["consoles","files","users","rules"] },
    ]},
  { id:2, title:"Normalization and UDM",
    cards:[
      { q:"What is log normalization?",           a:"Converting logs from different formats (Palo Alto, Windows, Linux) to a common schema — the UDM (Unified Data Model)." },
      { q:"Why normalize?",                       a:"Without normalization you'd need a different rule for each vendor. With UDM, one rule covers all products." },
      { q:"What is a Parser?",                    a:"A component that reads a product's raw log and converts it to UDM fields. Google maintains 500+ ready-made parsers for major vendors." },
      { q:"What are the main UDM sections?",      a:"metadata (required), principal, target, network, security_result + src, intermediary, observer, about, extensions. Only metadata is required." },
      { q:"What is a 'raw log'?",                 a:"The original raw log, exactly as received from the product — before normalization. Google SecOps stores both: raw log and normalized UDM." },
      { q:"What is the UDM Entity Data Model?",   a:"A context model that enriches UDM events with data from sources like Active Directory and LDAP. Example: a login event has target.user.userid='frank.kolzig', but target.user.department='Marketing' comes automatically from ingested LDAP." },
    ],
    challenges:[
      { sentence:"The common schema used by Google SecOps to normalize logs is called ____.", blank:"UDM", options:["UDM","JSON","YAML","XML"] },
      { sentence:"The component that converts raw logs to UDM is called a ____.", blank:"Parser", options:["Parser","Firewall","Agent","Index"] },
      { statement:"With UDM, the same YARA-L rule works for logs from different vendors.", answer:true },
      { sentence:"The ____ field in UDM defines which other fields are required in an event.", blank:"event_type", options:["event_type","metadata","principal","target"] },
    ]},
  { id:3, title:"Google SecOps Architecture",
    cards:[
      { q:"How does data reach Google SecOps?",   a:"Main methods:\n• Forwarders/BindPlane Agent — on-prem collection (Windows, Linux, firewalls)\n• Feeds — pull from cloud APIs and buckets (GCS, S3, SaaS APIs)\n• HTTPS Webhooks — push from source to SecOps\n• Pub/Sub — native GCP integration\n• Ingestion API — custom apps\n• Connectors — alert ingestion via SOAR (Content Hub)" },
      { q:"What is the Rules Engine?",            a:"An engine that continuously runs YARA-L rules against normalized events and generates detections (alerts) when conditions are met." },
      { q:"What is a Detection?",                 a:"An alert generated by the Rules Engine when a YARA-L rule matches events in the logs. It appears in the SOC triage queue for investigation." },
      { q:"What is SOAR and what does it do?",    a:"Security Orchestration, Automation and Response — automates incident responses via Playbooks. Can open tickets, block IPs, and notify teams automatically." },
      { q:"What makes Google SecOps different from traditional SIEMs?", a:"Google infrastructure: 12 months of hot retention across all tiers, TB/year licensing (not by EPS or user), petabyte-scale search speed, and embedded AI (Gemini)." },
    ],
    challenges:[
      { sentence:"BindPlane is a type of ____ that sends logs to Google SecOps.", blank:"Forwarder", options:["Forwarder","Parser","Detection","Playbook"] },
      { sentence:"When a YARA-L rule matches events, the result is called a ____.", blank:"Detection", options:["Detection","Parser","Feed","UDM"] },
      { statement:"The Google SecOps SOAR can automate incident responses via Playbooks.", answer:true },
      { sentence:"Google SecOps has ____ months of hot data retention by default.", blank:"12", options:["12","3","6","24"] },
    ]},
  { id:4, title:"Packages and Licensing",
    cards:[
      { q:"How many packages does Google SecOps offer?",  a:"Three: Standard, Enterprise, and Enterprise Plus. Pricing is based on ingestion volume, not number of events or users." },
      { q:"What does the Standard package include?",       a:"Data ingestion, threat detection, investigation, response, and 12 months of hot data retention. Licensed by TB/year of ingestion. Ideal for organizations needing fundamental security operations." },
      { q:"What does Enterprise add to Standard?",         a:"Advanced threat intelligence, UEBA (User and Entity Behavior Analytics), generative AI assistance (Gemini), and SOAR for response automation." },
      { q:"What does Enterprise Plus add to Enterprise?",  a:"Complete Mandiant and VirusTotal intelligence, advanced data pipeline management, and extended storage options. For complex environments with maximum defense needs." },
      { q:"What is Google Unified Security?",              a:"A package that includes everything in Enterprise Plus and adds Chrome Enterprise Premium, Security Command Center, and Web Risk — Google's most complete security offering." },
      { q:"How does Google SecOps pricing work?",          a:"Based on ingestion volume (TB/year). All tiers include 12 months of hot data retention. Unlike traditional SIEMs that charge by EPS or per user — Google SecOps scales by total ingested volume." },
    ],
    challenges:[
      { sentence:"Google SecOps has ____ packages: Standard, Enterprise, and Enterprise Plus.", blank:"3", options:["3","2","4","5"] },
      { sentence:"The package that includes UEBA and Gemini AI is ____.", blank:"Enterprise", options:["Enterprise","Standard","Basic","Starter"] },
      { statement:"Enterprise Plus includes complete Mandiant and VirusTotal intelligence.", answer:true },
      { sentence:"Google SecOps pricing is based on ingestion ____.", blank:"volume", hint:"Licensed by TB/year of ingested volume — not by EPS, user, or host. All tiers include 12 months of hot data.", options:["volume","users","events","rules"] },
    ]},
  { id:5, title:"Ingestion Methods",
    cards:[
      { q:"What are Google SecOps ingestion methods?",     a:"6 main methods:\n1. BindPlane Agent — on-prem (Windows, Linux, firewalls)\n2. Feed Pull — pull from cloud/SaaS (GCS, S3, APIs)\n3. HTTPS Webhook — source sends to SecOps endpoint (push)\n4. Pub/Sub — native GCP integration\n5. Direct Ingestion API — custom apps\n6. Forwarder — legacy (prefer BindPlane Agent for new projects)" },
      { q:"What is the BindPlane Agent and when to use it?", a:"A modern telemetry pipeline for on-prem environments. Use for: firewalls (FortiGate), Windows/Linux servers, any source without a native SecOps API. It is the recommended replacement for the legacy Forwarder. Managed via BindPlane OP console. Supports OpenTelemetry." },
      { q:"What is a Feed in Google SecOps?",              a:"An ingestion mechanism configured in the SecOps UI. Types:\n• Pull: SecOps actively fetches (GCS, S3, Azure Blob, 3rd party APIs like Okta, Microsoft 365)\n• Push/Webhook: source sends to SecOps HTTPS endpoint\n• Pub/Sub: native GCP subscription\n• Amazon Data Firehose: AWS streaming\n\nEach feed = data source type + log type." },
      { q:"How does a Webhook work in Google SecOps?",     a:"The source sends logs to the SecOps HTTPS endpoint (push). Limits: 4 MB per request, 15,000 QPS per instance. Auth via API key in header (recommended). Configured in Settings → Feeds → HTTPS Push." },
      { q:"What is the difference between Forwarder and BindPlane Agent?", a:"Forwarder: legacy component that runs in the customer's network, collects logs and packets, and sends them to SecOps. Still functional.\nBindPlane Agent: modern replacement with OpenTelemetry support, centralized management via BindPlane OP, and more flexibility. New projects should prefer BindPlane Agent." },
    ],
    challenges:[
      { sentence:"For new on-premises collection projects, the recommended modern method is ____.", blank:"BindPlane Agent", hint:"BindPlane Agent is the modern replacement for the legacy Forwarder. Supports Windows, Linux, firewalls, and is managed via BindPlane OP.", options:["BindPlane Agent","Forwarder","Webhook","Pub/Sub"] },
      { statement:"The Webhook in Google SecOps allows the source to send logs directly to the SecOps HTTPS endpoint.", answer:true },
      { sentence:"For GCP, the native ingestion method without BindPlane is via ____.", blank:"Pub/Sub", options:["Pub/Sub","BindPlane Agent","Webhook","Forwarder"] },
      { statement:"The Google SecOps Forwarder is the recommended method for new implementations.", answer:false, hint:"Incorrect. The Forwarder is DEPRECATED — EOL January 2027. For new projects use the BindPlane Agent." },
    ]},
  { id:6, title:"Investigation: Cases, SIEM Search & Graph",
    cards:[
      { q:"What are Cases in Google SecOps?",     a:"Cases group related Detections for collaborative investigation. They contain alerts, evidence, timelines, MITRE ATT&CK mapping, and playbook execution. SOC analysts work directly in Cases." },
      { q:"How does SIEM Search (UDM Search) work?", a:"Allows querying all events normalized to UDM using the UDM query language. Returns results from up to 12 months of hot data. Syntax: field = 'value' | field != 'value' | nested fields like principal.hostname." },
      { q:"What is Graph Investigator?",          a:"Visual tool that shows relationships between entities (users, IPs, hosts, domains) connected by UDM events. Helps answer 'what else did this IP communicate with?' and 'what did this user do before the alert?'" },
      { q:"What is a UDM Event?",                 a:"Any normalized log in UDM format, stored in Google SecOps. Has an event_type (NETWORK_CONNECTION, USER_LOGIN, PROCESS_LAUNCH, etc.) and standardized fields (principal, target, network, security_result, etc.)." },
    ],
    challenges:[
      { sentence:"Cases in Google SecOps group related ____ for collaborative investigation.", blank:"Detections", options:["Detections","Parsers","Feeds","Dashboards"] },
      { statement:"UDM Search allows querying events from up to 12 months of history.", answer:true },
      { sentence:"The ____ visually shows relationships between entities connected by UDM events.", blank:"Graph Investigator", options:["Graph Investigator","Rules Engine","SOAR","Feed Manager"] },
    ]},
  { id:7, title:"Content Hub, SOAR & Response",
    cards:[
      { q:"What is Content Hub?",                 a:"A marketplace of pre-built security content for Google SecOps: detection rules, playbooks, parser extensions, dashboards, and connectors for 3rd party tools (CrowdStrike, Palo Alto, Jira, etc.)." },
      { q:"How does SOAR respond to incidents?",  a:"Via Playbooks — automated response workflows that can: quarantine endpoints, block IPs in firewalls, create Jira tickets, notify Slack/Teams, enrich IOCs via VirusTotal/Mandiant, and update the case automatically." },
      { q:"What is a Playbook?",                  a:"An automated workflow configured in the SOAR Playbook Designer. It consists of steps (actions) that execute sequentially or in parallel. Can be triggered automatically by a Detection or manually by an analyst." },
      { q:"What is a SOAR Connector?",            a:"Integration that allows SOAR to interact with external tools (firewalls, ticketing systems, EDR, etc.). Connectors from the Content Hub handle authentication and specific APIs." },
    ],
    challenges:[
      { sentence:"Content Hub contains pre-built ____ for Google SecOps.", blank:"security content", options:["security content","raw logs","UDM schemas","parsers only"] },
      { statement:"SOAR Playbooks can only be triggered manually by an analyst.", answer:false },
      { sentence:"A SOAR ____ integrates with external tools like firewalls and ticketing systems.", blank:"Connector", options:["Connector","Parser","Feed","Rule"] },
    ]},
];

export const M1_FINAL_CHALLENGE_EN = [
  { type:"complete", sentence:"Google SecOps is a Cloud native SIEM/____ platform.", blank:"SOAR", options:["SOAR","EDR","WAF","NAC"] },
  { type:"truefalse", statement:"The Google SecOps Forwarder is DEPRECATED and has EOL in January 2027.", answer:true },
  { type:"complete", sentence:"The component that normalizes raw logs to UDM is called a ____.", blank:"Parser", options:["Parser","Agent","Rule","Feed"] },
  { type:"complete", sentence:"Google SecOps includes ____ months of hot data retention in all tiers.", blank:"12", options:["12","6","3","24"] },
  { type:"truefalse", statement:"With UDM, the same YARA-L rule works for logs from different vendors.", answer:true },
  { type:"complete", sentence:"The Google SecOps AI assistant is called ____.", blank:"Gemini", options:["Gemini","ChatGPT","Watson","Copilot"] },
];

export const M2_CHALLENGE_EN = [
  { type:"complete", sentence:"The main command used in YARA-L to detect repeated events in a time window is ____.", blank:"match", options:["match","condition","outcome","events"] },
  { type:"truefalse", statement:"In a UDM event, the 'principal' field represents the target of the action.", answer:false },
  { type:"complete", sentence:"The UDM field that stores the process name is ____.", blank:"principal.process.file.full_path", options:["principal.process.file.full_path","target.hostname","network.ip_protocol","security_result.action"] },
  { type:"complete", sentence:"The UDM event_type for a user login is ____.", blank:"USER_LOGIN", options:["USER_LOGIN","NETWORK_CONNECTION","PROCESS_LAUNCH","FILE_COPY"] },
  { type:"truefalse", statement:"A UDM event can have both 'principal' and 'target' fields simultaneously.", answer:true },
  { type:"complete", sentence:"The UDM field that stores the network destination IP is ____.", blank:"target.ip", options:["target.ip","principal.ip","network.direction","security_result.action"] },
];

export const M3_LESSONS_EN = [
  { id:1, title:"Anatomy of a YARA-L Rule",
    cards:[
      { q:"What is YARA-L?",                      a:"YARA-L (Yet Another Rule Language - Logs) is Google SecOps's query language for writing detection rules. Rules run continuously against normalized UDM events and generate Detections when conditions are met." },
      { q:"What are the mandatory sections of a YARA-L rule?", a:"rule (name), meta (metadata), events (what to match), condition (when to alert). Optional: match (grouping), outcome (variables for the alert), options (performance settings)." },
      { q:"What does the 'meta' section contain?",  a:"Rule metadata: author, description, severity (LOW/MEDIUM/HIGH/CRITICAL), priority, MITRE ATT&CK tags (technique, tactic), and other documentation fields." },
      { q:"What does the 'events' section do?",     a:"Defines which UDM events to match. Uses variable syntax: $e.field = 'value'. Multiple variables ($e1, $e2) can represent different events to correlate." },
    ],
    challenges:[
      { sentence:"In YARA-L, the section that defines matching conditions is called ____.", blank:"condition", options:["condition","match","events","outcome"] },
      { statement:"The 'meta' section in YARA-L is mandatory for the rule to compile.", answer:false },
      { sentence:"In YARA-L, UDM events are referenced using ____ variables like $e.", blank:"event", options:["event","string","network","alert"] },
    ]},
  { id:2, title:"Event Variables",
    cards:[
      { q:"How are event variables declared in YARA-L?", a:"Using the $ prefix. Example: $e.metadata.event_type = 'USER_LOGIN'. Each variable represents a UDM event. Multiple variables ($e1, $e2) correlate different events." },
      { q:"How to filter by event type?",           a:"$e.metadata.event_type = 'USER_LOGIN'\nCommon event types: USER_LOGIN, NETWORK_CONNECTION, PROCESS_LAUNCH, FILE_COPY, NETWORK_DNS, STATUS_UPDATE." },
      { q:"How to compare two fields in different events?", a:"Using the same variable in both events:\n$e1.principal.user.userid = $e2.target.user.userid\nThis ensures the user in event 1 is the same as in event 2." },
      { q:"What is nocase in YARA-L?",              a:"A modifier that makes string comparison case-insensitive. Example: $e.principal.hostname = /admin/ nocase. Useful for hostnames and usernames that can vary in casing." },
    ],
    challenges:[
      { sentence:"In YARA-L, event variables are declared with the ____ prefix.", blank:"$", options:["$","#","%","@"] },
      { statement:"In YARA-L, you can use the same variable in multiple events to correlate them.", answer:true },
      { sentence:"The modifier that makes string comparison case-insensitive is ____.", blank:"nocase", options:["nocase","regex","lowercase","ignore"] },
    ]},
  { id:3, title:"Match and Time Windows",
    cards:[
      { q:"What does the 'match' section do?",      a:"Defines how events are grouped to generate a single Detection. Example: match $user over 5m — groups all events from the same user within 5 minutes into one alert." },
      { q:"What is a time window in YARA-L?",       a:"The period during which the Rules Engine looks for matching events. Defined with 'over': 5m (5 minutes), 1h (1 hour), 24h (24 hours). Events outside the window are not correlated." },
      { q:"What is the #count operator?",           a:"Counts the number of matching events. Example: #events > 10 in the condition section means the rule only fires if there are more than 10 matching events. Used for brute-force detection." },
      { q:"How to detect repeated failures?",       a:"Combine match (group by user/IP) + time window + #count condition:\nevents: $e.metadata.event_type = 'USER_LOGIN' $e.security_result.action = 'BLOCK'\nmatch: $e.principal.user.userid over 5m\ncondition: #e > 5" },
    ],
    challenges:[
      { sentence:"In YARA-L, the section that groups events for a single Detection is ____.", blank:"match", options:["match","condition","events","outcome"] },
      { statement:"The time window in YARA-L is defined using the keyword 'within'.", answer:false },
      { sentence:"To count the number of events in a YARA-L rule, use the ____ operator.", blank:"#count", options:["#count","$count","@total","count()"] },
    ]},
  { id:4, title:"Condition and Operators",
    cards:[
      { q:"What does the 'condition' section define?", a:"The logic that determines when a Detection is generated. Uses event variables ($e), count operators (#e), and boolean operators (and, or, not)." },
      { q:"What are the main YARA-L operators?",     a:"= (equal), != (not equal), > < >= <= (numeric comparison), =~ (regex), and, or, not, nocase. Also: re.regex() for complex patterns, strings.concat() for concatenation." },
      { q:"How does the 'outcome' section work?",    a:"Defines variables that are calculated and included in the Detection. Example: $risk_score = max(0.0, if($e.network.sent_bytes > 1000000, 50.0, 10.0)). Used by risk analytics and SOAR." },
      { q:"What is a Reference List in YARA-L?",    a:"A list of values (IPs, domains, users) that can be used in rules. Example: $e.principal.ip in %malicious_ips_list. Lists are updated via the SecOps UI without changing the rule." },
    ],
    challenges:[
      { sentence:"In YARA-L, the operator to check if a value matches a regex is ____.", blank:"=~", options:["=~","~~","regex:","match:"] },
      { statement:"The 'outcome' section in YARA-L allows calculating variables included in the Detection.", answer:true },
      { sentence:"A list of external values used in YARA-L rules is called a ____.", blank:"Reference List", options:["Reference List","Data Table","Variable Set","Match Group"] },
    ]},
];

export const M3_SKIP_CHALLENGE_EN = [
  { type:"complete", sentence:"In YARA-L, the section that defines which UDM events to match is ____.", blank:"events", options:["events","condition","match","outcome"] },
  { type:"truefalse", statement:"The 'match' section in YARA-L is mandatory in every rule.", answer:false },
  { type:"complete", sentence:"The operator to count events in YARA-L is ____.", blank:"#", options:["#","$","@","%"] },
  { type:"complete", sentence:"In YARA-L, the time window is defined with the keyword ____.", blank:"over", options:["over","within","during","for"] },
  { type:"truefalse", statement:"A Reference List can be used in YARA-L rules to check if a value belongs to an external list.", answer:true },
];

export const M5_LESSONS_EN = [
  { id:1, title:"YARA-L outcome and risk_score",
    cards:[
      { q:"What is the 'outcome' section used for?", a:"To compute variables attached to the Detection. The most common use is defining $risk_score — an integer from 0-100 that feeds Google SecOps risk analytics. It can use if(), max(), min(), and math operations." },
      { q:"How is risk_score used by the system?", a:"Google SecOps uses it to automatically calculate entity risk scores (users, IPs, hosts). Entities with accumulating risk scores appear highlighted in dashboards and case investigations." },
      { q:"Can outcome reference events from the events section?", a:"Yes. Example: $bytes = $e.network.sent_bytes. The outcome variable captures a value from the matched event and propagates it to the Detection for SOAR and dashboards." },
    ],
    challenges:[
      { sentence:"In YARA-L, the section used to compute variables in the Detection is ____.", blank:"outcome", options:["outcome","result","condition","match"] },
      { statement:"The $risk_score variable in YARA-L outcome feeds Google SecOps risk analytics.", answer:true },
    ]},
  { id:2, title:"Reference Lists and Data Tables",
    cards:[
      { q:"What is a Reference List?",             a:"A set of values (IPs, domains, hashes, usernames) maintained in the SecOps UI. Used in rules with the 'in' operator: $e.principal.ip in %blocklist_ips. Updated without changing the rule." },
      { q:"What is a Data Table?",                 a:"A multi-column table imported into SecOps (CSV). Allows enriching events with additional context. Example: a table mapping asset IDs to criticality levels, used in YARA-L to detect high-value targets." },
      { q:"What is the difference between Reference List and Data Table?", a:"Reference List = single column (one value type). Data Table = multiple columns (richer context). Use Reference List for simple blocklists. Use Data Table when you need to join event fields with external context." },
    ],
    challenges:[
      { sentence:"In YARA-L, to check if an IP belongs to an external list, use the ____ operator.", blank:"in", options:["in","=~","contains","match"] },
      { statement:"A Data Table in Google SecOps can have multiple columns and be used to enrich events.", answer:true },
    ]},
  { id:3, title:"Risk Analytics",
    cards:[
      { q:"What is Risk Analytics in Google SecOps?", a:"A capability that automatically accumulates $risk_score from multiple rules and calculates cumulative risk scores for entities (users, IPs, hosts) over time. High-risk entities surface in the Risk Analytics dashboard." },
      { q:"How to write a rule that feeds Risk Analytics?", a:"Include $risk_score in the outcome section:\noutcome:\n  $risk_score = max(50.0, if($count > 10, 80.0, 30.0))\nThe system sums risk_score from all matching rules per entity." },
      { q:"What are UEBA detections?",              a:"User and Entity Behavior Analytics — detections based on behavioral baselines. Available in the Enterprise tier. Automatically detect anomalies without manual rule writing (unusual login times, excessive data transfers, etc.)." },
    ],
    challenges:[
      { sentence:"Risk Analytics in Google SecOps accumulates ____ from multiple rules per entity.", blank:"$risk_score", options:["$risk_score","#count","$events","$severity"] },
      { statement:"UEBA detections require manually writing YARA-L rules.", answer:false },
    ]},
  { id:4, title:"Performance and Best Practices",
    cards:[
      { q:"What are the main YARA-L performance tips?", a:"1. Filter by event_type first\n2. Use specific fields before generic regexes\n3. Prefer string = over =~ (regex) when possible\n4. Use match to group alerts and reduce noise\n5. Set the correct time window (shorter = faster)\n6. Use Reference Lists instead of long OR conditions" },
      { q:"What is the 'options' section in YARA-L?", a:"Optional section with performance settings. Main options:\n- allow_zero_values = true (allows 0 as valid value)\n- max_cache_duration (cache window for rule state)" },
      { q:"How to test a YARA-L rule before publishing?", a:"Use the 'Run Rule' feature in the SecOps Rules Editor. It runs the rule against a defined time window of historical events and shows matching results before the rule goes live." },
    ],
    challenges:[
      { sentence:"To reduce YARA-L rule noise, group events by entity using the ____ section.", blank:"match", options:["match","condition","options","outcome"] },
      { statement:"Filtering by event_type at the beginning of a YARA-L rule improves performance.", answer:true },
    ]},
];

export const M5_FINAL_CHALLENGE_EN = [
  { type:"complete", sentence:"In YARA-L, to compute a risk score in the Detection, use the ____ section.", blank:"outcome", options:["outcome","condition","match","events"] },
  { type:"complete", sentence:"A multi-column table used to enrich YARA-L rules is called a ____.", blank:"Data Table", options:["Data Table","Reference List","Variable Set","Event Map"] },
  { type:"truefalse", statement:"Risk Analytics in Google SecOps accumulates risk_score from multiple rules per entity.", answer:true },
  { type:"complete", sentence:"To check if an IP belongs to an external list in YARA-L, use the ____ operator.", blank:"in", options:["in","contains","=~","match"] },
  { type:"truefalse", statement:"UEBA detections in Google SecOps require manual YARA-L rule writing.", answer:false },
];

export const M6_PUZZLES_EN = [
  { id:1, title:"Windows Event Log", tag:"ENDPOINT",
    nodes:[
      { id:"winlog",  label:"Windows Event Log", sub:"Security · System · Application", icon:"🖥", color:"#00c4cc", blank:false },
      { id:"bindpl",  label:"BindPlane Agent",    sub:"Collects and forwards to SecOps",  icon:"⚙️", color:"#00c4cc", blank:true },
      { id:"udm",     label:"Parser → UDM",       sub:"Normalizes to event_type PROCESS_LAUNCH / USER_LOGIN", icon:"🔄", color:"#22d3a0", blank:false },
      { id:"rule",    label:"YARA-L Rule",         sub:"Detects suspicious patterns",     icon:"🎯", color:"#a78bfa", blank:true },
    ]},
  { id:2, title:"Linux auditd", tag:"ENDPOINT",
    nodes:[
      { id:"audit",   label:"Linux auditd",        sub:"Kernel-level log — syscalls, files, users", icon:"🐧", color:"#22d3a0", blank:false },
      { id:"bindpl",  label:"BindPlane Agent",      sub:"Collects auditd logs",           icon:"⚙️", color:"#00c4cc", blank:true },
      { id:"udm",     label:"Parser → UDM",         sub:"Normalizes to PROCESS_LAUNCH, FILE_OPEN", icon:"🔄", color:"#22d3a0", blank:false },
      { id:"rule",    label:"YARA-L Rule",           sub:"Detects privilege escalation",  icon:"🎯", color:"#a78bfa", blank:true },
    ]},
  { id:3, title:"FortiGate Firewall", tag:"NETWORK",
    nodes:[
      { id:"forti",   label:"FortiGate Firewall",   sub:"Traffic, UTM and VPN logs",     icon:"🔥", color:"#f97316", blank:false },
      { id:"bindpl",  label:"BindPlane Agent / Syslog", sub:"Forwards to SecOps",        icon:"⚙️", color:"#00c4cc", blank:true },
      { id:"udm",     label:"Parser → UDM",          sub:"Normalizes to NETWORK_CONNECTION", icon:"🔄", color:"#22d3a0", blank:false },
      { id:"rule",    label:"YARA-L Rule",            sub:"Detects C2, exfil, port scan", icon:"🎯", color:"#a78bfa", blank:true },
    ]},
  { id:4, title:"Cloud APIs (Feed)", tag:"CLOUD",
    nodes:[
      { id:"cloud",   label:"Cloud API",             sub:"GCS · S3 · Azure Blob · SaaS APIs", icon:"☁️", color:"#00c4cc", blank:false },
      { id:"feed",    label:"SecOps Feed",            sub:"Pull — SecOps fetches periodically", icon:"🔗", color:"#00c4cc", blank:true },
      { id:"udm",     label:"Parser → UDM",           sub:"Normalizes cloud events",     icon:"🔄", color:"#22d3a0", blank:false },
      { id:"rule",    label:"YARA-L Rule",             sub:"Detects cloud threats",       icon:"🎯", color:"#a78bfa", blank:true },
    ]},
  { id:5, title:"Email Security", tag:"EMAIL",
    nodes:[
      { id:"email",   label:"Email Security Gateway", sub:"Gmail · O365 via Feed API",   icon:"📧", color:"#a78bfa", blank:false },
      { id:"feed",    label:"SecOps Feed",             sub:"Pull via API",                icon:"🔗", color:"#00c4cc", blank:true },
      { id:"udm",     label:"Parser → UDM",            sub:"Normalizes to EMAIL_TRANSACTION", icon:"🔄", color:"#22d3a0", blank:false },
      { id:"rule",    label:"YARA-L Rule",              sub:"Detects phishing, BEC",      icon:"🎯", color:"#a78bfa", blank:true },
    ]},
  { id:6, title:"Webhook HTTPS Push", tag:"PUSH",
    nodes:[
      { id:"source",  label:"Log Source",             sub:"Source with Webhook support",  icon:"📡", color:"#00c4cc", blank:false },
      { id:"webhook", label:"HTTPS Push / Webhook",   sub:"Source sends to SecOps endpoint", icon:"🔗", color:"#ff1a75", blank:true },
      { id:"udm",     label:"Parser → UDM",            sub:"Normalizes on arrival",       icon:"🔄", color:"#22d3a0", blank:false },
      { id:"rule",    label:"YARA-L Rule",              sub:"Detects anomalies in real time", icon:"🎯", color:"#a78bfa", blank:true },
    ]},
  { id:7, title:"SecOps Instance Activation", tag:"ONBOARDING",
    nodes:[
      { id:"contract", label:"Contract / Licensing",  sub:"TB/year — Standard / Enterprise", icon:"🚀", color:"#fbbf24", blank:false },
      { id:"instance", label:"SecOps Instance",        sub:"Provisioned by Google",         icon:"🏛", color:"#22d3a0", blank:true },
      { id:"config",   label:"Initial Configuration",  sub:"Feeds, Forwarders, Users, Rules", icon:"⚙️", color:"#00c4cc", blank:false },
      { id:"active",   label:"Active SOC",             sub:"Detections · Cases · Playbooks", icon:"🛡", color:"#ff1a75", blank:true },
    ]},
  { id:8, title:"Attack Simulation", tag:"RED TEAM",
    nodes:[
      { id:"kali",    label:"Kali / Red Team",         sub:"Simulated attack on the environment", icon:"☠️", color:"#ff4d4d", blank:false },
      { id:"logs",    label:"Logs Generated",          sub:"Endpoint, Network, Auth",       icon:"📊", color:"#fbbf24", blank:true },
      { id:"udm",     label:"Normalized UDM Events",   sub:"Parser processes in real time", icon:"🔄", color:"#22d3a0", blank:false },
      { id:"detect",  label:"Detection",               sub:"YARA-L rule fires — alert in SOC", icon:"🚨", color:"#fbbf24", blank:true },
    ]},
];

export const MISSIONS_EN = [
  { id:1, title:"Brute Force SSH", tag:"AUTHENTICATION", emoji:"🔐", mitre:"T1110", xp:150,
    steps:[
      { section:"META", icon:"🏷", color:"#fbbf24", type:"multiple",
        q:"What metadata best describes this rule?", options:["rule_name = \"ssh_brute_force\"","rule_name = \"new_process\"","severity = \"LOW\"","severity = \"CRITICAL\""],
        answers:["rule_name = \"ssh_brute_force\"","severity = \"CRITICAL\""],
        hint:"Brute force is high severity. The rule_name must reflect what is being detected." },
      { section:"EVENTS", icon:"📋", color:"#22d3a0", type:"multiple",
        q:"Which event filters are correct for this detection?",
        options:["$e.metadata.event_type = \"USER_LOGIN\"","$e.security_result.action = \"BLOCK\"","$e.metadata.event_type = \"NETWORK_DNS\"","$e.target.port = 22"],
        answers:["$e.metadata.event_type = \"USER_LOGIN\"","$e.security_result.action = \"BLOCK\"","$e.target.port = 22"],
        hint:"Brute force SSH = multiple failed logins (BLOCK) on port 22." },
      { section:"MATCH", icon:"🔗", color:"#a78bfa", type:"select",
        q:"How to group events to detect attacks per source?",
        options:["$e.principal.ip over 5m","$e.target.ip over 1h","$e.metadata.event_type over 24h","$e.principal.hostname over 30m"],
        answer:"$e.principal.ip over 5m",
        hint:"Group by source IP (attacker) in a short window (5 min) to detect concentrated attacks." },
      { section:"CONDITION", icon:"🎯", color:"#ff1a75", type:"select",
        q:"What condition correctly detects multiple failures?",
        options:["#e > 5","$e.count > 5","count($e) >= 5","#events = 5"],
        answer:"#e > 5",
        hint:"In YARA-L, #e counts matching events. > 5 means more than 5 failures in the time window." },
    ]},
];
