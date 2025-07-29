import { BarChart3, BookOpen, FileText, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/interface/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/interface/components/ui/card";
import { signOutAction } from "@/server/actions/auth";

export default async function ProfessorPage() {
   return (
      <div className="min-h-screen bg-gray-50">
         <div className="border-b bg-white px-4 py-3">
            <div className="mx-auto flex max-w-6xl items-center justify-between">
               <h1 className="text-xl font-semibold">EDU Plus - Professor</h1>
               <form action={signOutAction}>
                  <Button variant="outline" size="sm" type="submit">
                     Logout
                  </Button>
               </form>
            </div>
         </div>

         <div className="mx-auto max-w-6xl space-y-6 p-6">
            <div>
               <h1 className="text-3xl font-bold">Bem-vindo, Professor!</h1>
               <p className="text-muted-foreground">Gerencie suas turmas e acompanhe o progresso dos alunos.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               <Card>
                  <CardHeader>
                     <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <CardTitle>Gerenciar Turmas</CardTitle>
                     </div>
                     <CardDescription>Crie, edite e gerencie suas turmas e alunos</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Link href="/professor/turmas">
                        <Button className="w-full">Acessar Turmas</Button>
                     </Link>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-green-600" />
                        <CardTitle>Questões</CardTitle>
                     </div>
                     <CardDescription>Gerencie banco de questões e exercícios</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Link href="/professor/questoes">
                        <Button className="w-full" variant="outline">
                           Em Breve
                        </Button>
                     </Link>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-600" />
                        <CardTitle>Relatórios</CardTitle>
                     </div>
                     <CardDescription>Acompanhe estatísticas e relatórios de desempenho</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Link href="/professor/relatorios">
                        <Button className="w-full" variant="outline">
                           Em Breve
                        </Button>
                     </Link>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-orange-600" />
                        <CardTitle>Exercícios</CardTitle>
                     </div>
                     <CardDescription>Crie e gerencie exercícios para suas turmas</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Link href="/professor/exercicios">
                        <Button className="w-full" variant="outline">
                           Em Breve
                        </Button>
                     </Link>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
