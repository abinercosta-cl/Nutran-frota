import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.routes.js';
import { authMiddleware, requireRole } from './middlewares/auth.middleware.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rota de verificação de integridade
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'frota-pf-snm-backend',
  });
});

// Rotas de autenticação
app.use('/auth', authRouter);

// Rota de teste RBAC para administradores
app.get(
  '/admin/teste',
  authMiddleware,
  requireRole('admin'),
  (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Acesso restrito concedido: perfil administrador confirmado',
      user: req.user,
    });
  }
);

app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});

export default app;
