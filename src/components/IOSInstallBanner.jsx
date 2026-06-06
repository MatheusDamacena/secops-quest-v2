// ─── iOS INSTALL BANNER ───────────────────────────────────────────────────────
// Aparece UMA VEZ no Safari iOS ensinando como instalar o PWA
// Não aparece: se já instalado (standalone), se já dispensado, se não for iOS Safari

import { useState, useEffect } from 'react';
import { FaTimes, FaShareSquare } from 'react-icons/fa';
import { C, F } from '../styles/tokens';

function isIOSSafari() {
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua);
  const isStandalone = window.navigator.standalone === true;
  const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);
  return isIOS && isSafari && !isStandalone;
}

export default function IOSInstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isIOSSafari()) return;
    const dismissed = localStorage.getItem('ios-install-dismissed');
    if (dismissed) return;
    // Mostrar após 3 segundos
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem('ios-install-dismissed', '1');
    setVisible(false);
  };

  return (
    <div style={{
      position: 'fixed', bottom: 80, left: 12, right: 12, zIndex: 9999,
      background: '#1c1e21',
      border: `1.5px solid ${C.cyan}`,
      borderRadius: 16,
      padding: '14px 16px',
      boxShadow: `0 4px 32px rgba(0,196,204,0.18)`,
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      {/* Ícone do app */}
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: '#0a0b0c', border: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <img src="/icon-192.png" alt="SecOps Quest" style={{ width: 48, height: 48 }} />
      </div>

      {/* Texto */}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: F.display, color: C.text, fontSize: 14, fontWeight: 800, marginBottom: 4 }}>
          Instalar SecOps Quest
        </div>
        <div style={{ fontFamily: F.mono, color: C.textDim, fontSize: 12, lineHeight: 1.6 }}>
          Toque em{' '}
          <FaShareSquare size={12} color={C.cyan} style={{ verticalAlign: 'middle', margin: '0 2px' }} />
          {' '}<span style={{ color: C.cyan }}>Compartilhar</span>
          {' '}e depois em{' '}
          <span style={{ color: C.cyan }}>"Adicionar à Tela de Início"</span>
        </div>
      </div>

      {/* Fechar */}
      <button onClick={dismiss} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: C.textDim, padding: 4, flexShrink: 0,
      }}>
        <FaTimes size={16} />
      </button>
    </div>
  );
}
