"use client";

import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { SERIES_LABELS } from "@/common/constants/edu-plus";
import { apiClient } from "@/config/trpc/react";
import { Badge } from "@/interface/components/ui/badge";
import { Button } from "@/interface/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/interface/components/ui/card";
import { QuestionType } from "@prisma/client";

type Props = {
   questaoId: string;
};

const TIPOS_QUESTAO_LABELS = {
   [QuestionType.MULTIPLA_ESCOLHA]: "Múltipla Escolha",
   [QuestionType.NUMERO]: "Numérica",
   VERDADEIRO_FALSO: "Verdadeiro/Falso",
   TEXTO_CURTO: "Texto Curto"
} as const;

export function VisualizarQuestaoPage({ questaoId }: Props) {
   const router = useRouter();
   const utils = apiClient.useUtils();

   const { data: questao, isLoading, error } = apiClient.questoes.byId.useQuery({ id: questaoId });

   const deleteMutation = apiClient.questoes.delete.useMutation({
      onSuccess: () => {
         // Invalidar cache para recarregar dados
         void utils.questoes.list.invalidate();
         void utils.questoes.estatisticas.invalidate();

         alert("Questão excluída com sucesso!");
         router.push("/professor/questoes");
      },
      onError: (error) => {
         alert(`Erro ao excluir questão: ${error.message}`);
      }
   });

   const handleDelete = () => {
      if (confirm("Tem certeza que deseja excluir esta questão?")) {
         deleteMutation.mutate({ id: questaoId });
      }
   };

   if (isLoading) {
      return (
         <div className="container mx-auto py-6">
            <div className="flex min-h-[400px] items-center justify-center">
               <div className="text-center">
                  <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  <p className="text-gray-600">Carregando questão...</p>
               </div>
            </div>
         </div>
      );
   }

   if (error || !questao) {
      return (
         <div className="container mx-auto py-6">
            <div className="flex min-h-[400px] items-center justify-center">
               <div className="text-center">
                  <p className="mb-4 text-red-600">Erro ao carregar questão</p>
                  <Button onClick={() => router.back()}>Voltar</Button>
               </div>
            </div>
         </div>
      );
   }

   const opcoes = questao.opcoes ? JSON.parse(questao.opcoes) : [];

   return (
      <div className="container mx-auto py-6">
         {/* Header */}
         <div className="mb-8">
            <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => router.back()}
                     className="flex items-center space-x-2"
                  >
                     <ArrowLeft className="h-4 w-4" />
                     <span>Voltar</span>
                  </Button>
                  <div className="h-6 border-l border-gray-300" />
                  <div>
                     <h1 className="text-3xl font-bold text-gray-900">Visualizar Questão</h1>
                     <p className="text-gray-600">Detalhes da questão selecionada</p>
                  </div>
               </div>

               <div className="flex items-center space-x-3">
                  <Button
                     variant="outline"
                     onClick={() => router.push(`/professor/questoes/${questaoId}/editar`)}
                     className="flex items-center space-x-2"
                  >
                     <Edit className="h-4 w-4" />
                     <span>Editar</span>
                  </Button>
                  <Button
                     variant="destructive"
                     onClick={handleDelete}
                     disabled={deleteMutation.isPending}
                     className="flex items-center space-x-2"
                  >
                     <Trash2 className="h-4 w-4" />
                     <span>{deleteMutation.isPending ? "Excluindo..." : "Excluir"}</span>
                  </Button>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            {/* Informações Básicas */}
            <Card>
               <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                     <div>
                        <h4 className="mb-2 font-medium text-gray-900">Série</h4>
                        <Badge variant="secondary">{SERIES_LABELS[questao.serie]}</Badge>
                     </div>
                     <div>
                        <h4 className="mb-2 font-medium text-gray-900">Tipo</h4>
                        <Badge variant="outline">{TIPOS_QUESTAO_LABELS[questao.tipo]}</Badge>
                     </div>
                     <div>
                        <h4 className="mb-2 font-medium text-gray-900">Dificuldade</h4>
                        <div className="flex items-center space-x-2">
                           <div className="flex items-center space-x-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                 <div
                                    key={i}
                                    className={`h-3 w-3 rounded-full ${
                                       i < questao.dificuldade ? "bg-yellow-400" : "bg-gray-200"
                                    }`}
                                 />
                              ))}
                           </div>
                           <span className="text-sm text-gray-600">({questao.dificuldade}/5)</span>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Enunciado */}
            <Card>
               <CardHeader>
                  <CardTitle>Enunciado</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="prose max-w-none">
                     <p className="leading-relaxed whitespace-pre-wrap text-gray-900">{questao.enunciado}</p>
                  </div>
               </CardContent>
            </Card>

            {/* Opções (se for múltipla escolha) */}
            {questao.tipo === QuestionType.MULTIPLA_ESCOLHA && opcoes.length > 0 && (
               <Card>
                  <CardHeader>
                     <CardTitle>Opções de Resposta</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-3">
                        {opcoes.map((opcao: any, index: number) => (
                           <div
                              key={opcao.id}
                              className={`flex items-center space-x-3 rounded-lg border p-3 ${
                                 opcao.id === questao.gabarito
                                    ? "border-green-200 bg-green-50"
                                    : "border-gray-200 bg-gray-50"
                              }`}
                           >
                              <div className="flex-shrink-0">
                                 <div
                                    className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${
                                       opcao.id === questao.gabarito
                                          ? "bg-green-600 text-white"
                                          : "bg-gray-300 text-gray-700"
                                    }`}
                                 >
                                    {String.fromCharCode(65 + index)}
                                 </div>
                              </div>
                              <div className="flex-1">
                                 <p className="text-gray-900">{opcao.texto}</p>
                              </div>
                              {opcao.id === questao.gabarito && (
                                 <Badge variant="default" className="bg-green-600">
                                    Correta
                                 </Badge>
                              )}
                           </div>
                        ))}
                     </div>
                  </CardContent>
               </Card>
            )}

            {/* Gabarito (para outros tipos) */}
            {questao.tipo !== QuestionType.MULTIPLA_ESCOLHA && (
               <Card>
                  <CardHeader>
                     <CardTitle>Resposta Correta</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                        <p className="font-medium text-gray-900">{questao.gabarito}</p>
                     </div>
                  </CardContent>
               </Card>
            )}

            {/* Habilidades BNCC */}
            <Card>
               <CardHeader>
                  <CardTitle>Habilidades da BNCC</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex flex-wrap gap-2">
                     {questao.habilidades.map((habilidade) => (
                        <Badge key={habilidade} variant="secondary">
                           {habilidade}
                        </Badge>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Explicação */}
            {questao.explicacao && (
               <Card>
                  <CardHeader>
                     <CardTitle>Explicação da Resolução</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="prose max-w-none">
                        <p className="leading-relaxed whitespace-pre-wrap text-gray-900">{questao.explicacao}</p>
                     </div>
                  </CardContent>
               </Card>
            )}

            {/* Informações de Criação */}
            <Card>
               <CardHeader>
                  <CardTitle>Informações de Criação</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                     <div>
                        <h4 className="mb-2 font-medium text-gray-900">Criado em</h4>
                        <p className="text-gray-600">
                           {new Date(questao.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                           })}
                        </p>
                     </div>
                     <div>
                        <h4 className="mb-2 font-medium text-gray-900">Última atualização</h4>
                        <p className="text-gray-600">
                           {new Date(questao.updatedAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                           })}
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
