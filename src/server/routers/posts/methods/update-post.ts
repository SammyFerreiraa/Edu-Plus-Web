import { updatePostSchema } from "@/common/schemas/post";
import { procedures } from "@/server/config/trpc";
import { TRPCError } from "@trpc/server";
import { postRepository } from "../repository";

export const updatePost = procedures.protected.input(updatePostSchema).mutation(async ({ input, ctx }) => {
   if (!ctx.session) {
      throw new TRPCError({
         code: "UNAUTHORIZED",
         message: "Você precisa estar logado para atualizar um post"
      });
   }

   try {
      const { id, ...data } = input;
      const updatedPost = await postRepository.update(id, data, ctx.session.id);

      if (!updatedPost) {
         throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post não encontrado"
         });
      }

      return updatedPost;
   } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
         throw new TRPCError({
            code: "FORBIDDEN",
            message: "Você só pode editar seus próprios posts"
         });
      }
      throw error;
   }
});
