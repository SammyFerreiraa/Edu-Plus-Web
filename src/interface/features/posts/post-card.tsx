"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle, MoreHorizontal, Pen, Trash2, User } from "lucide-react";
import { apiClient } from "@/config/trpc/react";
import { Badge } from "@/interface/components/ui/badge";
import { Button } from "@/interface/components/ui/button";
import { Card, CardContent, CardHeader } from "@/interface/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/interface/components/ui/popover";
import { useSession } from "@/interface/hooks/useSession";
import { CommentsSection } from "./comments-section";

interface PostCardProps {
   post: {
      id: number;
      name: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
      createdBy: {
         id: string;
         name: string | null;
         email: string;
      };
      comments: Array<{
         id: number;
         text: string;
         createdAt: Date;
         user: {
            id: string;
            name: string | null;
            email: string;
         } | null;
      }>;
      _count: {
         comments: number;
      };
   };
   onDeleted?: () => void;
}

export function PostCard({ post, onDeleted }: PostCardProps) {
   const { user } = useSession();
   const [isDeleting, setIsDeleting] = useState(false);
   const [showComments, setShowComments] = useState(false);

   const { mutate: deletePost } = apiClient.posts.delete.useMutation({
      onSuccess: () => {
         setIsDeleting(false);
         onDeleted?.();
      },
      onError: (error) => {
         setIsDeleting(false);
         console.error("Erro ao deletar post:", error);
      }
   });

   const canEdit = user?.id === post.createdBy.id || user?.role === "ADMIN";
   const canDelete = user?.id === post.createdBy.id || user?.role === "ADMIN";

   const handleDelete = () => {
      if (confirm("Tem certeza que deseja deletar este post?")) {
         setIsDeleting(true);
         deletePost({ id: post.id });
      }
   };

   const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
      addSuffix: true,
      locale: ptBR
   });

   return (
      <Card className="transition-shadow hover:shadow-md">
         <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
               <div className="flex items-center gap-3">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                     <User className="h-5 w-5" />
                  </div>
                  <div>
                     <h3 className="leading-none font-semibold">{post.name}</h3>
                     <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                        <span>{post.createdBy.name || post.createdBy.email}</span>
                        <span>•</span>
                        <span>{timeAgo}</span>
                        {post.createdAt !== post.updatedAt && (
                           <>
                              <span>•</span>
                              <Badge variant="secondary" className="text-xs">
                                 Editado
                              </Badge>
                           </>
                        )}
                     </div>
                  </div>
               </div>

               {(canEdit || canDelete) && (
                  <Popover>
                     <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                           <MoreHorizontal className="h-4 w-4" />
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-48" align="end">
                        <div className="space-y-1">
                           {canEdit && (
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="h-8 w-full justify-start gap-2"
                                 onClick={() => {
                                    // TODO: Implementar edição
                                    console.log("Editar post:", post.id);
                                 }}
                              >
                                 <Pen className="h-4 w-4" />
                                 Editar
                              </Button>
                           )}
                           {canDelete && (
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 className="text-destructive hover:text-destructive h-8 w-full justify-start gap-2"
                                 onClick={handleDelete}
                                 disabled={isDeleting}
                              >
                                 <Trash2 className="h-4 w-4" />
                                 {isDeleting ? "Deletando..." : "Deletar"}
                              </Button>
                           )}
                        </div>
                     </PopoverContent>
                  </Popover>
               )}
            </div>
         </CardHeader>

         <CardContent className="space-y-4">
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{post.content}</div>

            <div className="border-muted-foreground/20 flex items-center gap-4 border-t pt-3">
               <Button variant="ghost" size="sm" className="gap-2" onClick={() => setShowComments(!showComments)}>
                  <MessageCircle className="h-4 w-4" />
                  {post._count.comments} {post._count.comments === 1 ? "comentário" : "comentários"}
               </Button>
            </div>

            {showComments && <CommentsSection postId={post.id} comments={post.comments} onCommentAdded={() => {}} />}
         </CardContent>
      </Card>
   );
}
