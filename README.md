# CodeLib - Biblioteca de Snippets e Plataforma Q&A

![CodeLib Logo](/public/icons/icon-192x192.png)

## 📋 Sobre o Projeto

CodeLib é uma aplicação web que funciona como uma biblioteca pessoal de snippets de código e plataforma de perguntas e respostas para desenvolvedores. O projeto permite armazenar, organizar e compartilhar trechos de código, além de criar e responder perguntas técnicas.

**🔗 [Link da Aplicação](https://codelib-peritto.vercel.app)**

## 🚀 Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **React** - Biblioteca para construção de interfaces
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes de UI reutilizáveis
- **PostgreSQL (Neon)** - Banco de dados relacional serverless
- **Vercel** - Plataforma de deploy e hospedagem

## ✨ Funcionalidades

### Snippets de Código
- Visualizar lista de snippets com filtragem por linguagem
- Ver detalhes de um snippet específico
- Criar novos snippets com título, descrição, código e tags
- Editar e excluir snippets existentes
- Copiar código para a área de transferência

### Plataforma de Q&A
- Visualizar lista de perguntas
- Ver detalhes de uma pergunta com suas respostas
- Criar novas perguntas com título, conteúdo e tags
- Responder perguntas existentes
- Sistema de votação para perguntas e respostas

### Recursos Gerais
- Sistema de busca por snippets e perguntas
- Organização por tags
- Interface responsiva e intuitiva
- Visualização de código com formatação adequada

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js 18.x ou superior
- Conta no Vercel (para deploy)
- Banco de dados PostgreSQL (recomendamos Neon)

### Passos para Instalação

1. Clone o repositório:
\`\`\`bash
git clone https://github.com/GuilhermePeritto/CodeLib.git
cd CodeLib
\`\`\`

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione as seguintes variáveis:
\`\`\`
DATABASE_URL=sua_url_de_conexao_postgresql
\`\`\`

4. Execute as migrações do banco de dados:
\`\`\`bash
npm run db:migrate
\`\`\`

5. Inicie o servidor de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

6. Acesse a aplicação em `http://localhost:3000`

## 📁 Estrutura do Projeto

\`\`\`
CodeLib/
├── app/                    # Rotas e páginas da aplicação (App Router)
│   ├── api/                # Rotas de API
│   ├── snippets/           # Páginas relacionadas a snippets
│   ├── questions/          # Páginas relacionadas a perguntas
│   ├── search/             # Funcionalidade de busca
│   └── layout.tsx          # Layout principal da aplicação
├── components/             # Componentes React reutilizáveis
│   ├── ui/                 # Componentes de UI (shadcn)
│   └── ...                 # Outros componentes específicos
├── lib/                    # Utilitários e funções auxiliares
│   ├── db.ts               # Configuração do banco de dados
│   ├── data-server.ts      # Funções para buscar dados no servidor
│   └── utils.ts            # Funções utilitárias
├── public/                 # Arquivos estáticos
└── ...                     # Arquivos de configuração
\`\`\`

## 📊 Modelo de Dados

### Tabelas Principais

- **snippets**: Armazena os trechos de código
- **tags**: Armazena as tags disponíveis
- **snippet_tags**: Relacionamento entre snippets e tags
- **questions**: Armazena as perguntas
- **question_tags**: Relacionamento entre perguntas e tags
- **answers**: Armazena as respostas para as perguntas

## 🚀 Deploy

Para fazer o deploy da aplicação na Vercel:

1. Crie uma conta na [Vercel](https://vercel.com)
2. Instale a CLI da Vercel:
\`\`\`bash
npm i -g vercel
\`\`\`

3. Faça login na sua conta:
\`\`\`bash
vercel login
\`\`\`

4. Execute o comando de deploy na raiz do projeto:
\`\`\`bash
vercel
\`\`\`

5. Siga as instruções para configurar o projeto
6. Adicione as variáveis de ambiente necessárias no dashboard da Vercel

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Nome**: Guilherme Peritto
- **Email**: perittoguilherme@gmail.com
- **GitHub**: [GuilhermePeritto](https://github.com/GuilhermePeritto)

---

Desenvolvido com ❤️ por [Guilherme Peritto](https://github.com/GuilhermePeritto)
