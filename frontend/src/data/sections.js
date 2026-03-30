export const sections = [
  {
    id: 'getting-started',
    title: 'Primeros pasos',
    icon: '🚀',
    description: 'Comienza con Claude Code desde cero',
    level: 1,
    commands: ['init', 'help', 'workflow'],
    quiz: [
      {
        id: 'q1',
        question: '¿Qué hace el comando /init?',
        options: [
          'Inicia el servidor de desarrollo',
          'Crea un CLAUDE.md con contexto del proyecto',
          'Limpia la conversación',
          'Instala dependencias'
        ],
        correct: 1,
        explanation: '/init analiza el proyecto y genera un CLAUDE.md que persiste el contexto entre sesiones. No tiene nada que ver con el servidor de desarrollo.'
      },
      {
        id: 'q2',
        question: '¿Para qué sirve CLAUDE.md?',
        options: [
          'Documentar el código fuente',
          'Configurar el servidor web',
          'Dar contexto persistente a Claude sobre el proyecto',
          'Definir variables de entorno'
        ],
        correct: 2,
        explanation: 'CLAUDE.md es leído automáticamente por Claude en cada sesión. Contiene instrucciones, convenciones y contexto del proyecto que no necesitas repetir.'
      },
      {
        id: 'q3',
        question: '¿Cuándo deberías usar /clear?',
        options: [
          'Antes de cada prompt',
          'Cuando la sesión es muy larga o el contexto se confunde',
          'Para borrar archivos del proyecto',
          'Nunca, es peligroso'
        ],
        correct: 1,
        explanation: '/clear es útil cuando el contexto se vuelve demasiado largo o confuso. No borra archivos — solo limpia el historial de la conversación.'
      }
    ]
  },
  {
    id: 'context-management',
    title: 'Gestión de contexto',
    icon: '🧠',
    description: 'Domina /clear, /compact y /memory',
    level: 1,
    commands: ['clear', 'compact', 'memory'],
    quiz: [
      {
        id: 'q4',
        question: '¿Cuál es la diferencia entre /clear y /compact?',
        options: [
          'No hay diferencia',
          '/clear borra todo, /compact resume manteniendo lo esencial',
          '/compact es más rápido que /clear',
          '/clear solo borra archivos temporales'
        ],
        correct: 1,
        explanation: '/clear elimina todo el historial de conversación. /compact lo analiza y resume inteligentemente, preservando decisiones, código relevante y estado actual.'
      },
      {
        id: 'q5',
        question: '¿Qué guarda /memory add?',
        options: [
          'El código de la sesión actual',
          'Variables de entorno del sistema',
          'Información personal que persiste entre conversaciones',
          'El historial del proyecto'
        ],
        correct: 2,
        explanation: '/memory add guarda información en ~/.claude/memory/ — persiste entre sesiones y proyectos. Ideal para preferencias personales y patrones de trabajo.'
      },
      {
        id: 'q6',
        question: 'Si tienes 80,000 tokens de contexto y necesitas continuar trabajando, ¿qué usas?',
        options: [
          '/clear para empezar limpio',
          '/compact para comprimir manteniendo contexto clave',
          '/init para reinicializar',
          'Nada, Claude maneja esto automáticamente'
        ],
        correct: 1,
        explanation: '/compact es ideal aquí — comprime drásticamente el contexto (80-90%) mientras preserva decisiones tomadas, código cambiado y el estado actual de la tarea.'
      }
    ]
  },
  {
    id: 'workflow',
    title: 'Flujo de trabajo',
    icon: '🔄',
    description: 'Flujo profesional con /review y estrategias de trabajo',
    level: 2,
    commands: ['review', 'workflow'],
    quiz: [
      {
        id: 'q7',
        question: '¿Cuál es el momento ideal para usar /review?',
        options: [
          'Después de cada línea de código escrita',
          'Antes de commitear cambios importantes',
          'Solo cuando hay errores de compilación',
          'Una vez al día'
        ],
        correct: 1,
        explanation: '/review antes de cada commit actúa como code reviewer automático. Detecta bugs, mejoras y problemas de estilo antes de que el código entre al repositorio.'
      },
      {
        id: 'q8',
        question: 'En el flujo de trabajo diario, ¿qué va primero?',
        options: [
          'Escribir código directamente',
          '/init o verificar que CLAUDE.md está actualizado',
          '/clear para limpiar el contexto',
          '/memory list para revisar memorias'
        ],
        correct: 1,
        explanation: 'Siempre comienza asegurándote de que Claude tiene contexto del proyecto via CLAUDE.md. Esto evita repetir información en cada sesión y mejora la calidad de las respuestas.'
      }
    ]
  },
  {
    id: 'skills-hooks',
    title: 'Skills y Hooks',
    icon: '⚡',
    description: 'Automatiza con skills personalizadas y hooks del sistema',
    level: 2,
    commands: ['skills', 'hooks'],
    quiz: [
      {
        id: 'q9',
        question: '¿Dónde se guardan las skills personalizadas?',
        options: [
          'En el directorio del proyecto',
          'En ~/.claude/commands/ como archivos .md',
          'En la base de datos de Anthropic',
          'En CLAUDE.md'
        ],
        correct: 1,
        explanation: 'Las skills se definen como archivos markdown en ~/.claude/commands/ (globales) o .claude/commands/ (por proyecto). Se invocan con /nombre-del-archivo.'
      },
      {
        id: 'q10',
        question: '¿Qué son los hooks en Claude Code?',
        options: [
          'Funciones JavaScript que extienden Claude',
          'Comandos del sistema que se ejecutan automáticamente ante eventos de Claude',
          'Plugins de terceros para Claude',
          'Alias para comandos de terminal'
        ],
        correct: 1,
        explanation: 'Los hooks son comandos del sistema (bash) que se ejecutan automáticamente cuando Claude realiza ciertas acciones: editar archivos, ejecutar comandos, etc. Se configuran en settings.json.'
      }
    ]
  },
  {
    id: 'agents-mcp',
    title: 'Agents y MCP',
    icon: '🤖',
    description: 'Potencia máxima: subagentes y servidores MCP',
    level: 3,
    commands: ['agents', 'mcp'],
    quiz: [
      {
        id: 'q11',
        question: '¿Para qué sirven los subagentes?',
        options: [
          'Para hacer Claude más rápido',
          'Para delegar tareas a contextos aislados y paralelos',
          'Para usar Claude sin conexión',
          'Para guardar el historial de conversaciones'
        ],
        correct: 1,
        explanation: 'Los subagentes permiten a Claude delegar búsquedas, planificación y tareas especializadas a instancias con su propio contexto aislado. Ideal para codebases grandes o tareas paralelas.'
      },
      {
        id: 'q12',
        question: '¿Qué hace un servidor MCP?',
        options: [
          'Acelera la velocidad de respuesta de Claude',
          'Conecta Claude con herramientas externas: DBs, APIs, servicios',
          'Comparte sesiones de Claude entre usuarios',
          'Ejecuta Claude localmente'
        ],
        correct: 1,
        explanation: 'MCP (Model Context Protocol) expone herramientas, recursos y prompts de sistemas externos que Claude puede usar. Permite acceder a bases de datos, APIs internas, GitHub, Slack, etc.'
      }
    ]
  },
  {
    id: 'optimization',
    title: 'Optimización de tokens',
    icon: '💡',
    description: 'Reduce costos y mejora la calidad de tus prompts',
    level: 2,
    commands: ['token-optimization'],
    quiz: [
      {
        id: 'q13',
        question: '¿Cuál prompt es más eficiente?',
        options: [
          '"Please help me fix my code it\'s not working properly"',
          '"Bug: TypeError en src/auth.js:42 — map() en undefined. Expected: array de fetchUsers()"',
          '"Revisa todo mi código y arregla los problemas"',
          '"Necesito ayuda con JavaScript"'
        ],
        correct: 1,
        explanation: 'El prompt eficiente especifica: el tipo de error, la ubicación exacta, el comportamiento actual y el esperado. Esto permite a Claude actuar directamente sin preguntas de clarificación.'
      },
      {
        id: 'q14',
        question: '¿Qué estrategia reduce MÁS tokens en sesiones largas?',
        options: [
          'Escribir prompts más cortos',
          'Usar /compact regularmente para comprimir el contexto',
          'Evitar usar Claude en proyectos grandes',
          'Usar menos archivos en el proyecto'
        ],
        correct: 1,
        explanation: '/compact puede reducir el contexto en 80-90% en sesiones largas. Combinado con un buen CLAUDE.md, esta es la estrategia más efectiva para gestionar tokens.'
      }
    ]
  }
]

export const levelNames = {
  1: 'Básico',
  2: 'Intermedio',
  3: 'Avanzado'
}

export const levelColors = {
  1: 'green',
  2: 'yellow',
  3: 'red'
}
