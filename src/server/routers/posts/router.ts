import { createTRPCRouter } from "@/server/config/trpc";
import { createComment } from "./methods/create-comment";
import { createPost } from "./methods/create-post";
import { deletePost } from "./methods/delete-post";
import { findPosts, getPostById } from "./methods/find-posts";
import { updatePost } from "./methods/update-post";

export const postsRouter = createTRPCRouter({
   // Procedures de busca/listagem
   list: findPosts,
   getById: getPostById,

   // Procedures de criação
   create: createPost,

   // Procedures de atualização
   update: updatePost,

   // Procedures de exclusão
   delete: deletePost,

   // Procedures de comentários
   createComment
});
