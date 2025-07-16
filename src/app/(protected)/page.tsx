import { FileText, Settings, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/interface/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/interface/components/ui/card";
import { signOutAction } from "@/server/actions/auth";

export default async function Page() {
   return (
      <div className="min-h-screen bg-gray-50">
         <div className="border-b bg-white px-4 py-3">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
               <h1 className="text-xl font-semibold">Template Full-Stack</h1>
               <form action={signOutAction}>
                  <Button variant="outline" size="sm" type="submit">
                     Logout
                  </Button>
               </form>
            </div>
         </div>

         <div className="mx-auto max-w-6xl space-y-6 p-6">
            <div>
               <h1 className="text-3xl font-bold">Bem-vindo ao Template Full-Stack!</h1>
               <p className="text-muted-foreground">Explore as funcionalidades disponíveis em nosso template.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               <Card>
                  <CardHeader>
                     <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <CardTitle>Posts</CardTitle>
                     </div>
                     <CardDescription>Sistema completo de posts com comentários</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Link href="/posts">
                        <Button variant="outline" className="w-full">
                           Ver Posts
                        </Button>
                     </Link>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-green-600" />
                        <CardTitle>Exemplos</CardTitle>
                     </div>
                     <CardDescription>Componentes e funcionalidades de exemplo</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Link href="/example">
                        <Button variant="outline" className="w-full">
                           Ver Exemplos
                        </Button>
                     </Link>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        <CardTitle>Administração</CardTitle>
                     </div>
                     <CardDescription>Funcionalidades administrativas</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Link href="/admin-page">
                        <Button variant="outline" className="w-full">
                           Acessar Admin
                        </Button>
                     </Link>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
