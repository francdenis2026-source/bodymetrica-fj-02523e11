# Body Metrics Hub

Crie um aplicativo web/PWA profissional chamado Body Métrica FJ, uma suíte completa para acompanhamento de composição corporal, alimentação, hidratação, suplementação, treinos e evolução física.

O sistema deve atender pessoas com objetivos como:

Emagrecimento;

Hipertrofia e ganho de massa muscular;

Melhoria da resistência;

Condicionamento físico;

Manutenção do peso;

Recomposição corporal;

Melhoria de hábitos e qualidade de vida.

Não crie apenas uma interface demonstrativa. Implemente uma aplicação funcional, escalável, responsiva e preparada para receber posteriormente um Supabase externo.

1. Direção visual

Crie uma identidade visual sofisticada, moderna, esportiva e confiável.

Use:

Interface mobile-first;

Layout compacto, sem espaços vazios excessivos;

Tipografia moderna e altamente legível;

Cards bem organizados;

Gráficos profissionais;

Microinterações suaves;

Ícones consistentes;

Excelente contraste;

Modo claro e escuro;

Estados de carregamento, sucesso, erro e ausência de dados;

Navegação inferior no celular;

Menu lateral recolhível no desktop.

Paleta sugerida:

Azul-petróleo ou azul profundo como cor principal;

Verde vibrante para metas concluídas e evolução;

Laranja controlado para alertas e lembretes;

Vermelho apenas para riscos ou ações destrutivas;

Tons neutros claros e escuros para fundos e superfícies.

Não use uma hero enorme. A página inicial deve ser objetiva e profissional, apresentando rapidamente os benefícios do Body Métrica FJ.

Adicione um botão discreto “Entrar” no canto superior direito. No celular, ele deve continuar visível sem ocupar espaço excessivo.

Não utilize depoimentos, números inventados ou prova social falsa.

2. Perfis e permissões

Implemente três níveis de acesso:

Visitante

Pode:

Conhecer as ferramentas;

Visualizar os benefícios;

Criar uma conta;

Acessar o login;

Ler políticas e orientações de segurança.

Cliente

Cada cliente terá um painel individual e isolado, podendo:

Editar seus dados;

Adicionar foto de perfil;

Registrar peso e medidas;

Adicionar fotos privadas de evolução;

Acompanhar metas;

Controlar água;

Organizar suplementos;

Registrar alimentação;

Criar planos de refeições;

Registrar treinos;

Receber lembretes;

Consultar gráficos e relatórios.

Administrador

O administrador terá um hub separado para:

Visualizar e gerenciar clientes;

Ativar, suspender ou arquivar contas;

Consultar cadastros e últimos acessos;

Gerenciar objetivos disponíveis;

Gerenciar alimentos, receitas e substituições;

Gerenciar suplementos e protocolos;

Configurar limites seguros;

Gerenciar exercícios e modelos de treino;

Criar avisos e notificações;

Acompanhar adesão geral sem expor informações desnecessárias;

Consultar logs administrativos;

Exportar relatórios;

Gerenciar permissões e configurações do sistema.

Dados sensíveis de saúde devem aparecer ao administrador somente quando necessários e conforme a autorização do usuário.

3. Cadastro e autenticação

A experiência visual de login deverá utilizar:

CPF;

Senha ou PIN numérico de seis dígitos.

O CPF deve:

Ser formatado automaticamente;

Ter os dígitos verificadores validados;

Ser normalizado antes do armazenamento;

Ser único;

Nunca aparecer integralmente em listas administrativas;

Ser exibido mascarado, por exemplo: ***.***.***-68.

A validação matemática do CPF não comprova a identidade do titular. Para confirmação de titularidade, prepare o fluxo para verificação por código enviado ao telefone ou e-mail.

Como uma senha de apenas seis dígitos possui baixa segurança, implemente obrigatoriamente:

Limite de tentativas;

Bloqueio temporário;

CAPTCHA após tentativas suspeitas;

Registro de acessos;

Verificação adicional em dispositivo novo;

