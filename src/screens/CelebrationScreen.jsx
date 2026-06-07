// ─── CELEBRATION SCREEN — Tela de conclusão do jogo completo ──────────────────
import { useEffect, useRef } from 'react';
import { C, F } from '../styles/tokens';
import { FaTrophy, FaBolt, FaFire } from 'react-icons/fa';

// Confete simples via canvas
function Confetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FFD700','#00c4cc','#ff4d4d','#22d3a0','#a78bfa','#fbbf24','#ffffff'];
    const pieces = Array.from({ length: 160 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      vx: (Math.random() - 0.5) * 2,
    }));

    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.rotSpeed;
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return <canvas ref={canvasRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }} />;
}

export default function CelebrationScreen({ profile, totalXp, streak, onContinue }) {
  return (
    <div style={{ minHeight:'100dvh', background:'#0a0b0c', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, textAlign:'center', position:'relative', overflow:'hidden' }}>
      <Confetti />

      <div style={{ position:'relative', zIndex:1, maxWidth:480, width:'100%' }}>
        {/* Troféu animado */}
        <div style={{ fontSize:96, marginBottom:8, animation:'bounce 1s ease infinite alternate' }}>🏆</div>
        <style>{`@keyframes bounce { from { transform: translateY(0) scale(1); } to { transform: translateY(-12px) scale(1.05); } } @keyframes glow { from { text-shadow: 0 0 20px #FFD700; } to { text-shadow: 0 0 50px #FFD700, 0 0 80px #fbbf24; } }`}</style>

        <div style={{ fontFamily:F.display, fontSize:28, fontWeight:900, color:'#FFD700', marginBottom:6, animation:'glow 1.5s ease infinite alternate' }}>
          GRANDMASTER!
        </div>
        <div style={{ fontFamily:F.display, fontSize:16, fontWeight:700, color:C.textDim, marginBottom:4 }}>
          GOOGLE SECOPS ANALYST
        </div>
        <div style={{ fontFamily:F.mono, color:C.accent, fontSize:12, letterSpacing:3, marginBottom:32 }}>
          TODOS OS 7 MÓDULOS CONCLUÍDOS
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:32 }}>
          {[
            { label:'DX TOTAL',  value: totalXp,      icon:<FaBolt  size={20} color='#a78bfa' /> },
            { label:'SEQUÊNCIA', value:`${streak}d`,  icon:<FaFire  size={20} color={C.amber}  /> },
          ].map(s => (
            <div key={s.label} style={{ background:'#1a1b1e', border:'1px solid #FFD70044', borderRadius:16, padding:'16px 12px' }}>
              <div style={{ marginBottom:6 }}>{s.icon}</div>
              <div style={{ fontFamily:F.display, fontSize:22, fontWeight:900, color:'#FFD700' }}>{s.value}</div>
              <div style={{ fontFamily:F.mono, fontSize:10, color:C.textDim, letterSpacing:1 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <button onClick={onContinue} style={{
          width:'100%', background:'linear-gradient(135deg, #FFD700, #fbbf24)',
          border:'none', borderBottom:'4px solid #a06000',
          borderRadius:16, padding:'16px', fontFamily:F.display,
          fontWeight:900, fontSize:18, color:'#0a0b0c', cursor:'pointer',
        }}>
          VER MEU CERTIFICADO →
        </button>
      </div>
    </div>
  );
}
