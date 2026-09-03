import { Router, Request, Response } from 'express';
import { login, refresh, logout } from '../services/auth.service.js';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';

export const authRouter = Router();

// POST /auth/login
authRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { matricula, senha } = req.body;

  if (!matricula || !senha) {
    res.status(400).json({ error: 'Matrícula e senha são obrigatórias' });
    return;
  }

  try {
    const result = await login(matricula, senha);
    res.status(200).json(result);
  } catch (error) {
    // Erro genérico para evitar enumeração de usuários
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

// POST /auth/refresh
authRouter.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ error: 'Refresh token é obrigatório' });
    return;
  }

  try {
    const result = await refresh(refreshToken);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: 'Refresh token inválido ou expirado' });
  }
});

// POST /auth/logout
authRouter.post('/logout', async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;
  const userId = req.user?.id;

  try {
    await logout(refreshToken, userId);
    res.status(200).json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar logout' });
  }
});

// GET /auth/me (perfil autenticado)
authRouter.get('/me', authMiddleware, (req: Request, res: Response): void => {
  res.status(200).json({ user: req.user });
});

// GET /admin/teste (rota protegida por RBAC exclusiva para admin)
authRouter.get(
  '/admin/teste',
  authMiddleware,
  requireRole('admin'),
  (req: Request, res: Response): void => {
    res.status(200).json({
      message: 'Acesso restrito concedido: perfil administrador confirmado',
      user: req.user,
    });
  }
);
