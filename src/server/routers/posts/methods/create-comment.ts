import { createCommentSchema } from "@/common/schemas/post";
import { procedures } from "@/server/config/trpc";
import { TRPCError } from "@trpc/server";
import { postRepository } from "../repository";

export const createComment = procedures.protected.input(createCommentSchema).mutation(async ({ input, ctx }) => {
   if (!ctx.session) {
      throw new TRPCError({
         code: "UNAUTHORIZED",
         message: "Você precisa estar logado para comentar"
      });
   }

   return await postRepository.createComment(input.postId, input.text, ctx.session.id);
});
