// ─── INTERNACIONALIZAÇÃO ───────────────────────────────────────────────────────
// Strings da UI em PT (Português), EN (English) e ES (Español)
// Conteúdo das lições permanece em PT (terminologia técnica universal)

export const LANGS = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English',   flag: '🇺🇸' },
  { code: 'es', label: 'Español',   flag: '🇪🇸' },
];

export const T = {
  // ── Auth ──
  auth_title:       { pt:'SecOps Quest', en:'SecOps Quest', es:'SecOps Quest' },
  auth_subtitle:    { pt:'GOOGLE SECOPS · YARA-L · UDM', en:'GOOGLE SECOPS · YARA-L · UDM', es:'GOOGLE SECOPS · YARA-L · UDM' },
  auth_google:      { pt:'Entrar com Google', en:'Sign in with Google', es:'Entrar con Google' },
  auth_or:          { pt:'ou', en:'or', es:'o' },
  auth_email:       { pt:'email@empresa.com', en:'email@company.com', es:'email@empresa.com' },
  auth_password:    { pt:'Senha (min. 6 caracteres)', en:'Password (min. 6 chars)', es:'Contraseña (mín. 6 chars)' },
  auth_enter:       { pt:'▶ Entrar', en:'▶ Sign In', es:'▶ Entrar' },
  auth_no_account:  { pt:'Não tem conta? Criar agora', en:"Don't have an account? Sign up", es:'¿No tienes cuenta? Regístrate' },
  auth_forgot:      { pt:'Esqueci minha senha', en:'Forgot my password', es:'Olvidé mi contraseña' },
  auth_have_account:{ pt:'Já tem conta? Entrar', en:'Already have an account? Sign in', es:'¿Ya tienes cuenta? Entrar' },
  auth_create:      { pt:'▶ Criar conta', en:'▶ Create account', es:'▶ Crear cuenta' },
  auth_reset_title: { pt:'Recuperar senha', en:'Reset password', es:'Recuperar contraseña' },
  auth_reset_send:  { pt:'Enviar link de recuperação', en:'Send reset link', es:'Enviar enlace de recuperación' },
  auth_reset_sent:  { pt:'Link enviado! Verifique seu email.', en:'Link sent! Check your email.', es:'¡Link enviado! Revisa tu email.' },
  auth_back:        { pt:'Voltar ao login', en:'Back to login', es:'Volver al login' },

  // ── Setup ──
  setup_title:      { pt:'Bem-vindo!', en:'Welcome!', es:'¡Bienvenido!' },
  setup_subtitle:   { pt:'Crie seu perfil para salvar o progresso', en:'Create your profile to save progress', es:'Crea tu perfil para guardar el progreso' },
  setup_name:       { pt:'SEU NOME', en:'YOUR NAME', es:'TU NOMBRE' },
  setup_name_ph:    { pt:'Ex: João Silva', en:'Ex: John Smith', es:'Ej: Juan García' },
  setup_avatar:     { pt:'ESCOLHA SEU AVATAR', en:'CHOOSE YOUR AVATAR', es:'ELIGE TU AVATAR' },
  setup_cat_def:    { pt:'Defensores', en:'Defenders', es:'Defensores' },
  setup_cat_atk:    { pt:'Atacantes', en:'Attackers', es:'Atacantes' },
  setup_cat_ops:    { pt:'Operações', en:'Operations', es:'Operaciones' },
  setup_btn:        { pt:'▶ ENTRAR NO JOGO', en:'▶ START PLAYING', es:'▶ COMENZAR' },

  // ── Home ──
  home_modules:     { pt:'módulos', en:'modules', es:'módulos' },
  home_in_progress: { pt:'EM PROGRESSO', en:'IN PROGRESS', es:'EN PROGRESO' },
  home_next:        { pt:'PRÓXIMOS', en:'NEXT UP', es:'PRÓXIMOS' },
  home_continue:    { pt:'▶ Continuar', en:'▶ Continue', es:'▶ Continuar' },
  home_of:          { pt:'DE', en:'OF', es:'DE' },
  home_done:        { pt:'CONCLUÍDO', en:'COMPLETED', es:'COMPLETADO' },
  home_greeting:    { pt:'Olá', en:'Hello', es:'Hola' },

  // ── Bottom Nav ──
  nav_learn:        { pt:'Aprender', en:'Learn', es:'Aprender' },
  nav_glossary:     { pt:'Glossário', en:'Glossary', es:'Glosario' },
  nav_missions:     { pt:'Missões', en:'Missions', es:'Misiones' },
  nav_ranking:      { pt:'Ranking', en:'Ranking', es:'Ranking' },
  nav_profile:      { pt:'Perfil', en:'Profile', es:'Perfil' },

  // ── Module / Flashcard ──
  card_tap:         { pt:'Toque para ver a resposta', en:'Tap to reveal answer', es:'Toca para ver la respuesta' },
  card_answer:      { pt:'RESPOSTA ▼', en:'ANSWER ▼', es:'RESPUESTA ▼' },
  card_next:        { pt:'PRÓXIMO →', en:'NEXT →', es:'SIGUIENTE →' },
  card_challenges:  { pt:'▶ FAZER OS DESAFIOS', en:'▶ START CHALLENGES', es:'▶ HACER DESAFÍOS' },

  // ── Challenges ──
  chal_complete:    { pt:'COMPLETE A FRASE', en:'COMPLETE THE SENTENCE', es:'COMPLETA LA FRASE' },
  chal_truefalse:   { pt:'VERDADEIRO OU FALSO?', en:'TRUE OR FALSE?', es:'¿VERDADERO O FALSO?' },
  chal_verify:      { pt:'VERIFICAR', en:'CHECK', es:'VERIFICAR' },
  chal_continue:    { pt:'CONTINUAR', en:'CONTINUE', es:'CONTINUAR' },
  chal_finish:      { pt:'FINALIZAR', en:'FINISH', es:'FINALIZAR' },
  chal_correct:     { pt:'Correto!', en:'Correct!', es:'¡Correcto!' },
  chal_wrong:       { pt:'Incorreto', en:'Incorrect', es:'Incorrecto' },
  chal_true:        { pt:'Verdadeiro', en:'True', es:'Verdadero' },
  chal_false:       { pt:'Falso', en:'False', es:'Falso' },
  chal_no_lives:    { pt:'Sem vidas!', en:'No lives left!', es:'¡Sin vidas!' },
  chal_try_again:   { pt:'🔄 TENTAR NOVAMENTE', en:'🔄 TRY AGAIN', es:'🔄 INTENTAR DE NUEVO' },

  // ── Missions ──
  mission_verify:   { pt:'VERIFICAR', en:'CHECK', es:'VERIFICAR' },
  mission_section:  { pt:'SEÇÃO', en:'SECTION', es:'SECCIÓN' },
  mission_done_all: { pt:'Todas as missões concluídas!', en:'All missions completed!', es:'¡Todas las misiones completadas!' },

  // ── Profile ──
  profile_title:    { pt:'Perfil', en:'Profile', es:'Perfil' },
  profile_dx:       { pt:'DX TOTAL', en:'TOTAL XP', es:'XP TOTAL' },
  profile_streak:   { pt:'SEQUÊNCIA', en:'STREAK', es:'RACHA' },
  profile_modules:  { pt:'MÓDULOS', en:'MODULES', es:'MÓDULOS' },
  profile_missions: { pt:'MISSÕES', en:'MISSIONS', es:'MISIONES' },
  profile_days:     { pt:'dias', en:'days', es:'días' },
  profile_logout:   { pt:'Sair do jogo', en:'Sign out', es:'Cerrar sesión' },
  profile_reset:    { pt:'Resetar progresso', en:'Reset progress', es:'Reiniciar progreso' },
  profile_logout_q: { pt:'Sair do jogo?', en:'Sign out?', es:'¿Cerrar sesión?' },
  profile_reset_q:  { pt:'Resetar tudo?', en:'Reset everything?', es:'¿Reiniciar todo?' },
  profile_confirm:  { pt:'Confirmar', en:'Confirm', es:'Confirmar' },
  profile_cancel:   { pt:'Cancelar', en:'Cancel', es:'Cancelar' },
  profile_language: { pt:'IDIOMA', en:'LANGUAGE', es:'IDIOMA' },

  // ── Leaderboard ──
  lb_title:         { pt:'Leaderboard', en:'Leaderboard', es:'Clasificación' },
  lb_empty:         { pt:'Nenhum jogador ainda', en:'No players yet', es:'Sin jugadores aún' },
  lb_promotion:     { pt:'PROMOÇÃO', en:'PROMOTION', es:'PROMOCIÓN' },
  lb_relegation:    { pt:'REBAIXAMENTO', en:'RELEGATION', es:'DESCENSO' },

  // ── Glossary ──
  glossary_title:   { pt:'Glossário', en:'Glossary', es:'Glosario' },
  glossary_search:  { pt:'Buscar termo...', en:'Search term...', es:'Buscar término...' },
  glossary_empty:   { pt:'Nenhum termo encontrado.', en:'No terms found.', es:'No se encontraron términos.' },

  // ── Loading ──
  loading:          { pt:'CARREGANDO...', en:'LOADING...', es:'CARGANDO...' },

  // ── Completion ──
  completed:        { pt:'concluída!', en:'completed!', es:'¡completada!' },
  dx_earned:        { pt:'DX conquistados', en:'XP earned', es:'XP ganados' },
  btn_continue:     { pt:'CONTINUAR →', en:'CONTINUE →', es:'CONTINUAR →' },
};

// Helper para pegar string no idioma atual
export function t(key, lang = 'pt') {
  return T[key]?.[lang] ?? T[key]?.pt ?? key;
}
