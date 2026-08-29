import React from 'react';

export default function SaidaPage() {
  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Registrar Saída de VT</h1>
          <p className="sub">Check-out de viatura com cadeia de custódia e assinatura digital</p>
        </div>
      </div>
      <div className="panel">
        <div className="panel-body">
          <div className="form-grid">
            <div className="field">
              <label>Viatura</label>
              <select defaultValue="NOB-4B21 — Chevrolet S10 4x4">
                <option>NOB-4B21 — Chevrolet S10 4x4</option>
                <option>PFB-1122 — Renault Duster</option>
              </select>
            </div>
            <div className="field">
              <label>Condutor</label>
              <select defaultValue="Ag. 3382 — Marcos T.">
                <option>Ag. 3382 — Marcos T.</option>
                <option>Ag. 4471 — você</option>
              </select>
            </div>
            <div className="field">
              <label>Km de saída</label>
              <input className="mono" placeholder="84210" inputMode="numeric" />
            </div>
            <div className="field">
              <label>Horário previsto de retorno</label>
              <input type="time" />
            </div>
            <div className="field full">
              <label>Destino / Missão</label>
              <input placeholder="Ex.: Diligência — Operação Fronteira Norte" />
            </div>
            <div className="field full">
              <label>Observações</label>
              <textarea rows={3} placeholder="Estado do veículo, nível de combustível, avarias existentes..." />
            </div>
          </div>
          <p className="hint" style={{ marginTop: '12px' }}>
            🔒 Este registro será assinado digitalmente com o certificado do usuário autenticado e vinculado ao log de auditoria — não editável após confirmação.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
            <button className="btn primary" type="button">Confirmar saída</button>
            <button className="btn ghost" type="button">Cancelar</button>
          </div>
        </div>
      </div>
    </section>
  );
}
