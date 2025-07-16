import { z } from "@/config/zod-config";
import { procedures } from "@/server/config/trpc";
import { TRPCError } from "@trpc/server";
import { postRepository } from "../repository";

export const findPosts = procedures.public
   .input(
      z.object({
         page: z.number().optional().default(0),
         limit: z.number().optional().default(10),
         search: z.string().optional()
      })
   )
   .query(async ({ input }) => {
      const offset = input.page * input.limit;

      return await postRepository.findMany({
         limit: input.limit,
         offset,
         search: input.search
      });
   });

export const getPostById = procedures.public.input(z.object({ id: z.number() })).query(async ({ input }) => {
   const post = await postRepository.findById(input.id);

   if (!post) {
      throw new TRPCError({
         code: "NOT_FOUND",
         message: "Post não encontrado"
      });
   }

   return post;
});
