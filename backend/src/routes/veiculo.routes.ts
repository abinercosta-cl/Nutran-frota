import { Router, Request, Response } from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth.middleware.js';
import {
  createVeiculoSchema,
  updateVeiculoSchema,
  queryVeiculosSchema,
} from '../schemas/veiculo.schema.js';
import {
  listarVeiculos,
  buscarVeiculoPorId,
  criarVeiculo,
  atualizarVeiculo,
  desativarVeiculo,
} from '../services/veiculo.service.js';

export const veiculoRouter = Router();

// Todas as rotas de veículos exigem usuário autenticado
veiculoRouter.use(authMiddleware);

// GET /veiculos - listagem com filtros (acesso: admin, gestor, motorista)
veiculoRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  const queryResult = queryVeiculosSchema.safeParse(req.query);

  if (!queryResult.success) {
    res.status(400).json({
      error: 'Parâmetros de consulta inválidos',
      detalhes: queryResult.error.format(),
    });
    return;
  }

  try {
    const veiculos = await listarVeiculos(queryResult.data);
    res.status(200).json(veiculos);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao listar veículos';
    res.status(500).json({ error: message });
  }
});

// GET /veiculos/:id - detalhe de um veículo (acesso: admin, gestor, motorista)
veiculoRouter.get('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const veiculo = await buscarVeiculoPorId(id);
    if (!veiculo) {
      res.status(404).json({ error: 'Veículo não encontrado' });
      return;
    }
    res.status(200).json(veiculo);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar veículo';
    res.status(500).json({ error: message });
  }
});

// POST /veiculos - cadastrar novo veículo (acesso: admin, gestor)
veiculoRouter.post(
  '/',
  requireRole('admin', 'gestor'),
  async (req: Request, res: Response): Promise<void> => {
    const parseResult = createVeiculoSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: 'Dados do veículo inválidos',
        detalhes: parseResult.error.format(),
      });
      return;
    }

    try {
      const novoVeiculo = await criarVeiculo(parseResult.data, req.user!.id);
      res.status(201).json(novoVeiculo);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar veículo';
      res.status(400).json({ error: message });
    }
  }
);

// PUT /veiculos/:id - atualizar veículo (acesso: admin, gestor)
veiculoRouter.put(
  '/:id',
  requireRole('admin', 'gestor'),
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const parseResult = updateVeiculoSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        error: 'Dados de atualização inválidos',
        detalhes: parseResult.error.format(),
      });
      return;
    }

    try {
      const veiculoAtualizado = await atualizarVeiculo(id, parseResult.data, req.user!.id);
      res.status(200).json(veiculoAtualizado);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar veículo';
      if (message === 'Veículo não encontrado') {
        res.status(404).json({ error: message });
        return;
      }
      res.status(400).json({ error: message });
    }
  }
);

// DELETE /veiculos/:id - baixar/desativar veículo (acesso restrito: admin)
veiculoRouter.delete(
  '/:id',
  requireRole('admin'),
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const veiculoBaixado = await desativarVeiculo(id, req.user!.id);
      res.status(200).json({
        message: 'Veículo baixado com sucesso',
        veiculo: veiculoBaixado,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao baixar veículo';
      if (message === 'Veículo não encontrado') {
        res.status(404).json({ error: message });
        return;
      }
      res.status(400).json({ error: message });
    }
  }
);
