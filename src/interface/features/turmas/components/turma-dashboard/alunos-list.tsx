"use client";

import { Copy, Edit, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/interface/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/interface/components/ui/card";

type Aluno = {
   id: string;
   name?: string | null;
   profile?: {
      responsavel?: string | null;
      dataNascimento?: Date | null;
      codigoAcesso?: string | null;
   } | null;
};

type AlunosListProps = {
   alunos: Aluno[];
   onAdicionarAluno: () => void;
   onEditarAluno: (aluno: Aluno) => void;
   onRemoverAluno: (alunoId: string, nomeAluno: string) => void;
};

export function AlunosList({ alunos, onAdicionarAluno, onEditarAluno, onRemoverAluno }: AlunosListProps) {
   return (
      <Card>
         <CardHeader>
            <div className="flex items-center justify-between">
               <CardTitle>Alunos da Turma</CardTitle>
               <Button onClick={onAdicionarAluno}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Aluno
               </Button>
            </div>
         </CardHeader>
         <CardContent>
            {alunos && alunos.length > 0 ? (
               <div className="space-y-4">
                  {alunos.map((aluno) => (
                     <div key={aluno.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex-1">
                           <h4 className="font-medium text-gray-900">{aluno.name || "Nome não definido"}</h4>
                           <p className="text-sm text-gray-600">
                              Responsável: {aluno.profile?.responsavel || "Não informado"}
                           </p>
                           {aluno.profile?.dataNascimento && (
                              <p className="text-sm text-gray-600">
                                 Nascimento: {new Date(aluno.profile.dataNascimento).toLocaleDateString()}
                              </p>
                           )}
                           {aluno.profile?.codigoAcesso && (
                              <div className="mt-2 flex items-center space-x-2">
                                 <p className="rounded bg-blue-50 px-2 py-1 font-mono text-sm text-blue-600">
                                    Código: {aluno.profile.codigoAcesso}
                                 </p>
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigator.clipboard.writeText(aluno.profile?.codigoAcesso || "")}
                                    className="h-6 w-6 p-0"
                                 >
                                    <Copy className="h-3 w-3" />
                                 </Button>
                              </div>
                           )}
                        </div>
                        <div className="flex items-center space-x-2">
                           <Button variant="ghost" size="sm" onClick={() => onEditarAluno(aluno)}>
                              <Edit className="h-4 w-4" />
                           </Button>
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoverAluno(aluno.id, aluno.name || "Aluno")}
                              className="text-red-600 hover:text-red-800"
                           >
                              <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="py-8 text-center">
                  <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum aluno cadastrado</h3>
                  <p className="mb-4 text-gray-600">Comece adicionando o primeiro aluno à turma</p>
                  <Button onClick={onAdicionarAluno}>
                     <Plus className="mr-2 h-4 w-4" />
                     Adicionar primeiro aluno
                  </Button>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
