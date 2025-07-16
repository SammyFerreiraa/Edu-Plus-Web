"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { apiClient } from "@/config/trpc/react";
import { Badge } from "@/interface/components/ui/badge";
import { Button } from "@/interface/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/interface/components/ui/card";
import { Input } from "@/interface/components/ui/input";
import { useSession } from "@/interface/hooks/useSession";
import { CreatePostForm } from "./create-post-form";
import { PostCard } from "./post-card";

export function PostsFeature() {
   const { isAuthenticated } = useSession();
   const [search, setSearch] = useState("");
   const [showCreateForm, setShowCreateForm] = useState(false);
   const [page, setPage] = useState(0);
   const limit = 10;

   const { data, isLoading, refetch } = apiClient.posts.list.useQuery({
      limit,
      offset: page * limit,
      search: search || undefined
   });

   const handleSearch = (value: string) => {
      setSearch(value);
      setPage(0); // Reset page when searching
   };

   const handlePostCreated = () => {
      setShowCreateForm(false);
      void refetch();
   };

   const handlePostDeleted = () => {
      void refetch();
   };

   return (
      <div className="space-y-6">
         {/* Header */}
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <h1 className="text-3xl font-bold">Posts</h1>
               <p className="text-muted-foreground">Compartilhe suas ideias e interaja com a comunidade</p>
            </div>

            {isAuthenticated && (
               <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Novo Post
               </Button>
            )}
         </div>

         {/* Search */}
         <Card>
            <CardContent className="pt-6">
               <div className="relative">
                  <Input
                     placeholder="Pesquisar posts..."
                     startIcon={<Search className="text-muted-foreground h-4 w-4" />}
                     value={search}
                     onChange={(e) => handleSearch(e.target.value)}
                     className="pl-10"
                  />
               </div>
            </CardContent>
         </Card>

         {/* Create Post Form */}
         {showCreateForm && isAuthenticated && (
            <Card>
               <CardHeader>
                  <CardTitle>Criar Novo Post</CardTitle>
               </CardHeader>
               <CardContent>
                  <CreatePostForm onSuccess={handlePostCreated} />
               </CardContent>
            </Card>
         )}

         {/* Stats */}
         {data && (
            <div className="flex gap-4">
               <Badge variant="secondary" className="px-3 py-1">
                  {data.total} {data.total === 1 ? "post encontrado" : "posts encontrados"}
               </Badge>
               {search && (
                  <Badge variant="outline" className="px-3 py-1">
                     Pesquisando por: &ldquo;{search}&rdquo;
                  </Badge>
               )}
            </div>
         )}

         {/* Posts List */}
         <div className="space-y-4">
            {isLoading ? (
               <div className="flex items-center justify-center py-8">
                  <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
               </div>
            ) : data?.posts.length === 0 ? (
               <Card>
                  <CardContent className="py-8 text-center">
                     <p className="text-muted-foreground">
                        {search ? "Nenhum post encontrado para sua pesquisa." : "Nenhum post encontrado."}
                     </p>
                     {!isAuthenticated && (
                        <p className="text-muted-foreground mt-2 text-sm">Faça login para criar o primeiro post!</p>
                     )}
                  </CardContent>
               </Card>
            ) : (
               data?.posts.map((post) => <PostCard key={post.id} post={post} onDeleted={handlePostDeleted} />)
            )}
         </div>

         {/* Pagination */}
         {data && data.total > limit && (
            <div className="flex items-center justify-center gap-2">
               <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 0}>
                  Anterior
               </Button>

               <span className="text-muted-foreground px-4 py-2 text-sm">
                  Página {page + 1} de {Math.ceil(data.total / limit)}
               </span>

               <Button variant="outline" onClick={() => setPage(page + 1)} disabled={!data.hasMore}>
                  Próxima
               </Button>
            </div>
         )}
      </div>
   );
}
