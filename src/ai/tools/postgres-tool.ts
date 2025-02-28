import { tool } from 'ai'
import z from 'zod'
import { pg } from '../../drizzle/client'

export const postgresTool = tool({
  description: `
        Realiza uma query no Postgres para buscar informações sobre as tabelas no bando de dados.

        Só pode realizar operações com busca (SELECT), não é permitido a geração de qualquer operação de escrita.

        Tables:
        """
        CREATE TABLE subscriptions (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
            name text NOT NULL,
            email text NOT NULL,
            created_at timestamp with time zone DEFAULT now() NOT NULL,
        )
        """

        Todas operações devem retornar um máximo de 50 itens.
    `.trim(),
  parameters: z.object({
    query: z.string().describe('A query do Postgres para ser executada.'),
    params: z
      .array(z.string())
      .describe('Parâmetros da query a ser executada.'),
  }),
  execute: async ({ query, params }) => {
    console.log({ query, params })

    const result = await pg.unsafe(query, params)

    return JSON.stringify(result)
  },
})
