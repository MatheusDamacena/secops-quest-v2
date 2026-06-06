// ─── AVATAR COMPONENT ─────────────────────────────────────────────────────────
// Renderiza o ícone react-icons do avatar do usuário
// Uso: <Avatar profile={profile} size={32} />
import { AVATARS } from '../data/avatars';

export default function Avatar({ profile, size = 32 }) {
  const av = AVATARS.find(a => a.id === profile?.avatarId) || AVATARS[0];
  return <av.Icon size={size} color={av.color} />;
}
