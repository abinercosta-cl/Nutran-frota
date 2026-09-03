import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import argon2 from 'argon2';
import { eq } from 'drizzle-orm';
import { db } from '../src/db/index.js';
import { usuarios, auditLog } from '../src/db/schema.js';

async function seedAdmin() {
  console.log('🌱 Iniciando seed de usuário administrador...');

  const matricula = process.env.SEED_ADMIN_MATRICULA;
  const senha = process.env.SEED_ADMIN_SENHA;
  const nome = process.env.SEED_ADMIN_NOME || 'Administrador Inicial';
  const lotacao = process.env.SEED_ADMIN_LOTACAO || 'SNM — Sede';

  if (!matricula || !senha) {
    console.error('❌ ERRO: Variáveis SEED_ADMIN_MATRICULA e SEED_ADMIN_SENHA são obrigatórias.');
    console.error('Defina-as no arquivo .env antes de executar o seed.');
    process.exit(1);
  }

  try {
    // Verifica se já existe usuário com essa matrícula
    const [existingUser] = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.matricula, matricula))
      .limit(1);

    if (existingUser) {
      console.log(`⚠️ Usuário com a matrícula ${matricula} já existe no banco. Operação cancelada para evitar sobreposição.`);
      process.exit(0);
    }

    // Gera hash da senha com argon2
    const senhaHash = await argon2.hash(senha, {
      type: argon2.argon2id,
    });

    // Insere novo usuário administrador
    const [newUser] = await db
      .insert(usuarios)
      .values({
        matricula,
        nome,
        senhaHash,
        perfil: 'admin',
        lotacao,
        ativo: true,
      })
      .returning();

    // Registra criação em audit_log
    await db.insert(auditLog).values({
      usuarioId: newUser.id,
      acao: 'usuario_criado',
      entidade: 'usuarios',
      entidadeId: newUser.id,
    });

    console.log(`✅ Usuário administrador criado com sucesso! (ID: ${newUser.id}, Matrícula: ${newUser.matricula}, Perfil: ${newUser.perfil})`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante o seed do administrador:', error);
    process.exit(1);
  }
}

seedAdmin();
