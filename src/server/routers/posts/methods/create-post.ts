import { createPostSchema } from "@/common/schemas/post";
import { procedures } from "@/server/config/trpc";
import { TRPCError } from "@trpc/server";
import { postRepository } from "../repository";

export const createPost = procedures.protected.input(createPostSchema).mutation(async ({ input, ctx }) => {
   if (!ctx.session) {
      throw new TRPCError({
         code: "UNAUTHORIZED",
         message: "Você precisa estar logado para criar um post"
      });
   }

   return await postRepository.create(input, ctx.session.id);
});
