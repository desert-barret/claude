export const commands = [
  {
    id: 'init',
    slug: 'init',
    name: '/init',
    category: 'setup',
    level: 'basic',
    icon: '🚀',
    description: 'Inicializa Claude Code en un proyecto existente. Analiza el codebase y crea un archivo CLAUDE.md con contexto del proyecto.',
    syntax: 'claude /init',
    longDescription: 'El comando /init es el punto de entrada para cualquier proyecto nuevo. Claude analiza la estructura de archivos, lee el README, examina el package.json o equivalente, y genera un CLAUDE.md con instrucciones persistentes para el proyecto.',
    examples: [
      {
        title: 'Inicialización básica',
        code: '$ claude\n> /init\n\nAnalyzing project structure...\n✓ Found: package.json, README.md, src/\n✓ Detected: Node.js + Vue 3 project\n✓ Created: CLAUDE.md\n\nCLAUDE.md includes:\n- Project overview\n- Tech stack\n- Key directories\n- Development commands',
        description: 'Ejecutado en la raíz del proyecto'
      },
      {
        title: 'Verificar el resultado',
        code: '$ cat CLAUDE.md\n\n# Project: my-app\n## Tech Stack\n- Vue 3 + Vite\n- Node 18\n\n## Commands\n- npm run dev\n- npm test\n\n## Notes\n- Main entry: src/main.js',
        description: 'El archivo generado persiste entre sesiones'
      }
    ],
    useCases: [
      'Al comenzar a trabajar en un proyecto nuevo',
      'Cuando Claude no tiene contexto del proyecto',
      'Para establecer convenciones y preferencias permanentes',
      'Antes de sesiones largas de desarrollo'
    ],
    commonErrors: [
      { error: 'CLAUDE.md already exists', fix: 'Usa /init --force para regenerar' },
      { error: 'Permission denied', fix: 'Verifica permisos de escritura en el directorio raíz' }
    ],
    tokenTips: [
      'Un buen CLAUDE.md reduce tokens en cada conversación al dar contexto sin repetirlo',
      'Mantén CLAUDE.md conciso — máximo 50 líneas de contexto real',
      'Incluye solo lo que cambia el comportamiento de Claude, no documentación general'
    ],
    relatedCommands: ['memory', 'compact', 'clear']
  },
  {
    id: 'help',
    slug: 'help',
    name: '/help',
    category: 'setup',
    level: 'basic',
    icon: '❓',
    description: 'Muestra todos los comandos disponibles y su documentación básica.',
    syntax: 'claude /help [comando]',
    longDescription: 'Comando de referencia rápida. Sin argumentos lista todos los slash commands. Con un comando específico muestra detalles de ese comando.',
    examples: [
      {
        title: 'Listar todos los comandos',
        code: '$ claude\n> /help\n\nAvailable commands:\n  /init      Initialize project\n  /clear     Clear context\n  /compact   Compress context\n  /memory    Manage memory\n  /review    Review changes\n  ...',
        description: 'Vista general de comandos disponibles'
      }
    ],
    useCases: ['Descubrir comandos disponibles', 'Referencia rápida de sintaxis'],
    commonErrors: [],
    tokenTips: ['Úsalo para aprender, no como flujo de trabajo habitual'],
    relatedCommands: ['init']
  },
  {
    id: 'clear',
    slug: 'clear',
    name: '/clear',
    category: 'context',
    level: 'basic',
    icon: '🗑️',
    description: 'Limpia el contexto de la conversación actual. Útil cuando la sesión se vuelve larga o confusa.',
    syntax: 'claude /clear',
    longDescription: 'Reinicia el estado de la conversación. Claude olvida todo lo discutido en la sesión actual pero mantiene los archivos de memoria persistente (CLAUDE.md y ~/.claude/memory).',
    examples: [
      {
        title: 'Limpiar sesión larga',
        code: '$ claude\n> /clear\n\n✓ Context cleared\n  Conversation history: deleted\n  CLAUDE.md: preserved\n  Memory files: preserved\n\nReady for new session.',
        description: 'Útil cuando hay confusión de contexto'
      }
    ],
    useCases: [
      'Después de una sesión larga con muchos cambios',
      'Cuando Claude empieza a mezclar contextos',
      'Para empezar una tarea completamente nueva',
      'Para liberar tokens de contexto'
    ],
    commonErrors: [
      { error: 'Perdiste el historial de la sesión', fix: 'Usa /compact en lugar de /clear para comprimir sin perder' }
    ],
    tokenTips: [
      '/clear es gratuito en tokens — no consume nada',
      'Úsalo cuando el contexto supera 50k tokens para evitar degradación',
      'Combina con CLAUDE.md para mantener contexto importante sin costo'
    ],
    relatedCommands: ['compact', 'init', 'memory']
  },
  {
    id: 'compact',
    slug: 'compact',
    name: '/compact',
    category: 'context',
    level: 'intermediate',
    icon: '🗜️',
    description: 'Comprime el contexto de la conversación manteniendo lo esencial. Reduce tokens sin perder información clave.',
    syntax: 'claude /compact [--focus "tema específico"]',
    longDescription: 'Analiza la conversación actual y la resume de forma inteligente. Mantiene decisiones tomadas, código relevante y el estado actual del proyecto. Puede enfocarse en un tema específico con el flag --focus.',
    examples: [
      {
        title: 'Compresión estándar',
        code: '$ claude\n> /compact\n\nCompressing 15,234 tokens → 2,100 tokens\n\nSummary preserved:\n✓ Architecture decisions (3)\n✓ Code changes made (7 files)\n✓ Current task: implementing auth\n✓ Pending: tests for login flow',
        description: 'Reduce tokens manteniendo contexto relevante'
      },
      {
        title: 'Compresión enfocada',
        code: '$ claude\n> /compact --focus "authentication implementation"\n\nFocusing on: authentication\n✓ Kept: auth-related code and decisions\n✗ Removed: UI discussion, CSS changes\nResult: 1,240 tokens (↓87%)',
        description: 'Foco en un tema específico para máxima compresión'
      }
    ],
    useCases: [
      'Sesiones de trabajo largas (> 2 horas)',
      'Antes de abordar una nueva subtarea',
      'Cuando el contexto supera 60% de la ventana',
      'Para optimizar costo de API en proyectos grandes'
    ],
    commonErrors: [
      { error: 'Se pierde contexto importante', fix: 'Usa --focus para preservar el área que importa' },
      { error: 'La compresión tarda mucho', fix: 'Normal en sesiones > 20k tokens; espera unos segundos' }
    ],
    tokenTips: [
      '/compact puede reducir tokens en 80-90% en sesiones largas',
      'Úsalo antes de una nueva feature grande para partir con contexto limpio',
      'Con --focus obtienes máxima compresión sin perder lo relevante'
    ],
    relatedCommands: ['clear', 'memory', 'init']
  },
  {
    id: 'memory',
    slug: 'memory',
    name: '/memory',
    category: 'context',
    level: 'intermediate',
    icon: '🧠',
    description: 'Gestiona la memoria persistente de Claude. Permite guardar información que persiste entre sesiones.',
    syntax: 'claude /memory [add|remove|list|clear]',
    longDescription: 'El sistema de memoria permite a Claude recordar información entre conversaciones. Se guarda en ~/.claude/memory/ como archivos markdown. Es diferente a CLAUDE.md — la memoria es personal del usuario mientras CLAUDE.md es del proyecto.',
    examples: [
      {
        title: 'Agregar memoria',
        code: '$ claude\n> /memory add "Prefiero TypeScript strict mode en todos los proyectos"\n\n✓ Memory saved to ~/.claude/memory/preferences.md\n  Entry: "TypeScript strict mode preferred"',
        description: 'Persiste preferencias entre sesiones'
      },
      {
        title: 'Listar memorias',
        code: '$ claude\n> /memory list\n\nStored memories:\n  preferences.md\n    - TypeScript strict mode preferred\n    - Use pnpm over npm\n  project_patterns.md\n    - Always write tests before implementation',
        description: 'Ver todas las memorias guardadas'
      }
    ],
    useCases: [
      'Guardar preferencias de coding style',
      'Recordar contexto personal entre proyectos',
      'Patrones de trabajo habituales',
      'Configuraciones frecuentes'
    ],
    commonErrors: [
      { error: 'Memoria no se aplica', fix: 'Verifica con /memory list que esté guardada correctamente' }
    ],
    tokenTips: [
      'La memoria persistente evita repetir contexto en cada sesión',
      'Mantén memorias cortas y accionables, no documentación',
      'Revisa y limpia memorias obsoletas periódicamente'
    ],
    relatedCommands: ['init', 'clear', 'compact']
  },
  {
    id: 'review',
    slug: 'review',
    name: '/review',
    category: 'workflow',
    level: 'intermediate',
    icon: '🔍',
    description: 'Solicita a Claude que revise los cambios actuales antes de commitear. Actúa como code reviewer.',
    syntax: 'claude /review [--staged|--diff HEAD~1]',
    longDescription: 'Claude analiza los cambios pendientes o el diff especificado y proporciona feedback de code review: bugs potenciales, mejoras de código, violaciones de estilo, y sugerencias de optimización.',
    examples: [
      {
        title: 'Review de cambios staged',
        code: '$ claude\n> /review --staged\n\nReviewing staged changes...\n\n⚠️  src/auth.js:42\n   Possible null dereference: user.profile?.email\n   → Add null check before accessing\n\n✅ src/utils.js - Clean, follows patterns\n\n💡 Consider: Extract validation logic to separate function',
        description: 'Review antes de cada commit'
      }
    ],
    useCases: [
      'Antes de cada commit importante',
      'Code review self-service',
      'Detectar bugs antes de PR',
      'Verificar consistencia con el proyecto'
    ],
    commonErrors: [
      { error: 'No hay cambios para revisar', fix: 'Asegúrate de tener archivos modified o staged' }
    ],
    tokenTips: [
      'Más eficiente que pegar código manualmente para review',
      'Combina con /compact después para no saturar contexto con el diff'
    ],
    relatedCommands: ['compact', 'clear']
  },
  {
    id: 'agents',
    slug: 'agents',
    name: 'Agents (subagentes)',
    category: 'advanced',
    level: 'advanced',
    icon: '🤖',
    description: 'Claude puede lanzar subagentes para tareas paralelas o especializadas. Los agentes trabajan en contextos aislados.',
    syntax: 'Invocado automáticamente o con Agent tool en SDK',
    longDescription: 'El sistema de agentes permite a Claude delegar subtareas a instancias especializadas. Cada agente tiene su propio contexto, puede usar herramientas específicas, y reporta resultados al agente principal. Fundamental para tareas complejas de múltiples pasos.',
    examples: [
      {
        title: 'Agente de exploración',
        code: '// Claude decide lanzar un agente para explorar el codebase\nAgent: subagent_type="Explore"\nPrompt: "Find all API endpoints in src/"\n\n// El agente trabaja en paralelo\nResult: [\n  "GET /api/users - src/routes/users.js:12",\n  "POST /api/auth - src/routes/auth.js:8",\n  ...\n]',
        description: 'Agente de exploración para búsquedas profundas'
      },
      {
        title: 'Agente de planificación',
        code: '// Para tareas complejas, Claude usa Plan agent\nAgent: subagent_type="Plan"\nPrompt: "Design architecture for user auth system"\n\n// Retorna plan estructurado\nResult: Step-by-step implementation plan\n        with file paths and trade-offs',
        description: 'Agente planificador para arquitectura'
      }
    ],
    useCases: [
      'Búsquedas profundas en codebases grandes',
      'Tareas paralelas independientes',
      'Planificación de arquitectura compleja',
      'Validación y testing automatizado'
    ],
    commonErrors: [
      { error: 'Agente no retorna resultados esperados', fix: 'Sé más específico en el prompt del agente — incluye ejemplos' },
      { error: 'Demasiados agentes en paralelo', fix: 'Máximo 3-5 agentes paralelos; más puede degradar calidad' }
    ],
    tokenTips: [
      'Los agentes usan contextos separados — ideal para tareas largas sin saturar el contexto principal',
      'Usa agentes para búsquedas extensas en lugar de búsquedas manuales en el contexto principal',
      'Agentes de exploración son especialmente eficientes para codebases grandes'
    ],
    relatedCommands: ['init', 'compact']
  },
  {
    id: 'skills',
    slug: 'skills',
    name: 'Skills (habilidades)',
    category: 'advanced',
    level: 'advanced',
    icon: '⚡',
    description: 'Las skills son comandos personalizados que extienden Claude Code. Se definen en archivos markdown y se invocan con /nombre.',
    syntax: '/<skill-name> [args]',
    longDescription: 'Las skills permiten crear flujos de trabajo repetibles. Se definen como archivos .md en ~/.claude/commands/ o .claude/commands/. Cuando el usuario invoca /skill-name, el archivo se carga como prompt y Claude lo ejecuta con contexto completo del proyecto.',
    examples: [
      {
        title: 'Crear una skill de commit',
        code: '# ~/.claude/commands/commit.md\nAnalyze staged changes and create a git commit.\n\nSteps:\n1. Run git diff --staged\n2. Summarize changes concisely\n3. Follow conventional commits format\n4. Include Co-Authored-By footer\n\n$ claude\n> /commit\n✓ Commit created: "feat: add user authentication"',
        description: 'Skill personalizada para commits automáticos'
      },
      {
        title: 'Skill de code review',
        code: '# ~/.claude/commands/review-pr.md\nReview the current PR changes.\nArgs: PR number\n\nSteps:\n1. gh pr view $1\n2. Analyze diff for bugs/improvements\n3. Comment with structured feedback\n\n$ claude\n> /review-pr 123',
        description: 'Review automático de PRs con contexto'
      }
    ],
    useCases: [
      'Flujos de trabajo repetibles',
      'Automatizar tareas frecuentes',
      'Estandarizar procesos del equipo',
      'Crear comandos de dominio específico'
    ],
    commonErrors: [
      { error: 'Skill no encontrada', fix: 'Verifica que el archivo esté en ~/.claude/commands/ con extensión .md' },
      { error: 'Args no pasan correctamente', fix: 'Usa $1, $2 en el markdown para referenciar argumentos' }
    ],
    tokenTips: [
      'Las skills evitan repetir instrucciones largas en cada sesión',
      'Mantén skills cortas (< 30 líneas) para máxima eficiencia',
      'Una buena skill reemplaza párrafos de instrucciones manuales'
    ],
    relatedCommands: ['init', 'memory']
  },
  {
    id: 'hooks',
    slug: 'hooks',
    name: 'Hooks (automatización)',
    category: 'advanced',
    level: 'advanced',
    icon: '🔗',
    description: 'Los hooks ejecutan comandos del sistema automáticamente antes o después de acciones de Claude Code.',
    syntax: 'Configurado en settings.json bajo "hooks"',
    longDescription: 'Los hooks permiten automatizar acciones del sistema en respuesta a eventos de Claude Code: antes/después de editar archivos, antes/después de comandos bash, al recibir mensajes, etc. Se configuran en ~/.claude/settings.json.',
    examples: [
      {
        title: 'Hook post-edit para tests',
        code: '// ~/.claude/settings.json\n{\n  "hooks": {\n    "PostToolUse": [{\n      "matcher": "Edit",\n      "hooks": [{\n        "type": "command",\n        "command": "npm test -- --changed"\n      }]\n    }]\n  }\n}\n\n// Resultado: cada vez que Claude edita un archivo,\n// se ejecutan los tests automáticamente',
        description: 'Tests automáticos en cada edición'
      },
      {
        title: 'Hook de formato',
        code: '// Auto-formatear código después de cada edición\n{\n  "hooks": {\n    "PostToolUse": [{\n      "matcher": "Edit|Write",\n      "hooks": [{\n        "type": "command",\n        "command": "prettier --write $CLAUDE_FILE_PATH"\n      }]\n    }]\n  }\n}',
        description: 'Auto-formato en cada archivo modificado'
      }
    ],
    useCases: [
      'Tests automáticos en cada cambio',
      'Auto-formato de código',
      'Validación de linting',
      'Notificaciones de progreso',
      'Build automático'
    ],
    commonErrors: [
      { error: 'Hook no se ejecuta', fix: 'Verifica sintaxis JSON en settings.json y el matcher correcto' },
      { error: 'Hook falla silenciosamente', fix: 'Agrega logging al comando del hook para debug' }
    ],
    tokenTips: [
      'Los hooks no consumen tokens — son comandos del sistema',
      'Usa hooks para validación automática en lugar de pedirle a Claude que verifique'
    ],
    relatedCommands: ['skills', 'init']
  },
  {
    id: 'mcp',
    slug: 'mcp',
    name: 'MCP Servers',
    category: 'advanced',
    level: 'advanced',
    icon: '🔌',
    description: 'Model Context Protocol — conecta Claude con herramientas externas: bases de datos, APIs, servicios.',
    syntax: 'claude mcp add <nombre> -- <comando>',
    longDescription: 'MCP permite extender las capacidades de Claude con servidores de contexto personalizados. Un servidor MCP puede exponer herramientas, recursos y prompts que Claude usa durante la conversación. Ejemplos: acceso a BD, GitHub, Slack, sistemas internos.',
    examples: [
      {
        title: 'Agregar servidor MCP de filesystem',
        code: '$ claude mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/dir\n\n✓ MCP server "filesystem" added\n\n// Ahora Claude puede leer/escribir\n// archivos en ese directorio directamente',
        description: 'MCP para acceso extendido al sistema de archivos'
      },
      {
        title: 'Servidor MCP de base de datos',
        code: '$ claude mcp add postgres -- node ./mcp-postgres-server.js\n\n// Claude puede ahora ejecutar queries:\n> Muéstrame los usuarios registrados hoy\nRunning: SELECT * FROM users WHERE created_at > NOW()-INTERVAL \'1 day\'',
        description: 'Conexión directa a bases de datos'
      }
    ],
    useCases: [
      'Acceso a bases de datos en producción',
      'Integración con APIs internas',
      'Herramientas de monitoreo',
      'Sistemas de tickets y gestión'
    ],
    commonErrors: [
      { error: 'MCP server no inicia', fix: 'Verifica el comando y dependencias del servidor MCP' },
      { error: 'Permisos denegados', fix: 'Los servidores MCP necesitan permisos explícitos en settings.json' }
    ],
    tokenTips: [
      'MCP puede reducir tokens al hacer consultas directas en lugar de pegar datos manualmente',
      'Un buen servidor MCP reemplaza copiar/pegar de herramientas externas'
    ],
    relatedCommands: ['hooks', 'skills']
  },
  {
    id: 'token-optimization',
    slug: 'token-optimization',
    name: 'Optimización de tokens',
    category: 'optimization',
    level: 'intermediate',
    icon: '💡',
    description: 'Guía completa para reducir consumo de tokens y maximizar la eficiencia con Claude Code.',
    syntax: 'N/A — sección de estrategias',
    longDescription: 'La optimización de tokens no es solo reducir costos — es mejorar la calidad de las respuestas. Un contexto limpio y específico produce mejores resultados que uno largo y vago.',
    examples: [
      {
        title: 'Prompt ineficiente vs eficiente',
        code: '// ❌ INEFICIENTE (alto costo, baja calidad)\n"Could you please take a look at my code and\n help me understand why it might not be working\n correctly? I would really appreciate your help\n with this issue I\'m encountering."\n→ ~35 tokens, vago, sin contexto útil\n\n// ✅ EFICIENTE (bajo costo, alta calidad)\n"Bug: fetchUsers() returns undefined. Line 42,\n api.js. Expected: array. Actual: undefined.\n getUser() on line 38 works fine."\n→ ~30 tokens, específico, accionable',
        description: 'Comparación directa de eficiencia'
      }
    ],
    useCases: [
      'Proyectos con uso intensivo de API',
      'Equipos que comparten costo de Claude',
      'Sesiones largas de desarrollo',
      'Automatización masiva'
    ],
    commonErrors: [
      { error: 'Contexto muy grande', fix: 'Usa /compact o /clear para reducir el contexto acumulado' }
    ],
    tokenTips: [
      'Regla de oro: cada token debe aportar información que Claude no puede inferir',
      'Usa nombres de variables y funciones en tus prompts — Claude ya conoce el código',
      'Referencias a archivos específicos (src/auth.js:42) son más eficientes que pegar código'
    ],
    relatedCommands: ['compact', 'clear', 'memory']
  },
  {
    id: 'workflow',
    slug: 'workflow',
    name: 'Flujo de trabajo recomendado',
    category: 'workflow',
    level: 'basic',
    icon: '🔄',
    description: 'El flujo de trabajo óptimo para usar Claude Code de forma profesional en proyectos reales.',
    syntax: 'N/A — guía de flujo',
    longDescription: 'Un buen flujo de trabajo con Claude Code maximiza la productividad y minimiza fricciones. Comienza con /init, mantén el contexto limpio, usa skills para tareas repetibles, y revisa antes de commitear.',
    examples: [
      {
        title: 'Flujo diario completo',
        code: '# Inicio del día\n$ claude /init          # Dar contexto del proyecto\n\n# Durante el trabajo\n$ claude "feat: implementar login OAuth"\n# ... Claude trabaja ...\n> /review --staged     # Review antes de commit\n> /compact             # Limpiar contexto si es largo\n\n# Nueva tarea\n> /clear               # Contexto limpio\n$ claude "fix: corregir bug en auth refresh"\n\n# Al terminar\n> /memory add "OAuth implementado con Google provider"',
        description: 'Flujo completo de una jornada de trabajo'
      }
    ],
    useCases: [
      'Onboarding a nuevos proyectos',
      'Trabajo diario de desarrollo',
      'Sprints y feature development'
    ],
    commonErrors: [
      { error: 'Claude pierde el hilo', fix: 'Sesión demasiado larga — usa /compact o /clear y reestablece contexto' }
    ],
    tokenTips: [
      'Un flujo bien definido puede reducir el consumo de tokens en 40-60%',
      'CLAUDE.md + skills bien configurados son el mayor multiplicador de productividad'
    ],
    relatedCommands: ['init', 'compact', 'clear', 'review', 'memory']
  }
]

export const commandsByCategory = {
  setup: commands.filter(c => c.category === 'setup'),
  context: commands.filter(c => c.category === 'context'),
  workflow: commands.filter(c => c.category === 'workflow'),
  advanced: commands.filter(c => c.category === 'advanced'),
  optimization: commands.filter(c => c.category === 'optimization'),
}

export const commandsByLevel = {
  basic: commands.filter(c => c.level === 'basic'),
  intermediate: commands.filter(c => c.level === 'intermediate'),
  advanced: commands.filter(c => c.level === 'advanced'),
}
