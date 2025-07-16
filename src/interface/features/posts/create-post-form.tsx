"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { createPostSchema, type ICreatePost } from "@/common/schemas/post";
import { apiClient } from "@/config/trpc/react";
import { Button } from "@/interface/components/ui/button";
import { Input } from "@/interface/components/ui/input";
import { Label } from "@/interface/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreatePostFormProps {
   onSuccess?: () => void;
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
   const [isSubmitting, setIsSubmitting] = useState(false);

   const { mutate: createPost } = apiClient.posts.create.useMutation({
      onSuccess: () => {
         reset();
         setIsSubmitting(false);
         onSuccess?.();
      },
      onError: (error) => {
         setIsSubmitting(false);
         console.error("Erro ao criar post:", error);
      }
   });

   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch
   } = useForm<ICreatePost>({
      resolver: zodResolver(createPostSchema)
   });

   const contentValue = watch("content") || "";
   const nameValue = watch("name") || "";

   const onSubmit = (data: ICreatePost) => {
      setIsSubmitting(true);
      createPost(data);
   };

   return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         <div className="space-y-2">
            <Label htmlFor="name">Título do Post</Label>
            <Input
               id="name"
               placeholder="Digite o título do seu post..."
               {...register("name")}
               disabled={isSubmitting}
               aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            <div className="text-muted-foreground text-right text-xs">{nameValue.length}/100 caracteres</div>
         </div>

         <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <textarea
               id="content"
               rows={6}
               placeholder="Compartilhe suas ideias..."
               {...register("content")}
               disabled={isSubmitting}
               className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[150px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
               aria-invalid={!!errors.content}
            />
            {errors.content && <p className="text-destructive text-sm">{errors.content.message}</p>}
            <div className="text-muted-foreground text-right text-xs">{contentValue.length}/1000 caracteres</div>
         </div>

         <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
               {isSubmitting ? (
                  <>
                     <div className="border-background h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                     Publicando...
                  </>
               ) : (
                  <>
                     <Send className="h-4 w-4" />
                     Publicar Post
                  </>
               )}
            </Button>
         </div>
      </form>
   );
}
