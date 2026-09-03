import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../services/auth.service.js';

export type PerfilUsuario = 'admin' | 'gestor' | 'motorista';

export interface AuthenticatedUser {
  id: string;
  matricula: string;
  perfil: PerfilUsuario;
  lotacao: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticação não fornecido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      matricula: payload.matricula,
      perfil: payload.perfil,
      lotacao: payload.lotacao,
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

export function requireRole(...allowedRoles: PerfilUsuario[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Usuário não autenticado' });
      return;
    }

    if (!allowedRoles.includes(req.user.perfil)) {
      res.status(403).json({
        error: 'Acesso não autorizado para o perfil do usuário',
        perfilNecessario: allowedRoles,
      });
      return;
    }

    next();
  };
}
