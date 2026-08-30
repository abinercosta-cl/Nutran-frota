import React from 'react';

export function ManutPage() {
  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Pedir Manutenção</h1>
          <p className="sub">Solicitações pendentes de aprovação</p>
        </div>
      </div>
      <div className="queue-card">
        <div className="left">
          <b>Viatura RVX-9F03 — Mitsubishi L200</b>
          <span>Solicitado por Ag. 2098 · troca de amortecedores traseiros · 27/08</span>
        </div>
        <div className="queue-actions">
          <button className="btn-approve" type="button">Aprovar</button>
          <button className="btn-deny" type="button">Recusar</button>
        </div>
      </div>
      <div className="queue-card">
        <div className="left">
          <b>Viatura TZK-4A17 — Fiat Toro</b>
          <span>Solicitado por Ag. 3382 · ruído no motor · 26/08</span>
        </div>
        <div className="queue-actions">
          <button className="btn-approve" type="button">Aprovar</button>
          <button className="btn-deny" type="button">Recusar</button>
        </div>
      </div>
    </section>
  );
}
