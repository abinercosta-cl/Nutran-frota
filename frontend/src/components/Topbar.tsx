import React from 'react';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="hamburger"
          onClick={onToggleSidebar}
          aria-label="Abrir menu"
          type="button"
        >
          ☰
        </button>
        <div className="brand">
          <div className="brand-badge">PF</div>
          <div className="brand-text">
            <b>FROTA PF — SNM</b>
            <span>Superintendência · Gestão de Frota</span>
          </div>
        </div>
      </div>
      <div className="topbar-right">
        <button className="icon-btn" title="Sincronizar" type="button">
          ⟳
        </button>
        <button className="icon-btn" title="Notificações" type="button">
          🔔
        </button>
        <div className="user-chip">
          <div className="avatar">AG</div>
          <div className="meta">
            <b>Agente 4471</b>
            <span>Perfil: Gestor</span>
          </div>
        </div>
      </div>
    </header>
  );
}
