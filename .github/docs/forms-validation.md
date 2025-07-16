# Formulários e Validação

## 📝 Padrões de Formulários e Validação

### **Visão Geral**

O projeto utiliza uma combinação poderosa de **React Hook Form** para gerenciamento de formulários e **Zod** para
validação. Esta abordagem garante formulários eficientes, tipados e com excelente experiência de usuário.

### **Tecnologias e Bibliotecas**

- **React Hook Form**: Gerencia o estado e validação do formulário
- **Zod**: Schema de validação com inferência de tipos TypeScript
- **Componentes de Formulário**: Componentes UI adaptados para integração com React Hook Form

### **Estrutura de Schemas**

Os schemas de validação são definidos usando Zod e armazenados na pasta `/src/common/schemas/`:

```typescript
// src/common/schemas/user.ts
import { z } from "@/config/zod-config";

export const userLoginSchema = z.object({
   email: z.string().email("Email inválido"),
   password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres")
});

export const userRegistrationSchema = z
   .object({
      name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
      email: z.string().email("Email inválido"),
      password: z
         .string()
         .min(8, "A senha deve ter pelo menos 8 caracteres")
         .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
         .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
      confirmPassword: z.string()
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "As senhas não correspondem",
      path: ["confirmPassword"]
   });

// Inferir tipos a partir do schema
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
```

### **Uso do React Hook Form com Zod**

```typescript
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema, type UserLoginInput } from "@/common/schemas/user";
import { Button } from "@/interface/components/ui/button";
import { Input } from "@/interface/components/ui/input";
import { api } from "@/config/trpc/react";
import { useState } from "react";

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<UserLoginInput>({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const loginMutation = api.auth.login.useMutation({
    onError: (error) => {
      setServerError(error.message);
    }
  });

  const onSubmit = async (data: UserLoginInput) => {
    setServerError(null);
    await loginMutation.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <Input
          label="Email"
          {...register("email")}
          error={errors.email?.message}
        />
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          label="Senha"
          {...register("password")}
          error={errors.password?.message}
          withPasswordToggle
        />
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Entrar
      </Button>
    </form>
  );
}
```

### **Componente Form Reutilizável**

O projeto possui um componente `Form` reutilizável que encapsula a lógica comum de formulários:

```typescript
// src/interface/components/form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  UseFormProps,
  UseFormReturn,
  FieldValues,
  SubmitHandler,
  UseFormRegisterReturn
} from "react-hook-form";
import { z } from "@/config/zod-config";
import { cn } from "@/interface/styles/utils";
import { ReactNode, useState } from "react";

interface FormProps<TSchema extends z.ZodType<any, any>, TValues extends FieldValues> {
  schema: TSchema;
  onSubmit: SubmitHandler<TValues>;
  defaultValues?: UseFormProps<TValues>["defaultValues"];
  className?: string;
  children: (methods: UseFormReturn<TValues> & { isSubmitting: boolean }) => ReactNode;
  id?: string;
}

export function Form<TSchema extends z.ZodType<any, any>, TValues extends z.infer<TSchema>>({
  schema,
  onSubmit,
  defaultValues,
  className,
  children,
  id
}: FormProps<TSchema, TValues>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<TValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: TValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      id={id}
      onSubmit={methods.handleSubmit(handleSubmit)}
      className={cn("space-y-4", className)}
    >
      {children({ ...methods, isSubmitting })}
    </form>
  );
}

// Componentes auxiliares para uso com Form
export function FormField({
  register,
  name,
  label,
  error,
  ...rest
}: {
  register: (name: string) => UseFormRegisterReturn;
  name: string;
  label: string;
  error?: string;
  [key: string]: any;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        className={cn(
          "block w-full rounded-md border px-3 py-2",
          error ? "border-red-500" : "border-gray-300"
        )}
        {...register(name)}
        {...rest}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
```

### **Uso do Componente Form Reutilizável**

```typescript
"use client";
import { Form } from "@/interface/components/form";
import { userLoginSchema, type UserLoginInput } from "@/common/schemas/user";
import { Input } from "@/interface/components/ui/input";
import { Button } from "@/interface/components/ui/button";
import { useState } from "react";
import { api } from "@/config/trpc/react";

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);

  const loginMutation = api.auth.login.useMutation({
    onError: (error) => {
      setServerError(error.message);
    }
  });

  const handleSubmit = async (data: UserLoginInput) => {
    setServerError(null);
    await loginMutation.mutateAsync(data);
  };

  return (
    <div className="space-y-6">
      {serverError && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {serverError}
        </div>
      )}

      <Form
        schema={userLoginSchema}
        onSubmit={handleSubmit}
        defaultValues={{ email: "", password: "" }}
      >
        {({ register, formState: { errors }, isSubmitting }) => (
          <>
            <Input
              label="Email"
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              type="password"
              label="Senha"
              {...register("password")}
              error={errors.password?.message}
              withPasswordToggle
            />

            <Button type="submit" isLoading={isSubmitting} className="w-full">
              Entrar
            </Button>
          </>
        )}
      </Form>
    </div>
  );
}
```

### **Validação no Servidor**

Além da validação no cliente, sempre valide os dados também no servidor usando os mesmos schemas:

```typescript
// server/routers/auth/methods/login.ts
import { userLoginSchema } from "@/common/schemas/user";
import { authManager } from "@/server/auth/manager";
import { procedures } from "@/server/config/trpc";
import { TRPCError } from "@trpc/server";
import { authRepository } from "../repository";

export const login = procedures.public.input(userLoginSchema).mutation(async ({ input, ctx }) => {
   const { email, password } = input;

   // Autenticação
   const user = await authRepository.findUserByEmail(email);

   if (!user || !(await authRepository.verifyPassword(user.id, password))) {
      throw new TRPCError({
         code: "UNAUTHORIZED",
         message: "Email ou senha incorretos"
      });
   }

   // Criar sessão
   const sessionToken = await authManager.createSession(user.id);

   // Retornar token para definir no cookie
   return {
      sessionToken,
      user: {
         id: user.id,
         email: user.email,
         name: user.name,
         role: user.role
      }
   };
});
```

