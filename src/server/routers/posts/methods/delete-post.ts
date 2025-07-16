import { z } from "@/config/zod-config";
import { procedures } from "@/server/config/trpc";
import { TRPCError } from "@trpc/server";
import { postRepository } from "../repository";

export const deletePost = procedures.protected.input(z.object({ id: z.number() })).mutation(async ({ input, ctx }) => {
   if (!ctx.session) {
      throw new TRPCError({
         code: "UNAUTHORIZED",
         message: "Você precisa estar logado para deletar um post"
      });
   }

   try {
      const deletedPost = await postRepository.delete(input.id, ctx.session.id);

      if (!deletedPost) {
         throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post não encontrado"
         });
      }

      return { success: true };
   } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
         throw new TRPCError({
            code: "FORBIDDEN",
            message: "Você só pode deletar seus próprios posts"
         });
      }
      throw error;
   }
});
