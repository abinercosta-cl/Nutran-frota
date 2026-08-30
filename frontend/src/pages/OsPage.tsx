import React from 'react';
import { PlateBadge } from '@/components/PlateBadge';
import { StatusBadge } from '@/components/StatusBadge';

export function OsPage() {
  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Ordens de Serviço</h1>
          <p className="sub">Histórico e acompanhamento de manutenções</p>
        </div>
        <button className="btn primary" type="button">+ Nova OS</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>OS</th>
              <th>Placa</th>
              <th>Serviço</th>
              <th>Oficina</th>
              <th>Aberta em</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono">#1187</td>
              <td><PlateBadge plate="RVX9F03" /></td>
              <td>Troca de pastilhas de freio</td>
              <td>Oficina Central</td>
              <td className="mono">24/08</td>
              <td><StatusBadge variant="warn" text="Em andamento" /></td>
            </tr>
            <tr>
              <td className="mono">#1183</td>
              <td><PlateBadge plate="TZK4A17" /></td>
              <td>Revisão de suspensão</td>
              <td>Oficina Credenciada 02</td>
              <td className="mono">21/08</td>
              <td><StatusBadge variant="danger" text="Aguard. peça" /></td>
            </tr>
            <tr>
              <td className="mono">#1176</td>
              <td><PlateBadge plate="NOB4B21" /></td>
              <td>Troca de óleo e filtros</td>
              <td>Oficina Central</td>
              <td className="mono">14/08</td>
              <td><StatusBadge variant="ok" text="Concluída" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