Recuperação por e-mail ou telefone verificado;

Troca obrigatória da senha inicial;

Mensagens genéricas que não revelem se determinado CPF está cadastrado.

Nunca salve senhas diretamente no banco, em componentes, migrations, arquivos JSON ou código-fonte.

4. Provisionamento dos acessos iniciais

Deixe preparado um fluxo seguro de provisionamento para:

Primeiro cliente;

Primeiro administrador.

Essas contas deverão ser criadas somente depois da conexão com o Supabase externo, por uma função protegida ou script executado no servidor.

As informações deverão entrar por variáveis de ambiente privadas:

INITIAL_CLIENT_NAME

INITIAL_CLIENT_CPF

INITIAL_CLIENT_TEMP_PIN

INITIAL_ADMIN_EMAIL

INITIAL_ADMIN_TEMP_PASSWORD

Regras obrigatórias:

Não colocar CPF ou senhas reais no repositório;

Não inserir senhas diretamente por migration SQL;

Não enviar a service role key para o frontend;

Marcar as duas contas para troca obrigatória da senha no primeiro acesso;

Desativar o provisionamento após a primeira execução;

Registrar a operação em log de auditoria.

O administrador deverá entrar por uma rota própria, como /admin/login. Não colocar um botão chamativo de administrador na página pública. O acesso poderá aparecer discretamente no rodapé como “Área administrativa”.

5. Onboarding personalizado

Após o primeiro acesso, apresente um onboarding em etapas curtas:

Nome e foto;

Data de nascimento;

Altura;

Peso atual;

Objetivo principal;

Meta de peso;

Nível de atividade;

Experiência com treino;

Preferências alimentares;

Restrições, intolerâncias e alergias;

Suplementos utilizados;

Horários preferidos para lembretes;

Consentimento e privacidade.

Inclua uma etapa de segurança perguntando sobre condições especiais, uso de medicamentos, gestação, amamentação ou acompanhamento médico. Quando houver risco, o sistema deve recomendar avaliação profissional, sem emitir diagnóstico.

6. Painel principal do cliente

O dashboard deve mostrar apenas as informações mais importantes:

Saudação personalizada;

Objetivo atual;

Peso atual e variação;

Progresso da meta;

Água consumida;

Próxima refeição;

Próximo suplemento;

Treino do dia;

Sequência de hábitos;

Alertas;

Atalhos para adicionar registro.

Inclua um botão flutuante “Registrar”, abrindo ações rápidas:

Peso;

Medida;

Água;

Refeição;

Suplemento;

Treino;

Foto de evolução.

7. Peso e medidas corporais

Crie uma central completa para registrar:

Peso;

Percentual de gordura;

Massa muscular;

Cintura;

Abdômen;

Quadril;

Peitoral;

Braço direito e esquerdo;

Antebraço;

Coxa direita e esquerda;

Panturrilha;

Pescoço;

Outras medidas personalizadas.

Cada registro deve conter:

Data e horário;

Valor;

Observação;

Origem manual ou dispositivo;

Foto opcional.

Apresente:

Gráfico por período;

Comparação entre datas;

Variação absoluta e percentual;

Média semanal;

Tendência;

Progresso até a meta;

Linha do tempo;

Relatório mensal.

Não trate IMC isoladamente como diagnóstico. Quando utilizado, apresente-o apenas como referência geral.

8. Fotos de evolução

Implemente um espaço privado para fotos:

Frente;

Perfil;

Costas;

Foto livre.

Recursos:

Comparação lado a lado;

Controle deslizante “antes e depois”;

Filtro por data;

Marcações opcionais;

Exclusão segura;

Download dos próprios dados.

As fotos devem ser privadas por padrão, armazenadas em bucket protegido e acessadas por URLs temporárias.

9. Controle de água

Crie um módulo de hidratação com:

Meta diária personalizada;

Copos ou recipientes configuráveis;

Registro rápido;

Histórico;

Progresso circular;

Lembretes;

Ajuste manual da meta;

Sequência de dias;

Resumo semanal.

