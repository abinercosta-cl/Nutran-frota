import React from 'react';

export default function AlertasPage() {
  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Alertas</h1>
          <p className="sub">Pendências que exigem atenção imediata</p>
        </div>
      </div>
      <div className="empty-state">
        <div className="ic">✅</div>
        <b>Nenhum alerta ativo no momento</b>
        <p>Quando um veículo apresentar licenciamento vencido, manutenção preventiva pendente ou quilometragem excedida, os alertas aparecerão aqui.</p>
        <span className="tag">exemplo de card de alerta abaixo</span>
      </div>
      <div className="alert-card warn">
        <div className="ic">⚠</div>
        <div className="body">
          <b>Licenciamento próximo do vencimento</b>
          <p>Viatura QND-2C10 — vencimento em 6 dias.</p>
          <div className="meta">gerado automaticamente · 08:30</div>
        </div>
      </div>
    </section>
  );
}
