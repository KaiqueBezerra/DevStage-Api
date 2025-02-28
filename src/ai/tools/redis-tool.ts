import { tool } from 'ai'
import z from 'zod'
import { redis } from '../../redis/client'

export const redisTool = tool({
  description: `
        Realiza um comando no Redis para buscar informações sobre o sistema de indicações como número de cliques no link, números de indicações (convites) realizados e rankin de indicações.

        Só pode ser utilizado para buscar dados do Redis, não pode executar nenhum comando de escrita.

        - Um hash chamado "referra:access-count" que guarda o número de cliques/acessos no link de convite/indicação de cada usuário no formato { "SUBSCRIBER_ID": NUMERO_DE_CLIQUES } onde o SUBSCRIBER_ID vem do postgres.
        - Um zset chamado "referral:ranking" que guarda o total de convites/indicações fetios por cada usuário onde o score é a quantidade de convites e o conteúdo é o SUBSCRIBER_ID que vem do POstgres.
        `.trim(),
  parameters: z.object({
    command: z
      .string()
      .describe('O comando ser executado no Redis como GET, HGET, ZREVRANGE.'),
    args: z
      .array(z.string())
      .describe('Argumentos que vem logo após o comando do Redis.'),
  }),
  execute: async ({ command, args }) => {
    console.log({ command, args })

    const result = await redis.call(command, args)

    return JSON.stringify(result)
  },
})
