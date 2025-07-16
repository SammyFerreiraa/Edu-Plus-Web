"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreHorizontal, Send, Trash2, User } from "lucide-react";
import { createCommentSchema, type ICreateComment } from "@/common/schemas/post";
import { apiClient } from "@/config/trpc/react";
import { Button } from "@/interface/components/ui/button";
import { Card, CardContent } from "@/interface/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/interface/components/ui/popover";
import { useSession } from "@/interface/hooks/useSession";
import { zodResolver } from "@hookform/resolvers/zod";

interface CommentsSectionProps {
   postId: number;
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
   onCommentAdded?: () => void;
}

export function CommentsSection({ postId, comments, onCommentAdded }: CommentsSectionProps) {
   const { user, isAuthenticated } = useSession();
   const [isSubmitting, setIsSubmitting] = useState(false);

   const { mutate: addComment, reset: resetMutation } = apiClient.posts.addComment.useMutation({
      onSuccess: () => {
         reset();
         setIsSubmitting(false);
         resetMutation();
         onCommentAdded?.();
      },
      onError: (error) => {
         setIsSubmitting(false);
         console.error("Erro ao adicionar comentário:", error);
      }
   });

   const { mutate: deleteComment } = apiClient.posts.deleteComment.useMutation({
      onSuccess: () => {
         onCommentAdded?.(); // Refresh comments
      },
      onError: (error) => {
         console.error("Erro ao deletar comentário:", error);
      }
   });

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch
   } = useForm<ICreateComment>({
      resolver: zodResolver(createCommentSchema),
      defaultValues: {
         postId
      }
   });

   const commentText = watch("text") || "";

   const onSubmit = (data: ICreateComment) => {
      setIsSubmitting(true);
      addComment(data);
   };

   const handleDeleteComment = (commentId: number) => {
      if (confirm("Tem certeza que deseja deletar este comentário?")) {
         deleteComment({ id: commentId });
      }
   };

   return (
      <div className="border-muted-foreground/20 space-y-4 border-t pt-4">
         {/* Comments List */}
         <div className="space-y-3">
            {comments.length === 0 ? (
               <p className="text-muted-foreground text-center text-sm">
                  Nenhum comentário ainda. Seja o primeiro a comentar!
               </p>
            ) : (
               comments.map((comment) => {
                  const canDelete = user?.id === comment.user?.id || user?.role === "ADMIN";
                  const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
                     addSuffix: true,
                     locale: ptBR
                  });

                  return (
                     <Card key={comment.id} className="bg-muted/30">
                        <CardContent className="p-3">
                           <div className="flex items-start justify-between">
                              <div className="flex gap-3">
                                 <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                                    <User className="h-4 w-4" />
                                 </div>
                                 <div className="flex-1">
                                    <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs">
                                       <span className="font-medium">
                                          {comment.user?.name || comment.user?.email || "Usuário anônimo"}
                                       </span>
                                       <span>•</span>
                                       <span>{timeAgo}</span>
                                    </div>
                                    <p className="text-sm">{comment.text}</p>
                                 </div>
                              </div>

                              {canDelete && (
                                 <Popover>
                                    <PopoverTrigger asChild>
                                       <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                          <MoreHorizontal className="h-3 w-3" />
                                       </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32" align="end">
                                       <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-destructive hover:text-destructive h-8 w-full justify-start gap-2"
                                          onClick={() => handleDeleteComment(comment.id)}
                                       >
                                          <Trash2 className="h-4 w-4" />
                                          Deletar
                                       </Button>
                                    </PopoverContent>
                                 </Popover>
                              )}
                           </div>
                        </CardContent>
                     </Card>
                  );
               })
            )}
         </div>

         {/* Add Comment Form */}
         {isAuthenticated && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
               <div className="space-y-2">
                  <textarea
                     rows={3}
                     placeholder="Escreva um comentário..."
                     {...register("text")}
                     disabled={isSubmitting}
                     className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors.text && <p className="text-destructive text-sm">{errors.text.message}</p>}
                  <div className="text-muted-foreground text-right text-xs">{commentText.length}/500 caracteres</div>
               </div>

               <div className="flex justify-end">
                  <Button type="submit" size="sm" disabled={isSubmitting || !commentText.trim()} className="gap-2">
                     {isSubmitting ? (
                        <>
                           <div className="border-background h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" />
                           Enviando...
                        </>
                     ) : (
                        <>
                           <Send className="h-3 w-3" />
                           Comentar
                        </>
                     )}
                  </Button>
               </div>
            </form>
         )}

         {!isAuthenticated && (
            <p className="text-muted-foreground text-center text-sm">Faça login para comentar neste post.</p>
         )}
      </div>
   );
}
