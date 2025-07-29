"use client";

import { BookOpen, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/interface/components/ui/card";

type TurmaStatsProps = {
   totalAlunos: number;
   totalListas: number;
   exerciciosResolvidos?: number;
   mediaAcertos?: number;
};

export function TurmaStats({ totalAlunos, totalListas, exerciciosResolvidos, mediaAcertos }: TurmaStatsProps) {
   return (
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
         <Card>
            <CardContent className="p-6">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                     <p className="text-3xl font-bold text-gray-900">{totalAlunos}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardContent className="p-6">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm font-medium text-gray-600">Listas de Exercícios</p>
                     <p className="text-3xl font-bold text-gray-900">{totalListas}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-green-600" />
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardContent className="p-6">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm font-medium text-gray-600">Exercícios Resolvidos</p>
                     <p className="text-3xl font-bold text-gray-900">{exerciciosResolvidos ?? "--"}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-600" />
               </div>
            </CardContent>
         </Card>

         <Card>
            <CardContent className="p-6">
               <div className="flex items-center justify-between">
                  <div>
                     <p className="text-sm font-medium text-gray-600">Média de Acertos</p>
                     <p className="text-3xl font-bold text-gray-900">{mediaAcertos ? `${mediaAcertos}%` : "--%"}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-orange-600" />
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
