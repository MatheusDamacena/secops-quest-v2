// ─── PLAYBOOK BUILDER ────────────────────────────────────────────────────────
import { useState, useCallback } from 'react';
import { C, F } from '../styles/tokens';
import {
  FaBolt, FaShieldAlt, FaChevronLeft,
  FaSearch, FaHistory, FaChartLine, FaTachometerAlt,
  FaLock, FaUserCog, FaTicketAlt, FaTrash, FaEyeSlash,
  FaNetworkWired, FaBrain, FaRoute, FaUserSlash,
  FaDatabase, FaCamera, FaUserTie, FaGavel, FaBan,
  FaTag, FaArchive, FaCopy, FaPlug, FaBook,
  FaShieldVirus, FaServer, FaCodeBranch, FaTree,
  FaRobot, FaWifi, FaCloud, FaHeadset, FaUsers,
   FaMedkit, FaStar, FaCheckCircle,
} from 'react-icons/fa';
import { FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';

// ── Tokens ───────────────────────────────────────────────────────────────────
const BG      = '#131f24';
const SURFACE = '#1c2b32';
const SURFACE2= '#243540';
const BORDER  = 'rgba(255,255,255,0.06)';
const TEXT    = '#ffffff';
const TEXT2   = 'rgba(255,255,255,0.55)';
const TEXT3   = 'rgba(255,255,255,0.3)';
const ACCENT  = '#ff4b7a';
const GREEN   = '#58cc02';
const AMBER   = '#ffc800';
const CYAN    = '#00c4cc';
const PURPLE  = '#a855f7';
const SANS    = "'Inter','Nunito',sans-serif";
const MONO    = "'Roboto Mono',monospace";

// ── Fases ────────────────────────────────────────────────────────────────────
const PHASES = {
  trigger: { label: 'Trigger',        color: '#f87171' },
  enrich:  { label: 'Enriquecimento', color: '#60a5fa' },
  analyze: { label: 'Análise',        color: AMBER     },
  contain: { label: 'Contenção',      color: PURPLE    },
  action:  { label: 'Ação',           color: GREEN     },
  notify:  { label: 'Notificação',    color: '#fb923c' },
  post:    { label: 'Pós-incidente',  color: TEXT3     },
};

// ── DX por dificuldade ───────────────────────────────────────────────────────
// diff 0=tutorial: 0 DX | diff 1=interm: 80/40/15/5 | diff 2=avançado: 250/120/50/15
const DX_TABLE = [
  [0,0,0,0],
  [80,40,15,5],
  [250,120,50,15],
];
const TRAPS = new Set([
  'delete-logs','ignore-alert','pay-ransom','reboot','confront-user',
  'delete-files','force-reset','block-all','shutdown-dc','call-media',
  'delete-email','force-reset-all',
]);

// ── Ícones por id de bloco ───────────────────────────────────────────────────
const ICON_MAP = {
  'alert-siem':FiAlertCircle,'ip-lookup':FaSearch,'user-history':FaHistory,
  'check-baseline':FaChartLine,'risk-score':FaTachometerAlt,'block-session':FaLock,
  'notify-analyst':FaUserCog,'open-ticket':FaTicketAlt,'delete-logs':FaTrash,
  'ignore-alert':FaEyeSlash,'edr-alert':FiAlertCircle,'process-tree':FaCodeBranch,
  'file-hash':FaSearch,'ioc-check':FaShieldVirus,'lateral-check':FaNetworkWired,
  'isolate-host':FaPlug,'kill-process':FaBan,'snapshot':FaCamera,
  'notify-ciso':FaUserTie,'open-ticket-r':FaTicketAlt,'pay-ransom':FaBolt,
  'reboot':FaMedkit,'dlp-alert':FiAlertCircle,'user-activity':FaSearch,
  'dest-rep':FaSearch,'data-classify':FaTag,'intent-check':FaBrain,
  'block-upload':FaBan,'revoke-access':FaLock,'preserve-ev':FaArchive,
  'forensic-copy':FaCopy,'notify-legal':FaGavel,'notify-ciso-x':FaUserTie,
  'confront-user':FaUsers,'delete-files':FaTrash,'mfa-alert':FiAlertCircle,
  'ip-cluster':FaNetworkWired,'mfa-history':FaHistory,'fatigue-check':FaBrain,
  'account-risk':FaTachometerAlt,'temp-block-mfa':FaLock,'notify-user':FaUserCog,
  'open-ticket-mfa':FaTicketAlt,'force-reset':FaLock,'edr-lateral':FiAlertCircle,
  'wmi-logs':FaDatabase,'cred-usage':FaLock,'blast-radius':FaShieldVirus,
  'pivot-chain':FaRoute,'isolate-wks':FaPlug,'disable-cred':FaUserSlash,
  'memory-dump':FaDatabase,'timeline':FaChartLine,'update-rules':FaShieldAlt,
  'lessons':FaBook,'block-all':FaBan,'email-alert':FiAlertCircle,
  'url-sandbox':FaSearch,'macro-analysis':FaSearch,'c2-check':FaWifi,
  'user-scope':FaUsers,'isolate-host-p':FaPlug,'block-url':FaBan,
  'forensic-email':FaSearch,'notify-user-p':FaUserCog,'open-ticket-p':FaTicketAlt,
  'delete-email':FaTrash,'dc-alert':FiAlertCircle,'replication-logs':FaDatabase,
  'account-audit':FaSearch,'golden-check':FaShieldVirus,'scope-dc':FaNetworkWired,
  'isolate-dc':FaPlug,'disable-account-dc':FaUserSlash,'krbtgt-reset':FaLock,
  'evidence-dc':FaArchive,'notify-ciso-dc':FaUserTie,'notify-legal-dc':FaGavel,
  'forest-review':FaTree,'update-rules-dc':FaShieldAlt,'shutdown-dc':FaServer,
  'force-reset-all':FaLock,'waf-alert':FiAlertCircle,'ip-geo-cluster':FaSearch,
  'traffic-pattern':FaChartLine,'attack-type':FaShieldVirus,'botnet-check':FaRobot,
  'rate-limit':FaBolt,'cdn-scrubbing':FaCloud,'block-asns':FaBan,
  'notify-noc':FaHeadset,'notify-stakeholder':FaUsers,'capacity-review':FaServer,
  'runbook-update':FaBook,'call-media':FaUsers,
};

// ── Cenários ─────────────────────────────────────────────────────────────────
const SCENARIOS = [
  {
    id:'login-suspeito', title:'Login Suspeito', sev:'SEVERIDADE ALTA', sevColor:AMBER,
    desc:'03:14 UTC — admin@corp.com autenticou de IP 185.220.101.45 (Rússia) via curl/7.68. Primeiro acesso internacional. Conta privilegiada.',
    phases:['trigger','enrich','analyze','action'],
    sol:{trigger:['alert-siem'],enrich:['ip-lookup','user-history'],analyze:['check-baseline','risk-score'],action:['block-session','notify-analyst','open-ticket']},
    debrief:{trigger:'O alerta SIEM é o único trigger válido — captura o evento autenticado com contexto suficiente para iniciar a investigação.',enrich:'Lookup de IP revela geolocalização e reputação. Histórico confirma que nunca houve login russo — evidência crítica.',analyze:'Baseline compara horário, IP e user-agent. Risk score agrega todos os fatores para uma decisão objetiva.',action:'Bloquear sessão é automático. Notificar analista exige julgamento humano. Ticket garante rastreabilidade.'},
    blocks:[
      {id:'alert-siem',cat:'trigger',label:'Alerta SIEM',sub:'trigger'},{id:'ip-lookup',cat:'enrich',label:'Lookup de IP',sub:'enriquecimento'},
      {id:'user-history',cat:'enrich',label:'Histórico usuário',sub:'enriquecimento'},{id:'check-baseline',cat:'analyze',label:'Verificar baseline',sub:'análise'},
      {id:'risk-score',cat:'analyze',label:'Calcular risco',sub:'análise'},{id:'block-session',cat:'action',label:'Bloquear sessão',sub:'ação auto'},
      {id:'notify-analyst',cat:'action',label:'Notificar analista',sub:'ação manual'},{id:'open-ticket',cat:'action',label:'Abrir ticket',sub:'ação auto'},
      {id:'delete-logs',cat:'trap',label:'Deletar logs',sub:'armadilha'},{id:'ignore-alert',cat:'trap',label:'Ignorar alerta',sub:'armadilha'},
    ],
  },
  {
    id:'ransomware', title:'Ransomware em Execução', sev:'SEVERIDADE CRÍTICA', sevColor:'#f87171',
    desc:'svchost.exe criptografou 14.823 arquivos em 4 min. Extensão .locked. Processo pai: outlook.exe. README.txt em cada diretório.',
    phases:['trigger','enrich','analyze','contain','action'],
    sol:{trigger:['edr-alert'],enrich:['process-tree','file-hash'],analyze:['ioc-check','lateral-check'],contain:['isolate-host','kill-process'],action:['snapshot','notify-ciso','open-ticket-r']},
    debrief:{trigger:'Alerta EDR de criptografia em massa é assinatura clássica de ransomware — trigger inequívoco.',enrich:'Árvore de processos revela outlook.exe como vetor inicial. Hash permite comparação com threat intel.',analyze:'IOCs confirmam família do ransomware. Movimento lateral determina escopo da contenção.',contain:'Isolar host interrompe propagação. Matar processo para criptografia ativa. Contenção ANTES da remediação.',action:'Snapshot preserva evidências forenses. Notificar CISO é manual — decisão executiva.'},
    blocks:[
      {id:'edr-alert',cat:'trigger',label:'Alerta EDR',sub:'trigger'},{id:'process-tree',cat:'enrich',label:'Árvore processos',sub:'enriquecimento'},
      {id:'file-hash',cat:'enrich',label:'Hash dos arquivos',sub:'enriquecimento'},{id:'ioc-check',cat:'analyze',label:'Checar IOCs',sub:'análise'},
      {id:'lateral-check',cat:'analyze',label:'Mov. lateral',sub:'análise'},{id:'isolate-host',cat:'contain',label:'Isolar host',sub:'contenção'},
      {id:'kill-process',cat:'contain',label:'Matar processo',sub:'contenção'},{id:'snapshot',cat:'action',label:'Tirar snapshot',sub:'ação auto'},
      {id:'notify-ciso',cat:'action',label:'Notificar CISO',sub:'ação manual'},{id:'open-ticket-r',cat:'action',label:'Abrir ticket',sub:'ação auto'},
      {id:'pay-ransom',cat:'trap',label:'Pagar resgate',sub:'armadilha'},{id:'reboot',cat:'trap',label:'Reiniciar máquina',sub:'armadilha'},
    ],
  },
  {
    id:'exfiltracao', title:'Exfiltração de Dados', sev:'SEVERIDADE MÁXIMA', sevColor:'#f87171',
    desc:'DLP detectou 4,2 GB transferidos para mega.nz às 22:47 por dev03@corp.com. Usuário ainda online.',
    phases:['trigger','enrich','analyze','contain','action','notify'],
    sol:{trigger:['dlp-alert'],enrich:['user-activity','dest-rep'],analyze:['data-classify','intent-check'],contain:['block-upload','revoke-access'],action:['preserve-ev','forensic-copy'],notify:['notify-legal','notify-ciso-x']},
    debrief:{trigger:'Alerta DLP captura volume e destino com contexto suficiente.',enrich:'Atividade recente revela contexto. Reputação confirma mega.nz como destino de exfiltração.',analyze:'Classificar dados determina severidade regulatória. Checar intenção indica se foi acidental ou deliberado.',contain:'Bloquear uploads impede mais dados saírem. Revogar acesso ANTES de notificar — não destruir evidências.',action:'Preservar evidências garante chain of custody. Cópia forense captura estado antes de qualquer alteração.',notify:'Notificar jurídico é obrigatório — pode envolver LGPD. APÓS contenção e preservação.'},
    blocks:[
      {id:'dlp-alert',cat:'trigger',label:'Alerta DLP',sub:'trigger'},{id:'user-activity',cat:'enrich',label:'Atividade usuário',sub:'enriquecimento'},
      {id:'dest-rep',cat:'enrich',label:'Reputação destino',sub:'enriquecimento'},{id:'data-classify',cat:'analyze',label:'Classificar dados',sub:'análise'},
      {id:'intent-check',cat:'analyze',label:'Checar intenção',sub:'análise'},{id:'block-upload',cat:'contain',label:'Bloquear uploads',sub:'contenção'},
      {id:'revoke-access',cat:'contain',label:'Revogar acesso',sub:'contenção'},{id:'preserve-ev',cat:'action',label:'Preservar evidências',sub:'ação auto'},
      {id:'forensic-copy',cat:'action',label:'Cópia forense',sub:'ação auto'},{id:'notify-legal',cat:'notify',label:'Notificar jurídico',sub:'notificação'},
      {id:'notify-ciso-x',cat:'notify',label:'Notificar CISO',sub:'notificação'},{id:'confront-user',cat:'trap',label:'Confrontar usuário',sub:'armadilha'},
      {id:'delete-files',cat:'trap',label:'Deletar arquivos',sub:'armadilha'},
    ],
  },
  {
    id:'mfa-brute', title:'Brute Force em MFA', sev:'SEVERIDADE MÉDIA', sevColor:AMBER,
    desc:'5.400 tentativas de MFA push em 8 min para CFO@corp.com vindas de 3 IPs. Usuário não reportou nada.',
    phases:['trigger','enrich','analyze','action'],
    sol:{trigger:['mfa-alert'],enrich:['ip-cluster','mfa-history'],analyze:['fatigue-check','account-risk'],action:['temp-block-mfa','notify-user','open-ticket-mfa']},
    debrief:{trigger:'5.400 pushes em 8 min é MFA fatigue attack — alerta de volume alto é o trigger inequívoco.',enrich:'Cluster de IPs revela se é distribuído. Histórico MFA mostra padrões fora do normal.',analyze:'Checar fadiga confirma o padrão de ataque. Risk score do CFO eleva prioridade.',action:'Bloquear MFA temporariamente interrompe o ataque. Notificar usuário é manual — instrução específica.'},
    blocks:[
      {id:'mfa-alert',cat:'trigger',label:'Alerta MFA',sub:'trigger'},{id:'ip-cluster',cat:'enrich',label:'Cluster de IPs',sub:'enriquecimento'},
      {id:'mfa-history',cat:'enrich',label:'Histórico MFA',sub:'enriquecimento'},{id:'fatigue-check',cat:'analyze',label:'Checar fadiga MFA',sub:'análise'},
      {id:'account-risk',cat:'analyze',label:'Risco da conta',sub:'análise'},{id:'temp-block-mfa',cat:'action',label:'Bloquear MFA',sub:'ação auto'},
      {id:'notify-user',cat:'action',label:'Notificar usuário',sub:'ação manual'},{id:'open-ticket-mfa',cat:'action',label:'Abrir ticket',sub:'ação auto'},
      {id:'force-reset',cat:'trap',label:'Forçar reset senha',sub:'armadilha'},{id:'ignore-alert',cat:'trap',label:'Ignorar alerta',sub:'armadilha'},
    ],
  },
  {
    id:'mov-lateral', title:'Movimento Lateral', sev:'SEVERIDADE CRÍTICA', sevColor:'#f87171',
    desc:'WMI remoto de WRK-042 para 14 servidores em 3 min. Credencial de serviço usada fora do horário.',
    phases:['trigger','enrich','analyze','contain','action','post'],
    sol:{trigger:['edr-lateral'],enrich:['wmi-logs','cred-usage'],analyze:['blast-radius','pivot-chain'],contain:['isolate-wks','disable-cred'],action:['memory-dump','timeline'],post:['update-rules','lessons']},
    debrief:{trigger:'WMI remoto em 14 hosts em 3 min — alerta EDR é o trigger claro.',enrich:'Logs WMI revelam comandos executados. Uso da credencial fora do horário confirma comprometimento.',analyze:'Blast radius mapeia todos os hosts afetados. Pivot chain reconstrói o caminho do atacante.',contain:'Isolar workstation interrompe o pivot. Desabilitar credencial remove o vetor.',action:'Memory dump captura artefatos voláteis. Timeline reconstrói a sequência completa.',post:'Atualizar regras com IOCs. Lições aprendidas fecham o ciclo.'},
    blocks:[
      {id:'edr-lateral',cat:'trigger',label:'Alerta EDR',sub:'trigger'},{id:'wmi-logs',cat:'enrich',label:'Logs WMI',sub:'enriquecimento'},
      {id:'cred-usage',cat:'enrich',label:'Uso de credencial',sub:'enriquecimento'},{id:'blast-radius',cat:'analyze',label:'Blast radius',sub:'análise'},
      {id:'pivot-chain',cat:'analyze',label:'Pivot chain',sub:'análise'},{id:'isolate-wks',cat:'contain',label:'Isolar workstation',sub:'contenção'},
      {id:'disable-cred',cat:'contain',label:'Desabilitar credencial',sub:'contenção'},{id:'memory-dump',cat:'action',label:'Memory dump',sub:'ação auto'},
      {id:'timeline',cat:'action',label:'Montar timeline',sub:'ação manual'},{id:'update-rules',cat:'post',label:'Atualizar regras',sub:'pós-incidente'},
      {id:'lessons',cat:'post',label:'Lições aprendidas',sub:'pós-incidente'},{id:'block-all',cat:'trap',label:'Bloquear toda rede',sub:'armadilha'},
      {id:'reboot',cat:'trap',label:'Reiniciar servidores',sub:'armadilha'},
    ],
  },
  {
    id:'dcsync', title:'DCsync — Ataque ao AD', sev:'SEVERIDADE MÁXIMA', sevColor:'#f87171',
    desc:'Conta não-DC replicando hashes do AD às 01:33. Golden Ticket possível. 3 DCs afetados.',
    phases:['trigger','enrich','analyze','contain','action','notify','post'],
    sol:{trigger:['dc-alert'],enrich:['replication-logs','account-audit'],analyze:['golden-check','scope-dc'],contain:['isolate-dc','disable-account-dc'],action:['krbtgt-reset','evidence-dc'],notify:['notify-ciso-dc','notify-legal-dc'],post:['forest-review','update-rules-dc']},
    debrief:{trigger:'DCsync por conta não-DC é uma das TTPs mais graves de comprometimento de AD.',enrich:'Logs de replicação revelam quais hashes foram copiados. Auditoria identifica quando a conta foi comprometida.',analyze:'Checar Golden Ticket verifica se tickets Kerberos forjados foram emitidos.',contain:'Isolar DCs é urgente. Desabilitar a conta remove o vetor imediato.',action:'Reset do krbtgt (2x) invalida todos os Golden Tickets. Coleta de evidências preserva artefatos.',notify:'CISO e jurídico — comprometimento de AD pode exigir notificação regulatória (LGPD).',post:'Revisão da floresta verifica persistência. Atualizar regras com IOCs do ataque.'},
    blocks:[
      {id:'dc-alert',cat:'trigger',label:'Alerta DCsync',sub:'trigger'},{id:'replication-logs',cat:'enrich',label:'Logs replicação',sub:'enriquecimento'},
      {id:'account-audit',cat:'enrich',label:'Auditoria conta',sub:'enriquecimento'},{id:'golden-check',cat:'analyze',label:'Checar Golden Ticket',sub:'análise'},
      {id:'scope-dc',cat:'analyze',label:'Escopo nos DCs',sub:'análise'},{id:'isolate-dc',cat:'contain',label:'Isolar DCs',sub:'contenção'},
      {id:'disable-account-dc',cat:'contain',label:'Desabilitar conta',sub:'contenção'},{id:'krbtgt-reset',cat:'action',label:'Reset krbtgt',sub:'ação manual'},
      {id:'evidence-dc',cat:'action',label:'Coletar evidências',sub:'ação auto'},{id:'notify-ciso-dc',cat:'notify',label:'Notificar CISO',sub:'notificação'},
      {id:'notify-legal-dc',cat:'notify',label:'Notificar jurídico',sub:'notificação'},{id:'forest-review',cat:'post',label:'Revisão da floresta',sub:'pós-incidente'},
      {id:'update-rules-dc',cat:'post',label:'Atualizar regras',sub:'pós-incidente'},{id:'shutdown-dc',cat:'trap',label:'Desligar todos DCs',sub:'armadilha'},
      {id:'force-reset-all',cat:'trap',label:'Reset geral de senhas',sub:'armadilha'},
    ],
  },
];

// ── Componente de bloco ───────────────────────────────────────────────────────
function Block({ block, diff, onDragStart, onDblClick }) {
  const Icon = ICON_MAP[block.id] || FaShieldAlt;
  const isTrap = block.cat === 'trap';
  const phase = PHASES[block.cat];

  const color = isTrap ? '#f87171' : (phase?.color || TEXT2);
  const bg    = isTrap ? 'rgba(248,113,113,0.08)' : `${color}12`;
  const border= isTrap ? 'rgba(248,113,113,0.25)' : `${color}30`;

  // Avançado: ocultar cor e categoria
  const showSub = diff === 0;
  const style = diff === 2
    ? { background: SURFACE2, borderColor: BORDER, color: TEXT2 }
    : { background: bg, borderColor: border, color };

  return (
    <div
      draggable
      onDragStart={e => { e.dataTransfer.setData('blockId', block.id); onDragStart?.(); }}
      onDoubleClick={onDblClick}
      style={{
        ...style,
        border: `1px solid`,
        borderColor: style.borderColor,
        borderRadius: 8, padding: '6px 10px',
        cursor: 'grab', userSelect: 'none',
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 12, fontFamily: SANS, fontWeight: 500,
        transition: 'opacity .15s',
      }}
    >
      <Icon size={13} style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, lineHeight: 1.3 }}>
        {block.label}
        {showSub && (
          <div style={{ fontSize: 9, opacity: 0.6, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 1 }}>
            {block.sub}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function PlaybookScreen({ onBack, onXpGain }) {
  const [scIdx,   setScIdx]   = useState(0);
  const [diff,    setDiff]    = useState(0);
  const [placed,  setPlaced]  = useState({});   // { phase: [id, ...] }
  const [result,  setResult]  = useState(null);
  const [done,    setDone]    = useState(new Set());
  const [dxTotal, setDxTotal] = useState(0);

  const sc = SCENARIOS[scIdx];

  // Inicializar fases do cenário
  const initPlaced = useCallback((scenario) => {
    const p = {};
    scenario.phases.forEach(ph => p[ph] = []);
    return p;
  }, []);

  // Trocar cenário
  const loadScenario = (idx) => {
    setScIdx(idx);
    setPlaced(initPlaced(SCENARIOS[idx]));
    setResult(null);
  };

  // Drop numa fase
  const handleDrop = (phase, e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('blockId');
    if (!id) return;
    setPlaced(prev => {
      const next = { ...prev };
      // Remover de outras fases
      Object.keys(next).forEach(ph => {
        next[ph] = next[ph].filter(x => x !== id);
      });
      if (!next[phase]) next[phase] = [];
      if (!next[phase].includes(id)) next[phase] = [...next[phase], id];
      return next;
    });
    setResult(null);
  };

  // Remover bloco da fase (duplo clique)
  const removeBlock = (phase, id) => {
    setPlaced(prev => ({ ...prev, [phase]: prev[phase].filter(x => x !== id) }));
    setResult(null);
  };

  // Avaliar playbook
  const evaluate = () => {
    const sol = sc.sol;
    let score = 0, total = 0, missed = [], trapsUsed = [];
    sc.phases.forEach(ph => {
      const correct = sol[ph] || [];
      total += correct.length;
      (placed[ph] || []).forEach(id => { if (TRAPS.has(id)) trapsUsed.push(id); });
      correct.forEach(id => {
        if ((placed[ph] || []).includes(id)) score++;
        else missed.push(id);
      });
    });
    const pct = Math.round((score / total) * 100);
    const row = DX_TABLE[diff];
    let dx = 0;
    if (trapsUsed.length === 0 && diff > 0) {
      if (pct === 100) dx = row[0];
      else if (pct >= 80) dx = row[1];
      else if (pct >= 50) dx = row[2];
      else dx = row[3];
    }

    if (dx > 0) {
      setDxTotal(prev => prev + dx);
      onXpGain?.(dx);
    }

    if (pct === 100) {
      setDone(prev => new Set([...prev, scIdx]));
    }

    const missedBlocks = missed.map(id => sc.blocks.find(b => b.id === id)?.label || id);
    const trapBlocks   = trapsUsed.map(id => sc.blocks.find(b => b.id === id)?.label || id);
    setResult({ pct, dx, trapsUsed: trapBlocks, missed: missedBlocks, perfect: pct === 100 });
  };

  // Blocos não colocados
  const placedAll = Object.values(placed).flat();
  const palette   = sc.blocks.filter(b => !placedAll.includes(b.id));

  // Layout das fases
  const nPhases = sc.phases.length;
  const cols    = nPhases <= 3 ? nPhases : nPhases <= 6 ? Math.ceil(nPhases / 2) : 4;

  return (
    <div style={{ minHeight: '100dvh', background: BG, display: 'flex', flexDirection: 'column', fontFamily: SANS }}>

      {/* Header */}
      <div style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: TEXT3, fontSize: 22 }}>‹</button>
        <FaShieldAlt size={18} color={ACCENT} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: MONO, color: TEXT3, fontSize: 11, letterSpacing: 2 }}>PLAYBOOK BUILDER</div>
          <div style={{ color: TEXT, fontSize: 16, fontWeight: 900 }}>Resposta a Incidentes</div>
        </div>
        {/* DX total */}
        <div style={{ background: 'rgba(255,75,122,0.1)', borderRadius: 10, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaBolt size={13} color={ACCENT} />
          <span style={{ fontFamily: MONO, color: ACCENT, fontSize: 14, fontWeight: 800 }}>{dxTotal} DX</span>
        </div>
      </div>

      {/* Navegação de cenários */}
      <div style={{ display: 'flex', gap: 5, padding: '10px 20px 0', flexWrap: 'wrap' }}>
        {SCENARIOS.map((s, i) => (
          <button key={i} onClick={() => loadScenario(i)}
            title={s.title}
            style={{
              width: 32, height: 6, borderRadius: 3, border: 'none', cursor: 'pointer',
              background: done.has(i) ? GREEN : i === scIdx ? ACCENT : BORDER,
              transition: 'background .2s',
            }}
          />
        ))}
      </div>

      {/* Cenário */}
      <div style={{ margin: '12px 20px 0', background: SURFACE, borderRadius: 12, padding: '12px 14px', border: `1px solid ${BORDER}` }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, color: sc.sevColor, marginBottom: 3 }}>{sc.sev}</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: TEXT, marginBottom: 4 }}>{sc.title}</div>
        <div style={{ fontSize: 12, color: TEXT2, lineHeight: 1.5 }}>{sc.desc}</div>
      </div>

      {/* Seletor de dificuldade */}
      <div style={{ margin: '10px 20px 0' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: TEXT3, letterSpacing: 1, marginBottom: 6 }}>DIFICULDADE — afeta DX ganho</div>
        <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
          {[
            { label: 'Tutorial',      dx: '0 DX',        color: TEXT3   },
            { label: 'Intermediário', dx: 'até 80 DX',   color: PURPLE  },
            { label: 'Avançado',      dx: 'até 250 DX',  color: GREEN   },
          ].map((d, i) => (
            <button key={i} onClick={() => { setDiff(i); setResult(null); }}
              style={{
                flex: 1, border: 'none', borderRight: i < 2 ? `1px solid ${BORDER}` : 'none',
                padding: '8px 6px', cursor: 'pointer', textAlign: 'center',
                background: diff === i
                  ? i === 0 ? SURFACE2 : i === 1 ? 'rgba(168,85,247,0.15)' : 'rgba(88,204,2,0.1)'
                  : 'transparent',
                transition: 'background .15s',
              }}
            >
              <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color: diff === i ? (i === 0 ? TEXT3 : i === 1 ? PURPLE : GREEN) : TEXT3 }}>{d.label}</div>
              <div style={{ fontFamily: MONO, fontSize: 10, color: diff === i ? d.color : TEXT3, marginTop: 2 }}>{d.dx}</div>
            </button>
          ))}
        </div>
        {diff === 0 && (
          <div style={{ background: 'rgba(255,200,0,0.08)', border: `1px solid rgba(255,200,0,0.2)`, borderRadius: 8, padding: '7px 10px', fontSize: 11, color: AMBER, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiAlertTriangle size={13} /> Modo Tutorial não concede DX — treine sem pressão.
          </div>
        )}
      </div>

      {/* Fases — drop zones */}
      <div style={{ margin: '10px 20px 0', fontFamily: MONO, fontSize: 10, color: TEXT3, letterSpacing: 1 }}>
        MONTE O PLAYBOOK — {sc.phases.length} FASES
      </div>
      <div style={{
        display: 'grid', gap: 0,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        margin: '6px 20px 0',
        border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden',
      }}>
        {sc.phases.map((ph, i) => {
          const phase = PHASES[ph];
          const blocksInZone = (placed[ph] || []).map(id => sc.blocks.find(b => b.id === id)).filter(Boolean);
          return (
            <div key={ph}
              style={{
                borderRight: i < sc.phases.length - 1 && (i + 1) % cols !== 0 ? `1px solid ${BORDER}` : 'none',
                borderBottom: i < sc.phases.length - cols ? `1px solid ${BORDER}` : 'none',
              }}
            >
              {/* Lane header */}
              <div style={{ padding: '6px 8px', borderBottom: `1px solid ${BORDER}`, textAlign: 'center', fontFamily: MONO, fontSize: 10, letterSpacing: 1, color: phase.color }}>
                {phase.label}
              </div>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.background = `${phase.color}10`; }}
                onDragLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                onDrop={e => { e.currentTarget.style.background = 'transparent'; handleDrop(ph, e); }}
                style={{ minHeight: 80, padding: 6, display: 'flex', flexDirection: 'column', gap: 4, transition: 'background .15s' }}
              >
                {blocksInZone.map(b => (
                  <Block key={b.id} block={b} diff={diff} onDblClick={() => removeBlock(ph, b.id)} />
                ))}
                {blocksInZone.length === 0 && (
                  <div style={{ fontSize: 10, color: `${BORDER}`, textAlign: 'center', padding: '8px 0', color: 'rgba(255,255,255,0.12)' }}>
                    arraste aqui
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Paleta de blocos */}
      <div style={{ margin: '10px 20px 0' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, color: TEXT3, letterSpacing: 1, marginBottom: 8 }}>BLOCOS DISPONÍVEIS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 5 }}>
          {palette.map(b => <Block key={b.id} block={b} diff={diff} />)}
        </div>
      </div>

      {/* Botão avaliar */}
      <button onClick={evaluate}
        style={{
          margin: '12px 20px 0', background: ACCENT, color: '#fff', border: 'none',
          borderBottom: '3px solid #cc0055', borderRadius: 12, padding: '12px',
          fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: SANS,
        }}
      >
        Avaliar Playbook
      </button>

      {/* Resultado */}
      {result && (
        <div style={{ margin: '10px 20px 16px', borderRadius: 12, padding: '14px', border: `1px solid ${result.trapsUsed.length > 0 ? 'rgba(248,113,113,0.3)' : result.perfect ? 'rgba(88,204,2,0.3)' : 'rgba(255,200,0,0.3)'}`, background: result.trapsUsed.length > 0 ? 'rgba(248,113,113,0.06)' : result.perfect ? 'rgba(88,204,2,0.06)' : 'rgba(255,200,0,0.06)' }}>

          {/* DX badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: result.dx > 0 ? 'rgba(88,204,2,0.12)' : SURFACE2, borderRadius: 20, padding: '4px 12px', marginBottom: 10 }}>
            <FaBolt size={12} color={result.dx > 0 ? GREEN : TEXT3} />
            <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: result.dx > 0 ? GREEN : TEXT3 }}>
              {result.dx > 0 ? `+${result.dx} DX` : `0 DX${diff === 0 ? ' — tutorial' : ''}`}
            </span>
          </div>

          {result.trapsUsed.length > 0 && (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#f87171', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                ✕ Armadilha ativada
              </div>
              <div style={{ fontSize: 12, color: TEXT2, marginBottom: 8 }}>
                Usado: <strong style={{ color: '#f87171' }}>{result.trapsUsed.join(', ')}</strong>
              </div>
            </>
          )}

          {!result.trapsUsed.length && result.perfect && (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FaCheckCircle /> Playbook perfeito!
              </div>
              {/* Debrief por fase */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
                {sc.phases.map(ph => (
                  <div key={ph}>
                    <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1, fontWeight: 700, color: PHASES[ph].color, marginBottom: 3 }}>
                      {PHASES[ph].label.toUpperCase()}
                    </div>
                    <div style={{ fontSize: 12, color: TEXT2, lineHeight: 1.5 }}>{sc.debrief[ph]}</div>
                  </div>
                ))}
              </div>
              {/* Próximo cenário */}
              {scIdx + 1 < SCENARIOS.length ? (
                <button onClick={() => loadScenario(scIdx + 1)}
                  style={{ marginTop: 12, background: GREEN, color: '#131f24', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer', width: '100%', fontFamily: SANS }}>
                  Próximo cenário →
                </button>
              ) : (
                <div style={{ textAlign: 'center', color: GREEN, fontSize: 13, marginTop: 10 }}>
                  🏆 Todos os {SCENARIOS.length} cenários concluídos! {dxTotal} DX total
                </div>
              )}
            </>
          )}

          {!result.trapsUsed.length && !result.perfect && (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, color: result.pct >= 80 ? AMBER : '#f87171', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                {result.pct >= 80 ? '△' : '✕'} {result.pct >= 80 ? `Quase! ${result.pct}% correto` : `Incompleto — ${result.pct}% correto`}
              </div>
              <div style={{ fontSize: 12, color: TEXT2, marginBottom: 6 }}>
                Faltou: <strong style={{ color: TEXT }}>{result.missed.join(', ')}</strong>
              </div>
              <div style={{ fontSize: 11, color: TEXT3, background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '7px 10px', lineHeight: 1.5 }}>
                {result.pct >= 80
                  ? 'Acerte 100% para ver o debrief completo e ganhar o DX máximo.'
                  : 'Pense: o que precisa saber antes de agir? O que conter antes de remediar?'}
              </div>
            </>
          )}

          {/* Reiniciar */}
          {!result.perfect && (
            <button onClick={() => { setPlaced(initPlaced(sc)); setResult(null); }}
              style={{ marginTop: 8, background: SURFACE, color: TEXT3, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px', fontSize: 12, cursor: 'pointer', width: '100%', fontFamily: SANS }}>
              Tentar novamente
            </button>
          )}
        </div>
      )}

    </div>
  );
}
