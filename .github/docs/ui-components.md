---
applyTo: "**/*.ts,**/*.tsx"
---

# Componentes UI

## 🧩 Componentes UI Disponíveis

### **Princípios Gerais**

- **SEMPRE** utilize os componentes existentes localizados em `/src/interface/components/ui/`
- Mantenha o padrão CVA (class-variance-authority) para variantes de componentes
- Utilize Tailwind CSS para toda a estilização
- Componentes devem ser marcados com `"use client"` quando necessário (interatividade no navegador)

### **Biblioteca de Componentes**

#### **📍 Localização:** `/src/interface/components/ui/`

### **Button**

Botões com diferentes variantes, tamanhos e estados.

```typescript
import { Button } from "@/interface/components/ui/button";

// Variantes
<Button>Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Tamanhos
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><IconComponent /></Button>

// Estado de carregamento
<Button isLoading={true}>Loading...</Button>
```

### **Input**

Campo de entrada com suporte para validação e ícones.

```typescript
import { Input } from "@/interface/components/ui/input";
import { Search } from "lucide-react";

// Básico
<Input placeholder="Digite algo..." />

// Com label e erro
<Input
  label="Email"
  placeholder="usuario@exemplo.com"
  error="Email inválido"
/>

// Com ícones
<Input
  startIcon={<Search className="w-4 h-4" />}
  placeholder="Buscar..."
/>

// Toggle de senha
<Input
  type="password"
  label="Senha"
  withPasswordToggle
/>
```

### **Select**

Seleção de opções com suporte para diferentes tamanhos.

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/interface/components/ui/select";

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Selecione uma opção" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Opção 1</SelectItem>
    <SelectItem value="option2">Opção 2</SelectItem>
    <SelectItem value="option3">Opção 3</SelectItem>
  </SelectContent>
</Select>

// Tamanho pequeno
<Select size="sm">
  {/* ...conteúdo */}
</Select>
```

### **Autocomplete**

Componente de pesquisa com sugestões e suporte para múltipla seleção.

```typescript
import { Autocomplete } from "@/interface/components/ui/autocomplete";

// Busca assíncrona
<Autocomplete
  fetchOptions={async (query) => {
    // Busca de opções baseada na query
    return [
      { label: "Opção 1", value: "1" },
      { label: "Opção 2", value: "2" }
    ];
  }}
  selectedValues={[{ label: "Selecionado", value: "1" }]}
  onSelectionChange={(selections) => {
    // Manipula mudanças na seleção
  }}
  multiple={false}
/>
```

### **Badge**

Etiquetas para destacar informações.

```typescript
import { Badge } from "@/interface/components/ui/badge";

// Variantes
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

// Com ícone
<Badge>
  <IconComponent className="mr-1 h-3 w-3" />
  Com Ícone
</Badge>

// Link
<Badge asChild>
  <a href="/">Link Badge</a>
</Badge>
```

### **Card**

Cartões para exibir conteúdo em grupos.

```typescript
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/interface/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional do card</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Conteúdo principal do card...</p>
  </CardContent>
  <CardFooter>
    <Button>Ação Principal</Button>
  </CardFooter>
</Card>
```

### **Table**

Tabelas para exibição de dados, com suporte para DataTable avançada.

```typescript
// Tabela simples
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/interface/components/ui/table";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Nome</TableHead>
      <TableHead>Email</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>João Silva</TableCell>
      <TableCell>joao@exemplo.com</TableCell>
    </TableRow>
  </TableBody>
</Table>

// DataTable (Tanstack Table)
import { DataTable } from "@/interface/components/ui/data-table";

<DataTable
  columns={columns}
  data={data}
  searchColumn="name"
  pagination={true}
/>
```

### **Outros Componentes Disponíveis**

- **DatePicker:** Seleção de datas com calendário integrado
- **FileUpload:** Upload de arquivos com preview
- **Switch:** Toggle para opções booleanas
- **Checkbox:** Caixas de seleção
- **Calendar:** Calendário standalone
- **Popover:** Conteúdo flutuante
- **Label:** Rótulos acessíveis para formulários

**💡 Importante:** Antes de usar, **SEMPRE** consulte o arquivo do componente específico para verificar as props exatas,
variantes e exemplos de uso.

### **Ícones**

- **Lucide React:** Use prioritariamente este pacote para ícones
- Ícones customizados estão em `/src/interface/components/icons/`

```typescript
import { Search, Settings, User } from "lucide-react";
import { GoogleIcon } from "@/interface/components/icons";

// Exemplo de uso
<Button>
  <Search className="mr-2 h-4 w-4" />
  Buscar
</Button>
```
