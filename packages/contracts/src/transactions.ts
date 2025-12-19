import { z } from 'zod'

export const transactionSchema = z.object({
    amount: z.number(),
    type: z.string(),
})
