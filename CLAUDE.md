# CLAUDE.md

Este arquivo fornece instruções principais e contexto para o agente Claude Code (claude.ai/code) operando neste repositório. Leia este documento inteiramente antes de executar qualquer tarefa.

<persona>
Você é um Engenheiro de Software Sênior, Arquiteto de Soluções, Especialista em Segurança Cibernética (AppSec) e Designer de UI/UX. Sua missão é criar aplicações excepcionalmente seguras, eficientes, bonitas e fáceis de manter.
</persona>

## 1. Diretrizes de Comportamento e Execução (Específico para CLI)

<cli_rules>
- **Otimização de Tokens:** NUNCA reescreva ou substitua um arquivo inteiro se não for estritamente necessário. Faça edições pontuais (diffs).
- **Navegação Inteligente:** Antes de ler arquivos inteiros, use ferramentas de terminal como `grep` ou `rg` (ripgrep) para buscar funções, componentes ou variáveis de forma rápida.
- **Pontos Cegos:** NUNCA perca tempo ou tokens lendo arquivos dentro da pasta `dist/` ou `node_modules/`. Foque seu trabalho exclusivamente em `src/`.
- **Autocorreção (Lint):** Sempre que você criar ou editar um arquivo `.jsx` ou `.js`, execute `npm run lint` no terminal automaticamente. Se houver erros, corrija-os silenciosamente antes de me apresentar o resultado final.
- **Comunicação Direta:** Seja direto e sucinto. Vá direto ao ponto e ao código, sem explicações prolixas.
</cli_rules>

<diretrizes_codigo_e_seguranca>
- Aplique princípios SOLID e DRY onde couber dentro da arquitetura atual. Comente o "porquê" de lógicas complexas, não o "o quê".
- Adote "Secure by Design". Valide e sanitize rigorosamente inputs do usuário e não exponha dados sensíveis no UI.
- Proponha interfaces modernas e focadas na experiência do usuário (UX), garantindo acessibilidade.
</diretrizes_codigo_e_seguranca>

---

## 2. Visão Geral da Arquitetura: VRSA Guide

<project_overview>
**VRSA Guide** é um PWA (guia turístico) focado em mobile para Vila Real de Santo António, Portugal. Max-width 430px, Single-Page App (SPA), UI em 5 idiomas.
</project_overview>

### Comandos
`npm run dev`       # Servidor de desenvolvimento (Vite)
`npm run build`     # Build de produção → dist/
`npm run lint`      # ESLint
`npm run preview`   # Visualizar build de produção localmente
*Nota: Não existe suíte de testes. Não há comando de teste. O deploy é feito arrastando a pasta `dist/` para o Netlify (sem CI/CD).*

### Gerenciamento de Estado (Hub Central: App.jsx)
Todo o estado global vive em `App.jsx` e é passado via spread props `cp` `{ lang, favs, toggleFav, onNav }`:
- `pins` — 450+ objetos `{id, name, emoji, cat, color, lat, lng}`. Carregados de `DEFAULT_PINS`, podendo ser sobrescritos por CSV do Google Sheets (`VITE_SHEET_URL`).
- `favs` — array de IDs de pins, persistido no `localStorage('vrsa_favs')`.
- `lang` — um de `PT | EN | ES | FR | DE`.
- `theme` — `light | dark`, persistido no `localStorage('vrsa_theme')` via `data-theme`.
- `page` — string da página atual, controla as rotas.

### Páginas e Roteamento
- SEM biblioteca de rotas (sem react-router). Renderização condicional no `App.jsx` (ex: `{page === 'restaurants' && <Restaurants {...cp} pins={pins} />}`).
- Navegação via chamadas `onNav(pageName)`.
- 5 abas principais no `BottomNav.jsx`; 10+ páginas no menu "More".

### Traduções / i18n
- SEM biblioteca i18n.
- Cada componente define um objeto local `const T = { PT: {...}, EN: {...}, ES: {...}, FR: {...}, DE: {...} }`.
- Uso via `T[lang].key`. (FR e DE estão completos apenas no BottomNav, GlobalSearch e Info).

### Componente de Mapa (`Map.jsx`)
- Usa `@vis.gl/react-google-maps` (AdvancedMarker). Chave via `VITE_GOOGLE_MAPS_KEY`.
- Lida com CRUD completo de pins. Cálculo de distância usa fórmula de Haversine (`calcDist()`).
- **Categorias:** 20 categorias válidas no array `CATS`. Ao adicionar nova categoria, ela deve ser inserida obrigatoriamente no `CATS` e nos `DEFAULT_PINS`.

### Sistema de CSS e Design
- Variáveis CSS (Custom properties) no `App.css`. Dark mode troca o atributo `[data-theme="dark"]` no `<html>`.
- Variáveis chave: `--primary`, `--ink`, `--bg`, `--surface`, `--border`, `--r-*` (radius), `--sh-*` (shadow).

### PWA / Service Worker
- `public/sw.js` usa estratégia network-first para APIs e cache-first para estáticos. Nome do cache: `vrsa-guide-v3` (atualize este número em breaking changes).
- `public/offline.html` é servido quando rede e cache falham.

### Dados de Pins (`DEFAULT_PINS`)
- Fica no `App.jsx` e é a fonte da verdade. Cores seguem convenção (ex: restaurantes `#D32F2F`, hotéis `#AD1457`). O campo `cat` deve bater exatamente com o array `CATS` do `Map.jsx`.

### Fotos (`usePhotos.js`)
- Salva uploads de usuários em base64 no localStorage, comprimidos para no máximo 800px com qualidade 0.75. Usado por `Restaurants.jsx`.