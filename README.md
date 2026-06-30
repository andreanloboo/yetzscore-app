# YetzScore — Fluxo Gerente de Negócios

Implementação das telas do fluxo **Gerente de Negócios** do Figma [YetzScore Rebranding](https://www.figma.com/design/bu9L5wRxqKz0yZjnIy9sOb/YetzScore?node-id=7929-29916).

## Telas

- **Login** (`/login`) — entrar leva ao gerenciamento de campanhas
- **Gerenciamento de campanhas** (`/campanhas`) — busca, chips, filtros (tipo, status, período com calendário), cards e paginação
- **Gerenciamento de contratos** (`/contratos`) — tabelas de contratos, seleção múltipla, aprovar/reprovar/desvincular com modais de confirmação, detalhes do contrato, gerenciar colunas, filtro por gerente e menu do usuário
- **admscore — Login** (`/admscore/login`) — acesso administrativo (fundo verde, card flutuante), login por CPF, estados de dados inválidos, bloqueio temporário/definitivo e verificação 2FA por código enviado ao e-mail

## Stack

Vite + React 18 + TypeScript + Tailwind CSS v4 + React Router.

## Rodando

```bash
npm install
npm run dev
```

Os arquivos em `design-refs/` são o código de referência gerado pelo Figma MCP usado durante o desenvolvimento.
