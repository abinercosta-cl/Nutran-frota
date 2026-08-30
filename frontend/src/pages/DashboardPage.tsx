import React from 'react';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';

export function DashboardPage() {
  const activities = [
    { time: '09:41', user: 'Agente 3382', action: 'registrou saída da', target: 'viatura NOB-4B21' },
    { time: '09:12', user: 'Oficina Central', action: 'abriu', target: 'OS #1187 — troca de pastilhas de freio' },
    { time: '08:57', user: 'Agente 4471', action: 'aprovou', target: 'pedido de saldo de combustível — R$ 300,00' },
    { time: '08:30', user: 'Sistema', action: 'gerou', target: 'alerta de vencimento de licenciamento — QND-2C10' },
    { time: '08:02', user: 'Agente 1029', action: 'devolveu', target: 'viatura sob cautela — sem avarias' },
  ];

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Painel Geral</h1>
          <p className="sub">Visão consolidada da frota — Superintendência Regional (SNM)</p>
        </div>
        <button className="btn ghost" type="button">
          ⟳ Atualizar
        </button>
      </div>

      <div className="stat-grid">
        <StatCard variant="blue" label="Frota total" number={38} icon="🚓" />
        <StatCard variant="ok" label="Em operação" number={27} icon="●" />
        <StatCard variant="warn" label="Em oficina" number={6} icon="🔧" />
        <StatCard variant="danger" label="Alertas ativos" number={0} icon="⚠" />
        <StatCard variant="gold" label="Pedidos pendentes" number={2} icon="🗎" />
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-head">
            <h3>Atividade recente (log de auditoria)</h3>
            <StatusBadge variant="info" text="ao vivo" />
          </div>
          <div className="panel-body">
            <ul className="activity">
              {activities.map((act, index) => (
                <li key={index}>
                  <span className="t">{act.time}</span>
                  <span className="d">
                    <b>{act.user}</b> {act.action} <span>{act.target}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Aviso</h3>
          </div>
          <div className="panel-body">
            <div className="empty-state" style={{ padding: '30px 10px' }}>
              <div className="ic">🛈</div>
              <b>Nenhum item selecionado</b>
              <p>Selecione um veículo, ordem de serviço ou pedido para visualizar detalhes aqui.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
