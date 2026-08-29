import React from 'react';
import { PlateBadge } from '@/components/PlateBadge';
import { StatusBadge, StatusVariant } from '@/components/StatusBadge';

export default function VeiculosPage() {
  const vehicles = [
    { plate: 'NOB4B21', model: 'Chevrolet S10 4x4', location: 'SNM — Sede', status: 'Em operação', variant: 'ok' as StatusVariant, km: '84.210 km', driver: 'Ag. 3382' },
    { plate: 'QND2C10', model: 'Toyota Hilux SW4', location: 'SNM — Sede', status: 'Licenc. venc.', variant: 'warn' as StatusVariant, km: '122.980 km', driver: '—' },
    { plate: 'PFB1122', model: 'Renault Duster', location: 'Núcleo Norte', status: 'Disponível', variant: 'neutral' as StatusVariant, km: '45.760 km', driver: '—' },
    { plate: 'RVX9F03', model: 'Mitsubishi L200', location: 'SNM — Sede', status: 'Em oficina', variant: 'danger' as StatusVariant, km: '201.340 km', driver: 'Oficina Central' },
    { plate: 'JQL7H88', model: 'Chevrolet Blazer', location: 'Núcleo Norte', status: 'Em operação', variant: 'ok' as StatusVariant, km: '63.005 km', driver: 'Ag. 1029' },
  ];

  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Veículos</h1>
          <p className="sub">Cadastro e situação atual da frota</p>
        </div>
        <button className="btn primary" type="button">+ Novo veículo</button>
      </div>

      <div className="toolbar">
        <div className="search">
          🔍 <input placeholder="Buscar por placa, modelo ou lotação..." />
        </div>
        <select className="filter" defaultValue="Todos os status">
          <option>Todos os status</option>
          <option>Disponível</option>
          <option>Em operação</option>
          <option>Em oficina</option>
          <option>Bloqueado</option>
        </select>
        <select className="filter" defaultValue="Toda lotação">
          <option>Toda lotação</option>
          <option>SNM — Sede</option>
          <option>DPF — Núcleo Norte</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Lotação</th>
              <th>Status</th>
              <th>Km atual</th>
              <th>Responsável</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.plate}>
                <td>
                  <PlateBadge plate={v.plate} />
                </td>
                <td>{v.model}</td>
                <td>{v.location}</td>
                <td>
                  <StatusBadge variant={v.variant} text={v.status} />
                </td>
                <td className="mono">{v.km}</td>
                <td>{v.driver}</td>
                <td className="row-actions">
                  <button title="Visualizar" type="button">👁</button>
                  <button title="Editar" type="button">✎</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
