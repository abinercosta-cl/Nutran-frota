import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { eq, and, gt } from 'drizzle-orm';
import { db } from '../db/index.js';
import { usuarios, refreshTokens, auditLog } from '../db/schema.js';

export interface JwtPayload {
  sub: string;
  matricula: string;
  perfil: 'admin' | 'gestor' | 'motorista';
  lotacao: string;
}

export interface UserPublicData {
  id: string;
  matricula: string;
  nome: string;
  perfil: 'admin' | 'gestor' | 'motorista';
  lotacao: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  usuario: UserPublicData;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production-long-key';
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_DAYS = 7;

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

function hashRefreshToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function login(matricula: string, senha: string):Promise<LoginResult> {
  // Busca usuário pela matrícula
  const [user] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.matricula, matricula))
    .limit(1);

  if (!user || !user.ativo) {
    // Grava falha em audit_log sem usuarioId se não encontrado
    await db.insert(auditLog).values({
      usuarioId: null,
      acao: 'login_falha',
      entidade: 'usuarios',
      entidadeId: matricula,
    });
    throw new Error('Credenciais inválidas');
  }

  const isPasswordValid = await verifyPassword(senha, user.senhaHash);

  if (!isPasswordValid) {
    // Grava falha em audit_log com usuarioId do usuário identificado
    await db.insert(auditLog).values({
      usuarioId: user.id,
      acao: 'login_falha',
      entidade: 'usuarios',
      entidadeId: user.id,
    });
    throw new Error('Credenciais inválidas');
  }

  // Gera tokens
  const payload: JwtPayload = {
    sub: user.id,
    matricula: user.matricula,
    perfil: user.perfil,
    lotacao: user.lotacao,
  };

  const accessToken = generateAccessToken(payload);

  // Gera refresh token opaco criptograficamente seguro
  const rawRefreshToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashRefreshToken(rawRefreshToken);
  const expiraEm = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

  // Armazena hash do refresh token
  await db.insert(refreshTokens).values({
    usuarioId: user.id,
    tokenHash,
    expiraEm,
    revogado: false,
  });

  // Grava sucesso no audit_log
  await db.insert(auditLog).values({
    usuarioId: user.id,
    acao: 'login_sucesso',
    entidade: 'usuarios',
    entidadeId: user.id,
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    usuario: {
      id: user.id,
      matricula: user.matricula,
      nome: user.nome,
      perfil: user.perfil,
      lotacao: user.lotacao,
    },
  };
}

export async function refresh(rawRefreshToken: string): Promise<RefreshResult> {
  if (!rawRefreshToken) {
    throw new Error('Refresh token não fornecido');
  }

  const tokenHash = hashRefreshToken(rawRefreshToken);
  const now = new Date();

  // Busca refresh token ativo e não expirado
  const [tokenRecord] = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.tokenHash, tokenHash),
        eq(refreshTokens.revogado, false),
        gt(refreshTokens.expiraEm, now)
      )
    )
    .limit(1);

  if (!tokenRecord) {
    throw new Error('Refresh token inválido ou expirado');
  }

  // Invalida o refresh token antigo (rotação)
  await db
    .update(refreshTokens)
    .set({ revogado: true })
    .where(eq(refreshTokens.id, tokenRecord.id));

  // Busca dados atualizados do usuário
  const [user] = await db
    .select()
    .from(usuarios)
    .where(eq(usuarios.id, tokenRecord.usuarioId))
    .limit(1);

  if (!user || !user.ativo) {
    throw new Error('Usuário inativo ou inexistente');
  }

  // Emite novo par de tokens
  const payload: JwtPayload = {
    sub: user.id,
    matricula: user.matricula,
    perfil: user.perfil,
    lotacao: user.lotacao,
  };

  const newAccessToken = generateAccessToken(payload);
  const newRawRefreshToken = crypto.randomBytes(32).toString('hex');
  const newTokenHash = hashRefreshToken(newRawRefreshToken);
  const newExpiraEm = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);

  await db.insert(refreshTokens).values({
    usuarioId: user.id,
    tokenHash: newTokenHash,
    expiraEm: newExpiraEm,
    revogado: false,
  });

  // Grava auditoria de rotação
  await db.insert(auditLog).values({
    usuarioId: user.id,
    acao: 'token_refresh',
    entidade: 'usuarios',
    entidadeId: user.id,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRawRefreshToken,
  };
}

export async function logout(rawRefreshToken?: string, userId?: string): Promise<void> {
  let affectedUserId = userId;

  if (rawRefreshToken) {
    const tokenHash = hashRefreshToken(rawRefreshToken);
    const [tokenRecord] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.tokenHash, tokenHash))
      .limit(1);

    if (tokenRecord) {
      affectedUserId = tokenRecord.usuarioId;
      await db
        .update(refreshTokens)
        .set({ revogado: true })
        .where(eq(refreshTokens.id, tokenRecord.id));
    }
  }

  // Grava auditoria de logout
  await db.insert(auditLog).values({
    usuarioId: affectedUserId ?? null,
    acao: 'logout',
    entidade: 'usuarios',
    entidadeId: affectedUserId ?? 'desconhecido',
  });
}
