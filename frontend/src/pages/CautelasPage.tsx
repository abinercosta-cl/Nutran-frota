import React from 'react';
import { PlateBadge } from '@/components/PlateBadge';
import { StatusBadge } from '@/components/StatusBadge';

export function CautelasPage() {
  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Cautelas — VT</h1>
          <p className="sub">Responsabilidade e cadeia de custódia das viaturas</p>
        </div>
        <button className="btn primary" type="button">+ Nova cautela</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Placa</th>
              <th>Responsável</th>
              <th>Início</th>
              <th>Previsão devolução</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><PlateBadge plate="NOB4B21" /></td>
              <td>Ag. 3382 — Marcos T.</td>
              <td className="mono">29/08 09:41</td>
              <td className="mono">29/08 18:00</td>
              <td><StatusBadge variant="ok" text="Ativa" /></td>
              <td className="row-actions"><button title="Devolver" type="button">↩</button></td>
            </tr>
            <tr>
              <td><PlateBadge plate="JQL7H88" /></td>
              <td>Ag. 1029 — Cláudia R.</td>
              <td className="mono">28/08 08:02</td>
              <td className="mono">28/08 17:30</td>
              <td><StatusBadge variant="neutral" text="Encerrada" /></td>
              <td className="row-actions"><button title="Detalhes" type="button">👁</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
