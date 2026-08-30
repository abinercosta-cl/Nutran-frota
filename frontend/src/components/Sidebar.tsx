import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemData {
  href: string;
  icon: string;
  label: string;
  count?: number | string;
  warn?: boolean;
}

const navGroups: { title: string; items: NavItemData[] }[] = [
  {
    title: 'Operacional',
    items: [
      { href: '/', icon: '▣', label: 'Painel Geral' },
      { href: '/veiculos', icon: '🚓', label: 'Veículos' },
      { href: '/saida', icon: '↗', label: 'Registrar Saída VT' },
      { href: '/cautelas', icon: '🔏', label: 'Cautelas — VT' },
    ],
  },
  {
    title: 'Manutenção',
    items: [
      { href: '/oficina', icon: '🔧', label: 'Veículos em Oficina' },
      { href: '/os', icon: '🗎', label: 'Ordens de Serviço' },
      { href: '/alertas', icon: '⚠', label: 'Alertas', count: 0 },
      { href: '/manut', icon: '🛠', label: 'Pedir Manut.', count: 2, warn: true },
    ],
  },
  {
    title: 'Administração',
    items: [
      { href: '/usuarios', icon: '👤', label: 'Usuários' },
      { href: '/saldo', icon: '₿', label: 'Pedir Saldo', count: 0 },
    ],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      <div
        className={`overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="nav-group-label">{group.title}</div>
            {group.items.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={onClose}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="ic">{item.icon}</span>
                  <span className="label">{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`count ${item.warn ? 'warn' : ''}`}>
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}

        <div className="sidebar-footer">
          <div>
            <span className="dot">●</span> Conexão segura — TLS 1.3
          </div>
          <div>Banco: PostgreSQL (Neon)</div>
          <div>Última sincronização: há 2 min</div>
        </div>
      </aside>
    </>
  );
}
