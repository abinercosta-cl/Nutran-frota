import React from 'react';
import { PlateBadge } from '@/components/PlateBadge';
import { StatusBadge } from '@/components/StatusBadge';

export function OficinaPage() {
  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Veículos em Oficina</h1>
          <p className="sub">Viaturas atualmente fora de operação para manutenção</p>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Placa</th>
              <th>Modelo</th>
              <th>OS vinculada</th>
              <th>Oficina</th>
              <th>Entrada</th>
              <th>Previsão</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><PlateBadge plate="RVX9F03" /></td>
              <td>Mitsubishi L200</td>
              <td className="mono">#1187</td>
              <td>Oficina Central</td>
              <td className="mono">24/08</td>
              <td className="mono">02/09</td>
              <td><StatusBadge variant="warn" text="Em andamento" /></td>
            </tr>
            <tr>
              <td><PlateBadge plate="TZK4A17" /></td>
              <td>Fiat Toro</td>
              <td className="mono">#1183</td>
              <td>Oficina Credenciada 02</td>
              <td className="mono">21/08</td>
              <td className="mono">30/08</td>
              <td><StatusBadge variant="danger" text="Aguard. peça" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
