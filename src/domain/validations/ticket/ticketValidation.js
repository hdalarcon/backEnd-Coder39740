import z from 'zod';

const createTicketValidation = z.object({
    code: z.string(),
    purchaseDateTime: z.string(),
    amount: z.number(),
    purchaser: z.string()
});

export default createTicketValidation;
