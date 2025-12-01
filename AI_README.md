# Assistente IA — Instruções

Este projeto inclui um componente `AIReportAssistant` (frontend) e um pequeno proxy Node em `server/index.js` para manter sua chave de API privada.

Por segurança, NÃO commit sua chave no repositório.

1) Defina a variável de ambiente no seu ambiente local (PowerShell):

```powershell
$env:GEMINI_API_KEY = 'SUA_CHAVE_AQUI'
# opcional: force o uso da API real
$env:USE_REAL_GEMINI = '1'
```

2) Inicie o proxy (em uma janela de terminal separada):

```powershell
pnpm run serve-api
```

O proxy roda por padrão em `http://localhost:5178` e expõe `POST /api/generate`.

3) Inicie o frontend (em outro terminal):

```powershell
pnpm dev
```

4) No app, abra `Assistente IA` no menu lateral e selecione uma auditoria.

Segurança:
- Idealmente crie um backend autenticado (serverless ou servidor) que valide usuários antes de encaminhar solicitações para a API de IA.
- Nunca exponha chaves em código cliente (`VITE_...`) em ambientes de produção.

Observações técnicas:
- O proxy já suporta um modo "mock" (quando `GEMINI_API_KEY` não está definido), útil para desenvolvimento offline.
- Dependendo da versão da API Generativa do Google, o formato do request/response pode precisar ser ajustado no `server/index.js`.
