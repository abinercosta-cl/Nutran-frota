import { eq, ilike, or, and, asc, type SQL } from 'drizzle-orm';
import { db } from '../db/index.js';
import { veiculos, auditLog, type Veiculo } from '../db/schema.js';
import type { CreateVeiculoDTO, UpdateVeiculoDTO, QueryVeiculosDTO } from '../schemas/veiculo.schema.js';

export async function listarVeiculos(filtros: QueryVeiculosDTO = {}): Promise<Veiculo[]> {
  const conditions: SQL[] = [];

  if (filtros.status) {
    conditions.push(eq(veiculos.status, filtros.status));
  }

  if (filtros.lotacao) {
    conditions.push(ilike(veiculos.lotacao, `%${filtros.lotacao}%`));
  }

  if (filtros.busca) {
    const searchPattern = `%${filtros.busca}%`;
    const searchCondition = or(
      ilike(veiculos.placa, searchPattern),
      ilike(veiculos.modelo, searchPattern)
    );
    if (searchCondition) {
      conditions.push(searchCondition);
    }
  }

  if (conditions.length > 0) {
    return await db
      .select()
      .from(veiculos)
      .where(and(...conditions))
      .orderBy(asc(veiculos.placa));
  }

  return await db
    .select()
    .from(veiculos)
    .orderBy(asc(veiculos.placa));
}

export async function buscarVeiculoPorId(id: string): Promise<Veiculo | null> {
  const [veiculo] = await db
    .select()
    .from(veiculos)
    .where(eq(veiculos.id, id))
    .limit(1);

  return veiculo || null;
}

export async function criarVeiculo(dados: CreateVeiculoDTO, usuarioId: string): Promise<Veiculo> {
  // Verifica unicidade de placa
  const [existente] = await db
    .select()
    .from(veiculos)
    .where(eq(veiculos.placa, dados.placa))
    .limit(1);

  if (existente) {
    throw new Error(`Veículo com a placa ${dados.placa} já está cadastrado`);
  }

  const [novoVeiculo] = await db
    .insert(veiculos)
    .values({
      placa: dados.placa,
      modelo: dados.modelo,
      lotacao: dados.lotacao,
      status: dados.status,
      kmAtual: dados.kmAtual,
    })
    .returning();

  // Registro obrigatório no audit_log
  await db.insert(auditLog).values({
    usuarioId,
    acao: 'CRIAR_VEICULO',
    entidade: 'veiculos',
    entidadeId: novoVeiculo.id,
  });

  return novoVeiculo;
}

export async function atualizarVeiculo(
  id: string,
  dados: UpdateVeiculoDTO,
  usuarioId: string
): Promise<Veiculo> {
  const [veiculo] = await db
    .select()
    .from(veiculos)
    .where(eq(veiculos.id, id))
    .limit(1);

  if (!veiculo) {
    throw new Error('Veículo não encontrado');
  }

  // Se placa foi fornecida e é diferente da atual, verifica unicidade
  if (dados.placa && dados.placa !== veiculo.placa) {
    const [placaEmUso] = await db
      .select()
      .from(veiculos)
      .where(eq(veiculos.placa, dados.placa))
      .limit(1);

    if (placaEmUso) {
      throw new Error(`A nova placa ${dados.placa} já está em uso por outro veículo`);
    }
  }

  const [veiculoAtualizado] = await db
    .update(veiculos)
    .set(dados)
    .where(eq(veiculos.id, id))
    .returning();

  // Registro obrigatório no audit_log
  await db.insert(auditLog).values({
    usuarioId,
    acao: 'ATUALIZAR_VEICULO',
    entidade: 'veiculos',
    entidadeId: id,
  });

  return veiculoAtualizado;
}

export async function desativarVeiculo(id: string, usuarioId: string): Promise<Veiculo> {
  const [veiculo] = await db
    .select()
    .from(veiculos)
    .where(eq(veiculos.id, id))
    .limit(1);

  if (!veiculo) {
    throw new Error('Veículo não encontrado');
  }

  // Soft delete / baixa do veículo
  const [veiculoBaixado] = await db
    .update(veiculos)
    .set({ status: 'baixado' })
    .where(eq(veiculos.id, id))
    .returning();

  // Registro obrigatório no audit_log
  await db.insert(auditLog).values({
    usuarioId,
    acao: 'BAIXAR_VEICULO',
    entidade: 'veiculos',
    entidadeId: id,
  });

  return veiculoBaixado;
}
