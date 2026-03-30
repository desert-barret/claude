# Claude Code Academy

Manual interactivo para aprender Claude Code desde cero hasta nivel avanzado.

## Stack

- Vue 3 (Composition API, `<script setup>`)
- Vite 4 + vitejs/plugin-vue
- Vue Router 4 (hash history — `createWebHashHistory`)
- Pinia (stores)
- TailwindCSS 3 (`darkMode: 'class'`)
- Node 18 / npm

## Comandos

```bash
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # sirve dist/
```

## Estructura

```
src/
├── App.vue                          # Root — solo <RouterView />
├── main.js                          # createApp + Pinia + Router
├── style.css                        # Tailwind directives + componentes globales
├── router/index.js                  # 6 rutas lazy-loaded con hash history
├── composables/
│   └── useTheme.js                  # Toggle dark/light — persiste en localStorage
├── store/
│   ├── progress.js                  # Estados unseen/in_progress/completed, quiz, niveles
│   └── docs.js                      # Búsqueda y lookup de comandos/secciones
├── data/
│   ├── commands.js                  # 12 comandos con ejemplos, tips, errores, sintaxis
│   └── sections.js                  # 6 secciones con 14 preguntas de quiz
├── utils/
│   ├── storage.js                   # Wrapper localStorage (get/set/remove + JSON)
│   └── tokenizer.js                 # estimateTokens, analyzePrompt, PROMPT_EXAMPLES
├── components/
│   ├── layout/
│   │   ├── AppLayout.vue            # Wrapper: Sidebar + Topbar + <slot>
│   │   ├── Sidebar.vue              # Nav fija izquierda con progreso
│   │   └── Topbar.vue               # Búsqueda + stats + toggle tema
│   ├── docs/
│   │   ├── CommandBlock.vue         # Bloque de código con syntax highlight + copy
│   │   ├── DocSection.vue           # Card de sección con comandos y botón quiz
│   │   └── ProgressBadge.vue        # Badge unseen / in_progress / completed
│   └── interactive/
│       ├── TerminalSimulator.vue    # Terminal interactiva con comandos simulados
│       └── QuizBlock.vue            # Quiz multiopción con validación y score
└── pages/
    ├── Home.vue                     # Dashboard: stats, progreso, accesos rápidos
    ├── Docs.vue                     # Navegación de secciones + DocSection
    ├── CommandDetail.vue            # Detalle completo de un comando
    ├── Terminal.vue                 # Página del simulador de terminal
    ├── Quiz.vue                     # Quiz por sección con resultado persistido
    └── Progress.vue                 # Progreso global + analizador de tokens
```

## Rutas

| Path | Nombre | Componente |
|------|--------|------------|
| `/` | home | Home.vue |
| `/docs` | docs | Docs.vue |
| `/docs/:slug` | command-detail | CommandDetail.vue |
| `/terminal` | terminal | Terminal.vue |
| `/quiz/:sectionId` | quiz | Quiz.vue |
| `/progress` | progress | Progress.vue |

## Sistema de temas

- Tailwind `darkMode: 'class'` — la clase `dark` se aplica en `<html>`
- `useTheme.js` se importa como módulo singleton: inicializa el tema al importarse
- Por defecto: dark (a menos que `localStorage.theme === 'light'`)
- Toggle: botón ☀️/🌙 en Topbar
- El terminal siempre es oscuro (inline styles `#0d1117`) — diseño intencional

## Convenciones de código

- **Componentes**: `<script setup>` siempre. Sin Options API.
- **Clases CSS**: light por defecto → `dark:` override. Nunca hardcodear solo dark.
  - Superficie: `bg-white dark:bg-gray-900/50`
  - Borde: `border-gray-200 dark:border-gray-800`
  - Texto: `text-gray-900 dark:text-gray-100`
- **Clases reutilizables** (definidas en `style.css`): `.btn-primary`, `.btn-secondary`, `.nav-item`, `.nav-item.active`, `.badge-basic/intermediate/advanced`, `.progress-bar`, `.progress-fill`
- **Persistencia**: siempre via `storage.js`, nunca `localStorage` directo en componentes
- **No hay backend** — todo es localStorage + estado reactivo de Pinia

## Stores

### progress.js
- `getCommandState(id)` → `'unseen' | 'in_progress' | 'completed'`
- `markInProgress(id)` — se llama en `onMounted` de CommandDetail
- `markCompleted(id)` — se llama al hacer clic en "Marcar completado"
- `saveQuizResult(sectionId, answers, score)` — si score ≥ 70 completa la sección
- `isLevelUnlocked(level)` → boolean
- Nivel 2 se desbloquea con 2+ secciones completadas; nivel 3 con 4+

### docs.js
- `getCommand(slug)` — busca por `slug` en el array de commands
- `getSection(id)` — busca por `id` en el array de sections
- `filteredCommands` — computed que filtra por `searchQuery` y `activeCategory`

## Datos (data/)

### commands.js
Cada comando tiene: `id, slug, name, category, level, icon, description, syntax, longDescription, examples[], useCases[], commonErrors[], tokenTips[], relatedCommands[]`

Categorías: `setup | context | workflow | advanced | optimization`
Niveles: `basic | intermediate | advanced`

### sections.js
Cada sección tiene: `id, title, icon, description, level (1|2|3), commands[], quiz[]`
Cada pregunta del quiz: `id, question, options[], correct (índice), explanation`

## Extensión del contenido

Para agregar un comando nuevo:
1. Agregar objeto en `src/data/commands.js` con todos los campos requeridos
2. Agregar el `id` del comando en el array `commands[]` de la sección correspondiente en `src/data/sections.js`
3. El routing y la UI son dinámicos — no requiere cambios adicionales

Para agregar una sección nueva:
1. Agregar objeto en `src/data/sections.js`
2. Si es nivel 2 o 3, verificar la lógica de desbloqueo en `progress.js`