A meta sugerida poderá considerar peso, atividade e clima, mas deve ser apresentada como estimativa ajustável, não como prescrição médica.

Evite incentivar consumo excessivo. Exiba alertas quando a quantidade registrada for muito elevada em um intervalo curto.

10. Suplementação

Crie uma central de suplementos organizada por:

Nome;

Categoria;

Marca opcional;

Apresentação;

Unidade;

Quantidade por porção;

Horários;

Frequência;

Estoque;

Data de início;

Data de término;

Observações;

Objetivo relacionado.

Categorias iniciais:

Whey protein;

Creatina;

Pré-treino;

Maca peruana;

Vitaminas;

Minerais;

Ômega 3;

Carboidratos;

Eletrólitos;

Outros.

O usuário deverá registrar o que efetivamente consumiu. O sistema deve mostrar:

Consumo planejado;

Consumo realizado;

Próxima dose;

Adesão semanal;

Estoque restante;

Previsão de término;

Aviso para reposição;

Evolução relacionada ao objetivo.

Cálculos automáticos devem usar protocolos versionados, configurados pelo administrador, com fonte, data de revisão, unidade, limites e contraindicações.

Não recomendar automaticamente doses terapêuticas de vitaminas, estimulantes ou substâncias que dependam de avaliação clínica. Não ultrapassar limites configurados. Havendo conflito, medicamento, condição de saúde ou valor inseguro, interromper a recomendação e orientar avaliação profissional.

Para whey, o sistema pode estimar a quantidade necessária para completar a meta diária de proteína depois de considerar a proteína registrada na alimentação. Não deve tratar whey como obrigatório.

11. Alimentação e refeições

Crie uma ferramenta poderosa de planejamento alimentar baseada em:

Objetivo;

Peso;

Altura;

Idade;

Nível de atividade;

Preferências;

Restrições;

Alergias;

Quantidade de refeições;

Horários;

Orçamento;

Alimentos disponíveis;

Região do usuário.

Utilize estimativas reconhecidas de gasto energético, deixando claro que são aproximações. Permita ajuste manual por profissional ou administrador autorizado.

O planejador deverá gerar:

Meta calórica estimada;

Distribuição de macronutrientes;

Refeições em horários definidos;

Quantidades em gramas e medidas caseiras;

Total nutricional;

Lista de compras;

Sugestões de substituição;

Receitas;

Alternativas econômicas;

Opções com alimentos brasileiros e regionais;

Plano semanal.

Cada refeição deve permitir:

Confirmar consumo;

Alterar porções;

Substituir alimentos;

Registrar foto;

Adicionar observação;

Salvar como favorita;

Copiar para outro dia.

Alergias devem ser tratadas como bloqueios rígidos. Um alimento incompatível nunca deve ser sugerido silenciosamente.

12. Treinos e desempenho

Inclua um módulo de treinamento para relacionar o progresso corporal ao desempenho:

Fichas de treino;

Divisão por grupos musculares;

Exercícios;

Séries;

Repetições;

Carga;

Descanso;

RPE ou RIR;

Observações;

Duração;

Recordes pessoais;

Histórico.

O sistema deve apresentar evolução de carga, volume de treino, frequência e consistência. Não sugerir progressões agressivas nem treinos incompatíveis com limitações informadas.

13. Metas, hábitos e notificações

Permita criar metas para:

Peso;

Medidas;

Água;

Alimentação;

Suplementos;

Treinos;

Sono;

Hábitos personalizados.

Implemente notificações configuráveis para:

Beber água;

Realizar refeições;

Tomar suplemento;

Registrar peso;

Fazer medições;

Iniciar treino;

Atualizar foto;

Repor suplemento;

Consultar relatório semanal.

O usuário deve controlar quais notificações deseja receber. Não use notificações excessivas, culpabilizantes ou invasivas.

14. Relatórios e evolução

Crie relatórios:

Diário;

Semanal;

Mensal;

Por período personalizado.

Os relatórios devem combinar:

Evolução do peso;

Medidas;

Fotos;

Hidratação;

Alimentação;

Suplementação;

