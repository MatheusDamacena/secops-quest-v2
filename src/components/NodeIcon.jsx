// ─── NODE ICON ────────────────────────────────────────────────────────────────
// Mapeamento completo de emoji → react-icons para todo o jogo
// Para adicionar/trocar: edite apenas este arquivo

import {
  FaSatelliteDish, FaCog, FaLandmark, FaExchangeAlt, FaCrosshairs,
  FaBell, FaSearch, FaRobot, FaShieldAlt, FaHardHat, FaBox,
  FaInbox, FaShoppingCart, FaDraftingCompass, FaFont, FaClock,
  FaBolt, FaChartBar, FaList, FaLink, FaArchive, FaDesktop,
  FaRandom, FaUpload, FaFire, FaCloud, FaLinux, FaLock, FaKey,
  FaEye, FaPlug, FaServer, FaTerminal, FaDatabase, FaCode,
  FaCheckCircle, FaExclamationTriangle, FaGlobe, FaWifi,
  FaProjectDiagram, FaTag, FaUser, FaFolder, FaMoon, FaSun,
  FaPlane, FaEnvelope, FaDoorOpen, FaCrown, FaLockOpen,
  FaNetworkWired, FaBrain, FaSkull, FaBiohazard, FaSyringe,
  FaSpinner, FaRocket, FaIdCard, FaUserSecret, FaVirus,
  FaHdd, FaGithub, FaTrash, FaUnlock,
} from 'react-icons/fa';
import { MdOutlineStorefront } from 'react-icons/md';
import { GiCircuitry, GiPoison, GiSpiralBottle } from 'react-icons/gi';
import { MdOutlineDevices } from 'react-icons/md';

