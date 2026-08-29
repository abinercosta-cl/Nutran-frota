import React from 'react';
import { StatusBadge } from '@/components/StatusBadge';

export default function UsuariosPage() {
  return (
    <section>
      <div className="page-head">
        <div>
          <h1>Usuários</h1>
          <p className="sub">Perfis de acesso e permissões (RBAC)</p>
        </div>
        <button className="btn primary" type="button">+ Novo usuário</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Nome</th>
              <th>Perfil</th>
              <th>Lotação</th>
              <th>Último acesso</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono">4471</td>
              <td>Agente 4471</td>
              <td><StatusBadge variant="info" text="Gestor" /></td>
              <td>SNM — Sede</td>
              <td className="mono">hoje, 09:41</td>
              <td><StatusBadge variant="ok" text="Ativo" /></td>
            </tr>
            <tr>
              <td className="mono">3382</td>
              <td>Marcos T.</td>
              <td><StatusBadge variant="neutral" text="Motorista" /></td>
              <td>SNM — Sede</td>
              <td className="mono">hoje, 09:12</td>
              <td><StatusBadge variant="ok" text="Ativo" /></td>
            </tr>
            <tr>
              <td className="mono">1029</td>
              <td>Cláudia R.</td>
              <td><StatusBadge variant="neutral" text="Motorista" /></td>
              <td>Núcleo Norte</td>
              <td className="mono">ontem, 17:30</td>
              <td><StatusBadge variant="ok" text="Ativo" /></td>
            </tr>
            <tr>
              <td className="mono">0087</td>
              <td>Administrador Sistema</td>
              <td><StatusBadge variant="warn" text="Admin" /></td>
              <td>SNM — Sede</td>
              <td className="mono">22/08</td>
              <td><StatusBadge variant="danger" text="Suspenso" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
