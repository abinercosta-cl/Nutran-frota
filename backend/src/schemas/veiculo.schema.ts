import { z } from 'zod';

// Padrão Mercosul (ex.: ABC1D23) ou antigo (ex.: ABC1234)
const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$|^[A-Z]{3}[0-9]{4}$/;

export const createVeiculoSchema = z.object({
  placa: z
    .string({ message: 'Placa é obrigatória' })
    .trim()
    .transform((val) => val.replace(/[^A-Za-z0-9]/g, '').toUpperCase())
    .pipe(
      z.string().regex(placaRegex, {
        message: 'Placa deve estar no formato Mercosul (ex: ABC1D23) ou formato antigo (ex: ABC1234)',
      })
    ),
  modelo: z
    .string({ message: 'Modelo é obrigatório' })
    .trim()
    .min(2, { message: 'Modelo deve ter no mínimo 2 caracteres' })
    .max(255, { message: 'Modelo não pode exceder 255 caracteres' }),
  lotacao: z
    .string({ message: 'Lotação é obrigatória' })
    .trim()
    .min(2, { message: 'Lotação deve ter no mínimo 2 caracteres' })
    .max(100, { message: 'Lotação não pode exceder 100 caracteres' }),
  status: z
    .enum(['disponivel', 'em_operacao', 'em_oficina', 'baixado'], {
      message: 'Status deve ser disponivel, em_operacao, em_oficina ou baixado',
    })
    .default('disponivel'),
  kmAtual: z
    .number({ message: 'Quilometragem atual deve ser um número' })
    .int({ message: 'Quilometragem deve ser um número inteiro' })
    .min(0, { message: 'Quilometragem não pode ser negativa' })
    .default(0),
});

export const updateVeiculoSchema = z.object({
  placa: z
    .string()
    .trim()
    .transform((val) => val.replace(/[^A-Za-z0-9]/g, '').toUpperCase())
    .pipe(
      z.string().regex(placaRegex, {
        message: 'Placa deve estar no formato Mercosul (ex: ABC1D23) ou formato antigo (ex: ABC1234)',
      })
    )
    .optional(),
  modelo: z
    .string()
    .trim()
    .min(2, { message: 'Modelo deve ter no mínimo 2 caracteres' })
    .max(255, { message: 'Modelo não pode exceder 255 caracteres' })
    .optional(),
  lotacao: z
    .string()
    .trim()
    .min(2, { message: 'Lotação deve ter no mínimo 2 caracteres' })
    .max(100, { message: 'Lotação não pode exceder 100 caracteres' })
    .optional(),
  status: z
    .enum(['disponivel', 'em_operacao', 'em_oficina', 'baixado'], {
      message: 'Status deve ser disponivel, em_operacao, em_oficina ou baixado',
    })
    .optional(),
  kmAtual: z
    .number({ message: 'Quilometragem atual deve ser um número' })
    .int({ message: 'Quilometragem deve ser um número inteiro' })
    .min(0, { message: 'Quilometragem não pode ser negativa' })
    .optional(),
});

export const queryVeiculosSchema = z.object({
  status: z.enum(['disponivel', 'em_operacao', 'em_oficina', 'baixado']).optional(),
  lotacao: z.string().trim().optional(),
  busca: z.string().trim().optional(),
});

export type CreateVeiculoDTO = z.infer<typeof createVeiculoSchema>;
export type UpdateVeiculoDTO = z.infer<typeof updateVeiculoSchema>;
export type QueryVeiculosDTO = z.infer<typeof queryVeiculosSchema>;