const MAP = {
  // ── Infraestrutura ──
  '📡': { Icon: FaSatelliteDish,    color: '#00c4cc' },
  '⚙️': { Icon: FaCog,              color: '#fbbf24' },
  '🏛':  { Icon: FaLandmark,         color: '#22d3a0' },
  '🔄':  { Icon: FaExchangeAlt,      color: '#22d3a0' },
  '🔀':  { Icon: FaRandom,           color: '#fbbf24' },
  '🖥':  { Icon: FaDesktop,          color: '#00c4cc' },
  '🖧':  { Icon: FaServer,           color: '#00c4cc' },
  '🔌':  { Icon: FaPlug,             color: '#fb923c' },
  '💻':  { Icon: FaTerminal,         color: '#22d3a0' },
  '🗄':  { Icon: FaDatabase,         color: '#a78bfa' },
  '🌐':  { Icon: FaGlobe,            color: '#00c4cc' },
  '📶':  { Icon: FaWifi,             color: '#00c4cc' },
  '☁️': { Icon: FaCloud,            color: '#00c4cc' },
  '🐧':  { Icon: FaLinux,            color: '#22d3a0' },

  // ── Segurança / Detecção ──
  '🎯':  { Icon: FaCrosshairs,       color: '#a78bfa' },
  '🚨':  { Icon: FaBell,             color: '#ff4d4d' },
  '🔍':  { Icon: FaSearch,           color: '#fbbf24' },
  '🛡':  { Icon: FaShieldAlt,        color: '#ff4d4d' },
  '🔒':  { Icon: FaLock,             color: '#a78bfa' },
  '🔐':  { Icon: FaLockOpen,         color: '#ff4d4d' },
  '🔑':  { Icon: FaKey,              color: '#fbbf24' },
  '👁':  { Icon: FaEye,              color: '#f59e0b' },
  '⚠️': { Icon: FaExclamationTriangle, color: '#fbbf24' },
  '⚔️': { Icon: FaCrosshairs,       color: '#ff4d4d' },
  '☠️': { Icon: FaSkull,            color: '#ff4d4d' },

  // ── Ameaças ──
  '🤖':  { Icon: FaRobot,            color: '#ff4d4d' },
  '🦠':  { Icon: FaVirus,            color: '#ff4d4d' },
  '💉':  { Icon: FaSyringe,          color: '#a78bfa' },
  '🌀':  { Icon: FaSpinner,          color: '#00c4cc' },
  '👾':  { Icon: FaRobot,            color: '#a78bfa' },

  // ── Dados / Logs ──
  '📊':  { Icon: FaChartBar,         color: '#a78bfa' },
  '📋':  { Icon: FaList,             color: '#22d3a0' },
  '📝':  { Icon: FaCode,             color: '#22d3a0' },
  '📁':  { Icon: FaFolder,           color: '#f59e0b' },
  '🗂':  { Icon: FaArchive,          color: '#f59e0b' },
  '🗃':  { Icon: FaArchive,          color: '#f59e0b' },
  '🏷':  { Icon: FaTag,              color: '#fbbf24' },
  '📦':  { Icon: FaBox,              color: '#f59e0b' },
  '📥':  { Icon: FaInbox,            color: '#00c4cc' },
  '📤':  { Icon: FaUpload,           color: '#f97316' },
  '📨':  { Icon: FaEnvelope,         color: '#00c4cc' },
  '📧':  { Icon: FaEnvelope,         color: '#00c4cc' },
  '📐':  { Icon: FaDraftingCompass,  color: '#f59e0b' },
  '📶':  { Icon: FaWifi,             color: '#00c4cc' },
  '🔗':  { Icon: FaLink,             color: '#a78bfa' },
  '🔤':  { Icon: FaFont,             color: '#a78bfa' },

  // ── Módulos / Conteúdo ──
  '🏗':  { Icon: FaHardHat,          color: '#f59e0b' },
  '🛒':  { Icon: FaShoppingCart,     color: '#f59e0b' },
  '🏆':  { Icon: FaChartBar,         color: '#fbbf24' },

  // ── Pessoas / Identidade ──
  '👤':  { Icon: FaUser,             color: '#00c4cc' },
  '👑':  { Icon: FaCrown,            color: '#fbbf24' },
  '🪪':  { Icon: FaIdCard,           color: '#a78bfa' },
  '🕵':  { Icon: FaUserSecret,       color: '#22d3a0' },

  // ── Tempo / Movimento ──
  '⏱':  { Icon: FaClock,            color: '#00c4cc' },
  '⚡':  { Icon: FaBolt,             color: '#fbbf24' },
  '🔥':  { Icon: FaFire,             color: '#f97316' },
  '🌙':  { Icon: FaMoon,             color: '#a78bfa' },
  '☀️': { Icon: FaSun,              color: '#fbbf24' },
  '✈️': { Icon: FaPlane,            color: '#00c4cc' },
  '🚀':  { Icon: FaRocket,           color: '#ff1a75' },

  // ── Ações / UI ──
  '✅':  { Icon: FaCheckCircle,      color: '#22d3a0' },
  '🚪':  { Icon: FaDoorOpen,         color: '#f59e0b' },
  '🧠':  { Icon: FaBrain,            color: '#a78bfa' },

  // ── Adicionais missões ──
  '💾':  { Icon: FaHdd,             color: '#a78bfa' },  // LSASS dump
  '🐙':  { Icon: FaGithub,          color: '#ffffff' },  // GitHub
  '🗝️': { Icon: FaKey,             color: '#fbbf24' },  // API Key
  '🗑️': { Icon: FaTrash,           color: '#ff4d4d' },  // Event log cleared
  '🔓':  { Icon: FaUnlock,          color: '#ff4d4d' },  // MFA desativado
  '🪣':  { Icon: FaDatabase,        color: '#4285F4' },  // GCS Bucket
};

export default function NodeIcon({ icon, color, size = 18 }) {
  // Normalizar variantes de emoji com/sem selector (️)
  const key = icon?.replace(/\uFE0F/g, '') || '';
  const entry = MAP[key] || MAP[icon];
  
  if (!entry) {
    // Fallback: renderiza o emoji original
    return <span style={{ fontSize: size, lineHeight: 1 }}>{icon}</span>;
  }
  const { Icon, color: defaultColor } = entry;
  return <Icon size={size} color={color || defaultColor} />;
}