### **Formulários Dinâmicos**

Para formulários com campos dinâmicos, utilize `useFieldArray` do React Hook Form:

```typescript
"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@/config/zod-config";
import { Button } from "@/interface/components/ui/button";
import { Input } from "@/interface/components/ui/input";

// Schema para formulário dinâmico
const dynamicFormSchema = z.object({
  title: z.string().min(3),
  items: z.array(
    z.object({
      name: z.string().min(1, "Nome do item obrigatório"),
      quantity: z.number().min(1, "Quantidade deve ser pelo menos 1")
    })
  ).min(1, "Adicione pelo menos um item")
});

type DynamicFormValues = z.infer<typeof dynamicFormSchema>;

export function DynamicForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<DynamicFormValues>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: {
      title: "",
      items: [{ name: "", quantity: 1 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const onSubmit = (data: DynamicFormValues) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Título"
        {...register("title")}
        error={errors.title?.message}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Itens</h3>
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: "", quantity: 1 })}
          >
            Adicionar Item
          </Button>
        </div>

        {errors.items?.root?.message && (
          <p className="text-sm text-red-500">{errors.items.root.message}</p>
        )}

        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-3 items-end">
            <Input
              label="Nome do item"
              {...register(`items.${index}.name`)}
              error={errors.items?.[index]?.name?.message}
              className="flex-1"
            />

            <Input
              type="number"
              label="Quantidade"
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              error={errors.items?.[index]?.quantity?.message}
              className="w-32"
            />

            <Button
              type="button"
              variant="ghost"
              className="mb-1"
              onClick={() => remove(index)}
            >
              Remover
            </Button>
          </div>
        ))}
      </div>

      <Button type="submit">Enviar</Button>
    </form>
  );
}
```

### **Validações Condicionais**

Para validações condicionais, utilize a flexibilidade do Zod:

```typescript
// Exemplo de validação condicional com Zod
const paymentSchema = z
   .object({
      paymentMethod: z.enum(["credit", "bank_transfer", "pix"]),

      // Campos que dependem do método de pagamento
      creditCardNumber: z.string().optional(),
      expiryDate: z.string().optional(),
      cvv: z.string().optional(),

      bankName: z.string().optional(),
      accountNumber: z.string().optional(),

      pixKey: z.string().optional()
   })
   .refine(
      (data) => {
         // Se o método for cartão de crédito, valida campos específicos
         if (data.paymentMethod === "credit") {
            return !!data.creditCardNumber && !!data.expiryDate && !!data.cvv;
         }

         // Se o método for transferência bancária, valida campos específicos
         if (data.paymentMethod === "bank_transfer") {
            return !!data.bankName && !!data.accountNumber;
         }

         // Se o método for PIX, valida campos específicos
         if (data.paymentMethod === "pix") {
            return !!data.pixKey;
         }

         return true;
      },
      {
         message: "Por favor, preencha todos os campos obrigatórios para o método de pagamento selecionado",
         path: ["paymentMethod"] // Caminho para exibir a mensagem de erro
      }
   );
```

### **Formulários com Uploads de Arquivos**

Para formulários que incluem uploads de arquivos:

```typescript
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "@/config/zod-config";
import { Button } from "@/interface/components/ui/button";
import { Input } from "@/interface/components/ui/input";
import { FileUpload } from "@/interface/components/ui/file-upload";
import { useState } from "react";

// Schema com validação de arquivo
const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  // O arquivo é gerenciado separadamente do formulário
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: ""
    }
  });

  const onSubmit = async (data: ProfileFormValues) => {
    // Validação do arquivo
    if (!file && !userData?.profileImage) {
      setFileError("Por favor, envie uma foto de perfil");
      return;
    }

    // Criar FormData para enviar com o arquivo
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);

    if (file) {
      formData.append("profileImage", file);
    }

    // Enviar para a API
    // await apiCall(formData);
  };

  const handleFileChange = (file: File | null) => {
    setFile(file);
    setFileError(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Nome"
        {...register("name")}
        error={errors.name?.message}
      />

      <Input
        label="Email"
        {...register("email")}
        error={errors.email?.message}
      />

      <FileUpload
        label="Foto de perfil"
        acceptedFileTypes={["image/jpeg", "image/png"]}
        maxSizeInMB={5}
        onChange={handleFileChange}
        error={fileError}
        previewUrl={file ? URL.createObjectURL(file) : undefined}
      />

      <Button type="submit" isLoading={isSubmitting}>
        Salvar perfil
      </Button>
    </form>
  );
}
```

### **Boas Práticas**

1. **SEMPRE** defina schemas Zod em `/src/common/schemas/`
2. **SEMPRE** reutilize schemas entre cliente e servidor
3. **SEMPRE** infira tipos TypeScript dos schemas Zod
4. **SEMPRE** inclua mensagens de erro claras e específicas
5. **SEMPRE** implemente validação tanto no cliente quanto no servidor
6. **SEMPRE** utilize o componente `Form` para formulários complexos
7. **SEMPRE** desabilite o botão de envio durante o processamento
8. **SEMPRE** mostre feedback visual claro para erros de validação
9. **SEMPRE** inclua gestão de erros do servidor
10.   **SEMPRE** organize campos logicamente e com espaçamento adequado
11.   **SEMPRE** utilize os componentes UI do projeto para consistência visual
