import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import express from 'express';
import { eq, desc } from 'drizzle-orm';
import { db } from '../src/db/index.js';
import { auditLog } from '../src/db/schema.js';
import { veiculoRouter } from '../src/routes/veiculo.routes.js';
import { generateAccessToken } from '../src/services/auth.service.js';

async function runTests() {
  console.log('🧪 Iniciando testes de validação do CRUD de Veículos...');

  const app = express();
  app.use(express.json());
  app.use('/veiculos', veiculoRouter);

  const port = 3098;
  const server = app.listen(port);
  const baseUrl = `http://localhost:${port}/veiculos`;

  // Tokens para testes
  const adminId = 'c5c16014-2d1b-4d7b-93dc-11ad549defa5'; // ID do admin no Neon
  const adminToken = generateAccessToken({
    sub: adminId,
    matricula: '14112004',
    perfil: 'admin',
    lotacao: 'SNM — Sede',
  });

  const motoristaToken = generateAccessToken({
    sub: 'a1b2c3d4-0000-0000-0000-000000000001',
    matricula: '9999',
    perfil: 'motorista',
    lotacao: 'SNM — Sede',
  });

  // Placa fictícia única para teste (padrão Mercosul)
  const randomSuffix = Math.floor(10 + Math.random() * 89);
  const testPlaca = `TST9A${randomSuffix}`;

  try {
    // 1. Tentar criar sem token -> 401
    console.log('\n1️⃣ Testando POST /veiculos sem token (espera-se 401)...');
    const resNoToken = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        placa: testPlaca,
        modelo: 'Viatura Teste S10',
        lotacao: 'SNM — Sede',
      }),
    });
    console.log(`   Status: ${resNoToken.status} (esperado 401)`);
    if (resNoToken.status !== 401) throw new Error('Esperava status 401 sem token');

    // 2. Tentar criar com perfil motorista -> 403
    console.log('\n2️⃣ Testando POST /veiculos com perfil motorista (espera-se 403)...');
    const resMotorista = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${motoristaToken}`,
      },
      body: JSON.stringify({
        placa: testPlaca,
        modelo: 'Viatura Teste S10',
        lotacao: 'SNM — Sede',
      }),
    });
    console.log(`   Status: ${resMotorista.status} (esperado 403)`);
    if (resMotorista.status !== 403) throw new Error('Esperava status 403 para motorista');

    // 3. Criar com perfil admin -> 201
    console.log('\n3️⃣ Testando POST /veiculos com perfil admin (espera-se 201)...');
    const resAdmin = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        placa: testPlaca,
        modelo: 'Toyota Hilux 4x4 Fictícia',
        lotacao: 'SNM — Sede',
        status: 'disponivel',
        kmAtual: 15400,
      }),
    });
    const createdData = (await resAdmin.json()) as { id: string; placa: string; modelo: string };
    console.log(`   Status: ${resAdmin.status} (esperado 201)`);
    console.log(`   Veículo criado: ID=${createdData.id}, Placa=${createdData.placa}`);
    if (resAdmin.status !== 201) throw new Error('Esperava status 201 na criação');

    const veiculoId = createdData.id;

    // 4. Testar validação de duplicidade de placa -> 400
    console.log('\n4️⃣ Testando duplicidade de placa (espera-se 400)...');
    const resDuplicado = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        placa: testPlaca,
        modelo: 'Outro Modelo',
        lotacao: 'SNM — Sede',
      }),
    });
    console.log(`   Status: ${resDuplicado.status} (esperado 400)`);
    if (resDuplicado.status !== 400) throw new Error('Esperava status 400 para placa duplicada');

    // 5. Listar veículos -> 200
    console.log('\n5️⃣ Testando GET /veiculos com filtro de busca (espera-se 200)...');
    const resList = await fetch(`${baseUrl}?busca=${testPlaca}`, {
      headers: { Authorization: `Bearer ${motoristaToken}` },
    });
    const listData = (await resList.json()) as Array<{ id: string; placa: string }>;
    console.log(`   Status: ${resList.status}, Itens encontrados: ${listData.length}`);
    if (!listData.some((v) => v.id === veiculoId)) throw new Error('Veículo criado não retornado na listagem');

    // 6. Buscar veículo por ID -> 200
    console.log(`\n6️⃣ Testando GET /veiculos/${veiculoId} (espera-se 200)...`);
    const resGetId = await fetch(`${baseUrl}/${veiculoId}`, {
      headers: { Authorization: `Bearer ${motoristaToken}` },
    });
    console.log(`   Status: ${resGetId.status} (esperado 200)`);
    if (resGetId.status !== 200) throw new Error('Esperava status 200 na busca por ID');

    // 7. Atualizar veículo -> 200
    console.log(`\n7️⃣ Testando PUT /veiculos/${veiculoId} (espera-se 200)...`);
    const resUpdate = await fetch(`${baseUrl}/${veiculoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        kmAtual: 16200,
        modelo: 'Toyota Hilux 4x4 Fictícia Blindada',
      }),
    });
    const updatedData = (await resUpdate.json()) as { kmAtual: number; modelo: string };
    console.log(`   Status: ${resUpdate.status}, Novo Km: ${updatedData.kmAtual}`);
    if (updatedData.kmAtual !== 16200) throw new Error('Falha ao atualizar kmAtual');

    // 8. Baixar veículo -> 200
    console.log(`\n8️⃣ Testando DELETE /veiculos/${veiculoId} com perfil admin (espera-se 200)...`);
    const resDelete = await fetch(`${baseUrl}/${veiculoId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const deleteData = (await resDelete.json()) as { veiculo: { status: string } };
    console.log(`   Status: ${resDelete.status}, Novo status: ${deleteData.veiculo.status}`);
    if (deleteData.veiculo.status !== 'baixado') throw new Error('Status não alterado para baixado');

    // 9. Verificar gravação obrigatória em audit_log
    console.log('\n9️⃣ Verificando registros no audit_log...');
    const auditLogs = await db
      .select()
      .from(auditLog)
      .where(eq(auditLog.entidadeId, veiculoId))
      .orderBy(desc(auditLog.criadoEm));

    console.log(`   Eventos de auditoria encontrados para o veículo ${veiculoId}:`);
    auditLogs.forEach((log) => {
      console.log(`   - Ação: ${log.acao} | Entidade: ${log.entidade} | Usuário: ${log.usuarioId} | Data: ${log.criadoEm.toISOString()}`);
    });

    const acoes = auditLogs.map((l) => l.acao);
    if (!acoes.includes('CRIAR_VEICULO') || !acoes.includes('ATUALIZAR_VEICULO') || !acoes.includes('BAIXAR_VEICULO')) {
      throw new Error('Nem todas as ações sensíveis foram registradas no audit_log!');
    }

    console.log('\n🎉 TODOS OS TESTES DO CRUD DE VEÍCULOS FORAM APROVADOS COM SUCESSO!');
  } finally {
    server.close();
  }
}

runTests().catch((err: unknown) => {
  console.error('❌ Erro durante os testes:', err);
  process.exit(1);
});
