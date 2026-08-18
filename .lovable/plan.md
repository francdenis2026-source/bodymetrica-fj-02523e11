# Plano de Redesenho da Homepage - Body Métrica FJ

Redesenhar a homepage para um visual mais profissional, focado em alta performance, com novos elementos visuais, heros aprimorados e otimização de cores e contrastes, mantendo a experiência de "tela única" (fold) e alta densidade de informação.

## Alterações Visuais e Design

- **Nova Estética Profissional:** Transição de um visual genérico para um design de "Software de Alta Performance" com texturas de carbono, vidros foscos (glassmorphism) e tipografia ultra-refinada.
- **Hero Aprimorado:** Substituição da imagem atual por uma composição mais dinâmica e profissional.
- **Cores e Contrastes:** Ajuste fino nas variáveis de cor OKLCH no `src/styles.css` para garantir legibilidade máxima e um visual "Deep Night" mais coeso.
- **Novos Elementos 3D e Ícones:** Integração de elementos visuais que remetam à biometria e engenharia corporal.

## Technical Details

- **`src/routes/index.tsx`**: Reformulação completa do layout Hero e Features. Uso de animações mais suaves (framer-motion-like via Tailwind v4).
- **`src/styles.css`**: Refinamento das variáveis de tema e adição de utilitários de design (efeitos de borda brilhante, gradientes complexos).
- **Otimização de Assets**: Uso de imagens de alta qualidade com `fetchPriority` e dimensionamento correto para evitar CLS.

## User Review Required

- **Preferência de Imagem:** Manteremos imagens de atletas de alta performance ou prefere algo focado em tecnologia/biometria?
- **Densidade de Informação:** O layout atual compacto agrada ou prefere mais espaço entre os elementos mesmo que exija scroll?
