import { z } from "@/config/zod-config";

export const loginSchema = z.object({
   email: z.string().email()
});

export type ILogin = z.infer<typeof loginSchema>;
