import dotenv from 'dotenv';
dotenv.config();

import { sql as drizzleSql } from 'drizzle-orm';
import { db } from './index.js';

async function checkConnection() {
  console.log('🔄 Testando conexão com o banco Neon PostgreSQL...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ ERRO: DATABASE_URL não está definida no ambiente (.env).');
    process.exit(1);
  }

  try {
    const result = await db.execute(drizzleSql`SELECT 1 as connected, NOW() as current_time`);
    console.log('✅ Conexão com o banco Neon estabelecida com sucesso!');
    console.log('📊 Resultado do teste:', result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
}

checkConnection();
