# 🚀 Dashboard Turbo: Gerenciador de Proatividade Gamificado

> Projeto desenvolvido durante o Workshop de Desenvolvimento Full-Stack Moderno.

![Status do Projeto](https://img.shields.io/badge/Status-Finalizado-green)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue)
![Back4App](https://img.shields.io/badge/Backend-Back4App-blue)

## 📖 Sobre o Projeto

O **Dashboard Turbo** é uma aplicação web Full-Stack focada em produtividade e gamificação. Diferente de uma lista de tarefas comum, este projeto calcula o **XP (Experiência)** do usuário com base na dificuldade das tarefas concluídas, incentivando a produtividade através de métricas visuais.

O objetivo do projeto foi demonstrar a construção de uma aplicação moderna utilizando **Next.js (App Router)** para o frontend e **Back4App (Parse Server)** como Backend-as-a-Service (BaaS), permitindo um desenvolvimento rápido e escalável.

## ✨ Funcionalidades

- **🔐 Autenticação Completa:** Login e Cadastro de usuários com criptografia de senha via Back4App.
- **📊 Dashboard Analítico:**
  - KPIs de XP Total, Tarefas Concluídas e Pendências.
  - Gráficos de Pizza (Foco por Categoria).
  - Gráficos de Barra (Distribuição de XP por Dificuldade).
- **✅ Gerenciamento de Tarefas (CRUD):**
  - Criação de tarefas com categorias e níveis de dificuldade.
  - Listagem inteligente com **TanStack Table**.
  - Marcação rápida de conclusão (Check).
  - Exclusão de tarefas.
- **🎮 Gamificação:** Cálculo automático de XP (Fácil = 10xp, Médio = 30xp, Difícil = 50xp).
- **👤 Perfil de Usuário:** Edição de dados cadastrais (Nome, Telefone, Profissão).

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- [Next.js 15](https://nextjs.org/) (App Router & Server Components)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) (Estilização)
- [Shadcn/ui](https://ui.shadcn.com/) (Componentes de Interface reutilizáveis)
- [Recharts](https://recharts.org/) (Gráficos de dados)
- [TanStack Table](https://tanstack.com/table/v8) (Tabelas avançadas)
- [Lucide React](https://lucide.dev/) (Ícones)

**Backend:**
- [Back4App](https://www.back4app.com/) (Backend as a Service baseada em Parse Platform)
- Parse SDK (Comunicação com o banco de dados NoSQL)

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior)
- NPM ou Yarn
- Uma conta no [Back4App](https://www.back4app.com/)

### 1. Clone o repositório
```bash
git clone [https://github.com/seu-usuario/dashboard-turbo.git](https://github.com/seu-usuario/dashboard-turbo.git)
cd dashboard-turbo