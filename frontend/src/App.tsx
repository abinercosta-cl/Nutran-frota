import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { DashboardPage } from '@/pages/DashboardPage';
import { VeiculosPage } from '@/pages/VeiculosPage';
import { SaidaPage } from '@/pages/SaidaPage';
import { CautelasPage } from '@/pages/CautelasPage';
import { OficinaPage } from '@/pages/OficinaPage';
import { OsPage } from '@/pages/OsPage';
import { AlertasPage } from '@/pages/AlertasPage';
import { ManutPage } from '@/pages/ManutPage';
import { SaldoPage } from '@/pages/SaldoPage';
import { UsuariosPage } from '@/pages/UsuariosPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/veiculos" element={<VeiculosPage />} />
          <Route path="/saida" element={<SaidaPage />} />
          <Route path="/cautelas" element={<CautelasPage />} />
          <Route path="/oficina" element={<OficinaPage />} />
          <Route path="/os" element={<OsPage />} />
          <Route path="/alertas" element={<AlertasPage />} />
          <Route path="/manut" element={<ManutPage />} />
          <Route path="/saldo" element={<SaldoPage />} />
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
