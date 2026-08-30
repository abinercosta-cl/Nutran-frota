import React from 'react';

export function SaldoPage() {
  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Pedir Saldo</h1>
          <p className="sub">Solicitações de saldo de combustível / manutenção</p>
        </div>
      </div>
      <div className="empty-state">
        <div className="ic">🗎</div>
        <b>Nenhuma solicitação pendente</b>
        <p>Novas solicitações de saldo enviadas pelos condutores aparecerão aqui para aprovação.</p>
      </div>
    </section>
  );
}
