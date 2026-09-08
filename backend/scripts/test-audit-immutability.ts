import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import { eq, sql } from 'drizzle-orm';
import { db } from '../src/db/index.js';
import { auditLog } from '../src/db/schema.js';

async function testAuditImmutability() {
  console.log('🔒 Testando imutabilidade da tabela audit_log...');

  // 1. Testar INSERT
  console.log('1️⃣ Testando INSERT em audit_log...');
  let testId: string;
  try {
    const [inserted] = await db
      .insert(auditLog)
      .values({
        usuarioId: null,
        acao: 'teste_imutabilidade',
        entidade: 'sistema',
        entidadeId: 'validacao-trigger',
      })
      .returning();

    testId = inserted.id;
    console.log(`✅ INSERT bem-sucedido! Registro criado com ID: ${testId}`);
  } catch (error) {
    console.error('❌ Falha ao realizar INSERT em audit_log:', error);
    process.exit(1);
  }

  // 2. Testar UPDATE (deve falhar)
  console.log('2️⃣ Testando UPDATE em audit_log (espera-se bloqueio pela trigger)...');
  try {
    await db
      .update(auditLog)
      .set({ acao: 'acao_modificada_indevidamente' })
      .where(eq(auditLog.id, testId));

    console.error('❌ ERRO GRAVE: UPDATE em audit_log foi permitido! A trigger NÃO está ativa.');
    process.exit(1);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log('✅ UPDATE bloqueado com sucesso pelo PostgreSQL!');
    console.log(`   Mensagem de erro capturada: ${message.split('\n')[0]}`);
  }

  // 3. Testar DELETE (deve falhar)
  console.log('3️⃣ Testando DELETE em audit_log (espera-se bloqueio pela trigger)...');
  try {
    await db
      .delete(auditLog)
      .where(eq(auditLog.id, testId));

    console.error('❌ ERRO GRAVE: DELETE em audit_log foi permitido! A trigger NÃO está ativa.');
    process.exit(1);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.log('✅ DELETE bloqueado com sucesso pelo PostgreSQL!');
    console.log(`   Mensagem de erro capturada: ${message.split('\n')[0]}`);
  }

  console.log('\n🎉 SUCESSO: A tabela audit_log está 100% imutável no banco de dados Neon!');
  process.exit(0);
}

testAuditImmutability();
