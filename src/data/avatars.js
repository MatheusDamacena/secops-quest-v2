// ─── AVATARES DO SECOPS QUEST ─────────────────────────────────────────────────
// Todos os avatares usam react-icons para modularidade e consistência visual
// Para adicionar novos: importe de react-icons e adicione ao array AVATARS

// Defensores
import { FaShieldAlt, FaShieldVirus, FaUserShield, FaBug, FaEye, FaRobot, FaDatabase, FaNetworkWired, FaVirus, FaFingerprint, FaTerminal, FaSkull } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import { GiGrimReaper, GiDragonHead, GiWolfHead, GiSnake, GiRaven, GiGhost, GiSpy, GiNinjaMask, GiCrossedSwords, GiEagleEmblem, GiHawkEmblem } from 'react-icons/gi';

export const AVATARS = [
  // ── Defensores ──
  { id: 'guardian',   label: 'Guardião',    Icon: FaShieldAlt,    color: '#00c4cc' },
  { id: 'analyst',    label: 'Analista',    Icon: FaShieldVirus,  color: '#22d3a0' },
  { id: 'sentinel',   label: 'Sentinela',   Icon: MdSecurity,     color: '#f59e0b' },
  { id: 'protector',  label: 'Protetor',    Icon: FaUserShield,   color: '#a78bfa' },
  { id: 'eagle',      label: 'Águia',       Icon: GiEagleEmblem,  color: '#00c4cc' },
  { id: 'hawk',       label: 'Falcão',      Icon: GiHawkEmblem,   color: '#22d3a0' },

  // ── Atacantes ──
  { id: 'phantom',    label: 'Phantom',     Icon: FaSkull,        color: '#ff4d4d' },
  { id: 'reaper',     label: 'Reaper',      Icon: GiGrimReaper,   color: '#a78bfa' },
  { id: 'ninja',      label: 'Ninja',       Icon: GiNinjaMask,    color: '#22d3a0' },
  { id: 'dragon',     label: 'Dragão',      Icon: GiDragonHead,   color: '#ff4d4d' },
  { id: 'wolf',       label: 'Lobo',        Icon: GiWolfHead,     color: '#f59e0b' },
  { id: 'snake',      label: 'Cobra',       Icon: GiSnake,        color: '#22d3a0' },
  { id: 'raven',      label: 'Corvo',       Icon: GiRaven,        color: '#9ca3af' },
  { id: 'bughunter',  label: 'Bug Hunter',  Icon: FaBug,          color: '#ff1a75' },
  { id: 'invader',    label: 'Invasor',     Icon: GiCrossedSwords,color: '#ff4d4d' },

  // ── Operações ──
  { id: 'terminal',   label: 'Terminal',    Icon: FaTerminal,     color: '#22d3a0' },
  { id: 'watcher',    label: 'Watcher',     Icon: FaEye,          color: '#f59e0b' },
  { id: 'spy',        label: 'Espião',      Icon: GiSpy,          color: '#22d3a0' },
  { id: 'bot',        label: 'Bot',         Icon: FaRobot,        color: '#a78bfa' },
  { id: 'chronicle',  label: 'Chronicle',   Icon: FaDatabase,     color: '#00c4cc' },
  { id: 'ghost',      label: 'Ghost',       Icon: GiGhost,        color: '#9ca3af' },
  { id: 'malware',    label: 'Malware',     Icon: FaVirus,        color: '#ff4d4d' },
  { id: 'identity',   label: 'Identidade',  Icon: FaFingerprint,  color: '#ff1a75' },
  { id: 'soclead',    label: 'SOC Lead',    Icon: FaNetworkWired, color: '#ff1a75' },
];
