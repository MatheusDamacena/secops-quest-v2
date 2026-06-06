// ─── MODULE ICON ──────────────────────────────────────────────────────────────
// Renderiza o ícone correto para cada módulo
import { FaLandmark, FaMicroscope, FaDraftingCompass, FaGamepad, FaTrophy, FaPlug } from 'react-icons/fa';
import { GiCircuitry } from 'react-icons/gi';

const MAP = {
  m0: { Icon: FaLandmark,        color: '#00c4cc' },
  m1: { Icon: GiCircuitry,       color: '#a78bfa' },
  m2: { Icon: FaMicroscope,      color: '#22d3a0' },
  m3: { Icon: FaDraftingCompass, color: '#f59e0b' },
  m4: { Icon: FaGamepad,         color: '#ff1a75' },
  m5: { Icon: FaTrophy,          color: '#fbbf24' },
  m6: { Icon: FaPlug,            color: '#fb923c' },
};

export default function ModuleIcon({ iconId, size = 22, done = false }) {
  const entry = MAP[iconId] || MAP['m0'];
  const { Icon, color } = entry;
  return <Icon size={size} color={done ? '#22d3a0' : color} />;
}
