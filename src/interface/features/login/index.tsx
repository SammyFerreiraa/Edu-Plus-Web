"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import type { ILogin } from "@/common/schemas/user";
import { loginSchema } from "@/common/schemas/user";
import { apiClient } from "@/config/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/interface/components/card";
import { Google } from "@/interface/components/icons";
import { Button } from "@/interface/components/ui/button";
import { InputForm } from "@/interface/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

export const LoginPage = () => {
   const {
      formState: { isSubmitting },
      control,
      handleSubmit
   } = useForm<ILogin>({
      resolver: zodResolver(loginSchema),
      mode: "onChange",
      defaultValues: {
         email: ""
      }
   });

   const { mutateAsync } = apiClient.auth.signInEmail.useMutation({
      onSuccess: () => {
         toast.success("Foi enviado um link de acesso para o seu e-mail");
      }
   });

   const submitWithEmail = async (data: ILogin) => {
      await mutateAsync({ email: data.email });
   };

   const submitWithGoogle = async () => {
      window.location.href = "/api/auth/signin/google";
   };

   return (
      <div className="min-h flex h-screen items-center justify-center bg-gray-100">
         <Card className="w-full max-w-md">
            <CardHeader>
               <CardTitle className="text-center text-2xl font-bold">Login</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
               <Button
                  type="button"
                  variant="outline"
                  className="flex w-full items-center justify-center gap-2"
                  onClick={submitWithGoogle}
               >
                  <Google />
                  Entrar com Google
               </Button>

               <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-gray-200"></div>
                  <span className="text-sm text-gray-500">ou</span>
                  <div className="h-px flex-1 bg-gray-200"></div>
               </div>

               <form className="space-y-4" onSubmit={handleSubmit(submitWithEmail)}>
                  <div className="space-y-2">
                     <InputForm name="email" control={control} label="E-mail" />
                  </div>
                  <Button type="submit" className="w-full" isLoading={isSubmitting}>
                     Entrar com E-mail
                  </Button>
               </form>
            </CardContent>
         </Card>
      </div>
   );
};
