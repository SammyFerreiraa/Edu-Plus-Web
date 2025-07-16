# Template

Fullstack Template

## Technologies used

- [T3 Stack](https://create.t3.gg/)
- [Next.js](https://nextjs.org)
- [tRPC](https://trpc.io)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)

## Requirements

- [Node.js >= 22.10.0](https://nodejs.org)
- [pnpm >= 10.6.5](https://pnpm.io)

## Read documentation

[Documentation](https://github.com/BeyondTheBytes/Wiki/wiki/Template-Full%E2%80%90Stack)

## Steps to get started

### Step 1: Clone repository

```bash
git clone https://github.com/BeyondTheBytes/Template
cd template-fullstack
```

### Step 2: Install dependencies

```bash
pnpm install
```

### Step 3: Configure environment variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your database, authentication, and provider credentials.

### Step 4: Run database migrations

```bash
pnpm prisma migrate deploy
```

### Step 5: Start the project

```bash
pnpm dev
```

---

## 📚 Documentation & Project Instructions

For full project instructions, setup, and best practices, see the official wiki:

https://github.com/BeyondTheBytes/Wiki/wiki/Template-Full%E2%80%90Stack

---

## 🔒 Authentication & Security

All details about authentication, permissions, and security can be found here:

https://github.com/BeyondTheBytes/Wiki/wiki/Template-Full%E2%80%90Stack#authentication--security

---

## 🚀 CI/CD & Deployment

For all details about CI/CD setup, workflows, and deployment, see:

https://github.com/BeyondTheBytes/Wiki/wiki/Template-Full%E2%80%90Stack#cicd--deployment

---
