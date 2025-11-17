# Regras de Desenvolvimento e Stack Tecnológico

Este documento define a pilha de tecnologia (tech stack) e as regras de codificação a serem seguidas para garantir a manutenibilidade, consistência e qualidade do aplicativo GestAudit.

## 1. Resumo da Pilha de Tecnologia

*   **Framework:** React (utilizando TypeScript, Componentes Funcionais e Hooks).
*   **Linguagem:** TypeScript (obrigatório para todos os arquivos de código-fonte).
*   **Estilização:** Tailwind CSS (abordagem utility-first).
*   **Componentes UI:** `shadcn/ui` (biblioteca de componentes preferencial).
*   **Ícones:** `lucide-react` (biblioteca de ícones padrão).
*   **Persistência de Dados:** Supabase (utilizado através da camada de abstração em `supabase-database.ts`).
*   **Gráficos:** `recharts` (para visualização de dados no Dashboard e Relatórios).
*   **Estrutura de Arquivos:** Componentes em `src/components/` e Views/Páginas em `src/pages/`.
*   **Roteamento:** Roteamento baseado em estado, gerenciado centralmente em `App.tsx`.

## 2. Regras de Uso de Bibliotecas e Componentes

### 2.1. Estrutura e Componentização
1.  **Componentes:** Cada novo componente ou hook deve residir em seu próprio arquivo dentro de `src/components/`.
2.  **Tamanho de Arquivo:** Priorize componentes pequenos e focados (idealmente abaixo de 100 linhas de código).
3.  **Páginas:** As rotas principais são definidas e renderizadas em `App.tsx`. As visualizações principais devem estar em `src/pages/` (embora atualmente estejam em `src/components/`, o padrão é manter as views principais separadas).

### 2.2. UI e Estilização
1.  **Estilo:** Use exclusivamente classes do Tailwind CSS para layout, cores, espaçamento e responsividade.
2.  **Componentes UI:** Utilize os componentes do `shadcn/ui` sempre que possível (ex: Button, Dialog, Card, etc.). Se um componente necessário não estiver disponível ou precisar de customização profunda, crie um novo componente.
3.  **Modais:** Use o componente `components/Modal.tsx` existente para todas as janelas modais.
4.  **Ícones:** Importe novos ícones da biblioteca `lucide-react`.

### 2.3. Dados e Backend
1.  **Acesso a Dados:** Todas as operações CRUD (salvar, carregar, deletar) devem ser realizadas através das funções exportadas em `supabase-database.ts`.
2.  **Lógica de Negócio:** A lógica de cálculo (ex: `calculateRiskLevel`) deve residir na camada de dados (`supabase-database.ts`) ou em utilitários, e não diretamente nos componentes de UI.
3.  **Erros:** Não utilize blocos `try/catch` a menos que seja estritamente necessário para a experiência do usuário (ex: mostrar um toast). Deixe os erros serem lançados para que possam ser rastreados.

### 2.4. Boas Práticas Gerais
1.  **TypeScript:** Tipagem explícita é obrigatória para props, estados e retornos de funções complexas.
2.  **Responsividade:** Todos os novos designs e componentes devem ser responsivos por padrão.
3.  **Simplicidade:** Mantenha o código simples e elegante. Evite super-engenharia.