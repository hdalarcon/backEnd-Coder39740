import z from 'zod';

const userCreateValidation = z.object({
  firstName: z.string().min(5).max(35),
  lastName: z.string().min(5).max(35),
  email: z.string().email(),
  age: z.number(),
  password: z.string(),
  isAdmin: z.boolean().optional(),
  lastConnection: z.date().optional(),
  terminal: z.boolean().optional()
});

export default userCreateValidation;