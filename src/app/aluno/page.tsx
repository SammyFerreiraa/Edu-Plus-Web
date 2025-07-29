"use client";

import { useState } from "react";
import { BookOpen, Target, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/interface/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/interface/components/ui/card";
import { Input } from "@/interface/components/ui/input";
import { alunoApi, type AlunoTurmaResponse } from "@/services/aluno-api";

export default function AlunoAcessoPage() {
   const router = useRouter();
   const [codigoAcesso, setCodigoAcesso] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!codigoAcesso.trim()) {
         setError("Digite seu código de acesso");
         return;
      }

      if (codigoAcesso.length !== 6) {
         setError("O código deve ter 6 caracteres");
         return;
      }

      setIsLoading(true);
      setError(null);

      try {
         const dadosAluno: AlunoTurmaResponse = await alunoApi.acessarTurma(codigoAcesso.toUpperCase());

         // Salvar dados do aluno no localStorage para não precisar fazer login novamente
         localStorage.setItem("dadosAluno", JSON.stringify(dadosAluno));

         // Redirecionar para o dashboard do aluno
         router.push(`/aluno/${dadosAluno.id}/dashboard`);
      } catch (error: any) {
         console.error("Erro ao acessar turma:", error);

         if (error.response?.status === 404) {
            setError("Código de acesso inválido. Verifique se digitou corretamente.");
         } else if (error.response?.status === 400) {
            setError(error.response.data?.error || "Erro ao acessar a turma");
         } else {
            setError("Erro ao conectar. Tente novamente.");
         }
      } finally {
         setIsLoading(false);
      }
   };

   const formatarCodigo = (valor: string) => {
      // Remove caracteres não alfanuméricos e converte para maiúsculo
      const limpo = valor.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      // Limita a 6 caracteres
      return limpo.slice(0, 6);
   };

   const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const valorFormatado = formatarCodigo(e.target.value);
      setCodigoAcesso(valorFormatado);
      setError(null);
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
         <div className="h-screen px-4 py-8">
            <div className="mx-auto my-auto flex h-full max-w-md items-center justify-center">
               <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
                  <CardHeader className="pb-2 text-center">
                     <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
                        Código de Acesso
                     </CardTitle>
                     <p className="text-sm text-gray-600">Seu professor forneceu um código único para você</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                           <Input
                              type="text"
                              placeholder="Ex: AB1234"
                              value={codigoAcesso}
                              onChange={handleCodigoChange}
                              className="h-14 border-2 text-center font-mono text-xl tracking-widest text-gray-900 focus:border-blue-500"
                              maxLength={6}
                              autoComplete="off"
                              disabled={isLoading}
                           />
                           <p className="mt-2 text-center text-xs text-gray-500">
                              Digite as 2 letras e 4 números do seu código
                           </p>
                        </div>

                        {error && (
                           <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                              <p className="text-center text-sm font-medium text-red-700">{error}</p>
                           </div>
                        )}

                        <Button
                           type="submit"
                           className="h-12 w-full bg-blue-600 text-lg font-semibold text-white hover:bg-blue-700"
                           disabled={isLoading || codigoAcesso.length !== 6}
                        >
                           {isLoading ? (
                              <div className="flex items-center gap-2">
                                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                 Entrando...
                              </div>
                           ) : (
                              "Entrar na Turma"
                           )}
                        </Button>
                     </form>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