Treinos;

Adesão;

Metas concluídas.

Apresente correlações apenas como observações, nunca como causalidade médica. Permita exportar o relatório em PDF e compartilhar somente mediante autorização explícita.

15. Hub administrativo

Crie um dashboard administrativo com:

Total de usuários ativos;

Novos cadastros;

Contas suspensas;

Engajamento por módulo;

Alertas técnicos;

Notificações pendentes;

Conteúdos que precisam de revisão;

Logs recentes.

Inclua áreas para:

Usuários;

Protocolos;

Suplementos;

Alimentos;

Receitas;

Exercícios;

Treinos;

Notificações;

Relatórios;

Configurações;

Auditoria.

Toda ação administrativa sensível deve exigir confirmação e gerar log com administrador, data, ação e entidade afetada.

16. Preparação para Supabase externo

Não conectar automaticamente a um Supabase criado pelo Lovable. O projeto utilizará um Supabase externo, conectado posteriormente.

Enquanto a conexão não existir:

Utilize dados fictícios claramente identificados;

Nunca utilize CPF, e-mail ou senha reais nos mocks;

Implemente uma camada de serviços desacoplada;

Separe interface, regras de negócio e acesso aos dados;

Não espalhe chamadas ao banco diretamente pelos componentes.

Prepare o projeto para receber:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

Chaves administrativas deverão existir somente no servidor ou em Edge Functions.

Prepare migrations e documentação para as principais tabelas:

profiles

user_roles

goals

body_records

body_measurements

progress_photos

water_goals

water_logs

supplements

supplement_protocols

user_supplements

supplement_logs

foods

recipes

meal_plans

meals

meal_items

exercises

workout_plans

workout_sessions

workout_sets

notifications

notification_preferences

consents

admin_audit_logs

Prepare políticas de Row Level Security para que:

O cliente acesse apenas os próprios dados;

Fotos privadas não sejam públicas;

Administradores tenham acesso somente conforme a função;

Alterações administrativas sejam auditadas;

Nenhuma tabela sensível fique aberta para acesso anônimo.

17. Privacidade e proteção de dados

Como o sistema tratará CPF, fotografias e dados relacionados à saúde, aplique princípios da LGPD:

Consentimento claro;

Finalidade definida;

Coleta mínima;

Dados mascarados;

Exportação dos próprios dados;

Correção de informações;

Solicitação de exclusão;

Política de retenção;

Logs de consentimento;

Revogação de permissões;

Exclusão definitiva ou anonimização quando aplicável.

Não exiba informações sensíveis em logs do navegador, URLs, mensagens de erro ou ferramentas de análise.

18. Qualidade e acessibilidade

Garanta:

Responsividade em celular, tablet e desktop;

PWA instalável;

Navegação por teclado;

Labels acessíveis;

Contraste adequado;

Áreas de toque com tamanho confortável;

Formulários com máscara e validação;

Salvamento seguro;

Confirmação antes de excluir;

Skeletons de carregamento;

Empty states úteis;

Tratamento de erros;

Testes dos cálculos;

Testes de autenticação e permissões;

Nenhum botão decorativo sem função.

19. Entregáveis

Ao finalizar, entregue:

Aplicação visualmente completa;

Rotas públicas, do cliente e administrativas;

Componentes reutilizáveis;

Dados fictícios para demonstração;

Camada preparada para Supabase externo;

Modelo de banco e migrations;

Políticas RLS;

Fluxo seguro de provisionamento inicial;

Documentação das variáveis de ambiente;

Lista das funcionalidades concluídas;

Lista do que dependerá da conexão posterior;

Testes principais executados;

Instruções para conectar o Supabase sem recriar a interface.

Antes de concluir, faça uma auditoria visual e funcional em todas as telas. Corrija inconsistências de espaçamento, tipografia, contraste, responsividade, formulários, cálculos, permissões e navegação. O resultado deve parecer um produto real, profissional e pronto para evolução, não um template genérico.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bodymetrica-fj.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b093d303-093a-49b7-9128-5905f8a86fea).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
