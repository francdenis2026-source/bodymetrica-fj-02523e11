# Plano de Implementação: Modo Offline, Exportação CSV e Gestão de Metas

Implementar funcionalidades avançadas de resiliência offline, exportação de dados flexível e um sistema centralizado de metas para o Body Métrica FJ.

## Ações Propostas

### 1. Suporte a Modo Offline e Sincronização
- **Estratégia de Cache**: Atualizar o `sw.js` para garantir que o shell do app e os recursos estáticos das páginas de registro (Nutrição, Treino, Evolução) sejam persistidos.
- **Persistência Local**: Expandir o `offline-sync.ts` para ler do IndexedDB quando estiver offline, permitindo visualizar os últimos registros carregados.
- **Fila de Background Sync**: Utilizar o `Background Sync API` (onde disponível) ou um mecanismo de retentativa na reidratação para processar a fila do IndexedDB.

### 2. Exportação de Dados em CSV
- **Utilitário de Exportação**: Criar `src/lib/export.ts` com funções para converter dados de evolução (peso/medidas) e hidratação para formato CSV.
- **Interface de Download**: Adicionar opções de exportação CSV nas telas de Dashboard e Evolução Física, ao lado da opção de PDF.

### 3. Central de Metas e Progresso
- **Nova Tela de Metas**: Criar `src/routes/goals/index.tsx` para visualização unificada de metas de peso, medidas, hidratação e macros.
- **Indicadores Visuais**: Implementar barras de progresso com percentuais, status (Em dia, Atrasado, Concluído) e projeções.
- **Configuração de Metas**: Adicionar formulário para definição de metas personalizadas.

### 4. Gestão de Treinos e Nutrição
- **Registro de Treinos**: Refatorar `src/routes/training/index.tsx` para permitir o cadastro de novos exercícios, séries e repetições, com histórico persistente.
- **Calculadora Nutricional**: Aprimorar o diário em `src/routes/nutrition/index.tsx` com cálculo automático de macros baseado na seleção de alimentos e histórico diário.

## Detalhes Técnicos

### Estrutura de Dados
- Utilização de `tanstack-query` com `persistQueryClient` para persistência automática de estado do servidor em cache local (localStorage/IndexedDB).
- Extensão do esquema do banco de dados (via migrações Supabase) para suportar a tabela de `user_goals` e `training_logs`.

### Componentes UI
- Utilização de `Recharts` para visualização de progresso nas metas.
- Novos componentes de formulário dinâmico para adição de exercícios e refeições.

### Segurança e Performance
- Validação Zod em todos os inputs de metas e registros.
- Otimização do Service Worker para evitar "stale state" durante atualizações de metas.
