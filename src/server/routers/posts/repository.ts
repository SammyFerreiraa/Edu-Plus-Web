import type { ICreatePost, IGetPosts, IUpdatePost } from "@/common/schemas/post";
import { prisma } from "@/server/config/prisma";

export const postRepository = {
   findMany: async (params: IGetPosts) => {
      const { limit, offset, search } = params;

      const where = search
         ? {
              OR: [
                 { name: { contains: search, mode: "insensitive" as const } },
                 { content: { contains: search, mode: "insensitive" as const } }
              ]
           }
         : {};

      const [posts, total] = await Promise.all([
         prisma.post.findMany({
            where,
            include: {
               createdBy: {
                  select: {
                     id: true,
                     name: true,
                     email: true
                  }
               },
               comments: {
                  include: {
                     user: {
                        select: {
                           id: true,
                           name: true,
                           email: true
                        }
                     }
                  },
                  orderBy: { createdAt: "desc" }
               },
               _count: {
                  select: { comments: true }
               }
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset
         }),
         prisma.post.count({ where })
      ]);

      return {
         posts,
         total,
         hasMore: offset + limit < total
      };
   },

   findById: async (id: number) => {
      return await prisma.post.findUnique({
         where: { id },
         include: {
            createdBy: {
               select: {
                  id: true,
                  name: true,
                  email: true
               }
            },
            comments: {
               include: {
                  user: {
                     select: {
                        id: true,
                        name: true,
                        email: true
                     }
                  }
               },
               orderBy: { createdAt: "desc" }
            }
         }
      });
   },

   create: async (data: ICreatePost, userId: string) => {
      return await prisma.post.create({
         data: {
            ...data,
            createdById: userId
         },
         include: {
            createdBy: {
               select: {
                  id: true,
                  name: true,
                  email: true
               }
            }
         }
      });
   },

   update: async (id: number, data: Omit<IUpdatePost, "id">, userId: string) => {
      // Verificar se o post existe e se o usuário é o criador
      const post = await prisma.post.findUnique({
         where: { id },
         select: { createdById: true }
      });

      if (!post) {
         return null;
      }

      if (post.createdById !== userId) {
         throw new Error("Unauthorized");
      }

      return await prisma.post.update({
         where: { id },
         data,
         include: {
            createdBy: {
               select: {
                  id: true,
                  name: true,
                  email: true
               }
            }
         }
      });
   },

   delete: async (id: number, userId: string) => {
      // Verificar se o post existe e se o usuário é o criador
      const post = await prisma.post.findUnique({
         where: { id },
         select: { createdById: true }
      });

      if (!post) {
         return null;
      }

      if (post.createdById !== userId) {
         throw new Error("Unauthorized");
      }

      return await prisma.post.delete({
         where: { id }
      });
   },

   createComment: async (postId: number, text: string, userId: string) => {
      return await prisma.comment.create({
         data: {
            text,
            postId,
            userId
         },
         include: {
            user: {
               select: {
                  id: true,
                  name: true,
                  email: true
               }
            }
         }
      });
   }
};
