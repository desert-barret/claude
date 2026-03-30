<script setup>
import { ref, nextTick, onMounted } from 'vue'

defineProps({ freeMode: { type: Boolean, default: false } })
const emit = defineEmits(['command-run'])

const input = ref('')
const lines = ref([])
const historyIndex = ref(-1)
const cmdHistory = ref([])
const outputEl = ref(null)
const inputEl = ref(null)

// All colors as inline styles — immune to Tailwind purge
const C = {
  green:  '#4ade80',
  yellow: '#fbbf24',
  red:    '#f87171',
  blue:   '#93c5fd',
  purple: '#c084fc',
  dim:    '#6b7280',
  text:   '#d1d5db',
  white:  '#e6edf3',
}

const COMMANDS = {
  '/init': [
    { t: 'Analyzing project structure...', c: 'dim', ms: 200 },
    { t: '✓ Found: package.json, README.md, src/', c: 'green', ms: 500 },
    { t: '✓ Detected: Node.js + Vue 3 project',   c: 'green', ms: 800 },
    { t: '✓ Created: CLAUDE.md',                  c: 'green', ms: 1050 },
    { t: '',                                        c: 'dim',   ms: 1150 },
    { t: 'CLAUDE.md includes:',                    c: 'text',  ms: 1250 },
    { t: '  · Project overview & tech stack',      c: 'blue',  ms: 1400 },
    { t: '  · Key directories & entry points',     c: 'blue',  ms: 1550 },
    { t: '  · Development commands',               c: 'blue',  ms: 1700 },
    { t: '',                                        c: 'dim',   ms: 1800 },
    { t: '💡 Edit CLAUDE.md to add project-specific rules', c: 'yellow', ms: 1950 },
  ],
  '/clear': {
    action: 'clear',
    lines: [
      { t: '✓ Context cleared',              c: 'green', ms: 150 },
      { t: '  · Conversation history: deleted', c: 'dim',   ms: 300 },
      { t: '  · CLAUDE.md: preserved',         c: 'green', ms: 450 },
      { t: '  · Memory files: preserved',      c: 'green', ms: 600 },
    ]
  },
  '/compact': [
    { t: 'Analyzing conversation context...', c: 'dim',    ms: 300 },
    { t: 'Compressing 15,234 tokens → 2,100 tokens  (↓86%)', c: 'yellow', ms: 900 },
    { t: '',                                  c: 'dim',    ms: 1050 },
    { t: 'Summary preserved:',               c: 'text',   ms: 1150 },
    { t: '  ✓ Architecture decisions (3)',   c: 'green',  ms: 1300 },
    { t: '  ✓ Code changes made (7 files)',  c: 'green',  ms: 1450 },
    { t: '  ✓ Current task: auth flow',      c: 'green',  ms: 1600 },
    { t: '  ✓ Pending: tests for login',     c: 'green',  ms: 1750 },
  ],
  '/memory list': [
    { t: 'Stored memories:',                         c: 'text', ms: 150 },
    { t: '',                                          c: 'dim',  ms: 200 },
    { t: '  preferences.md',                          c: 'blue', ms: 300 },
    { t: '    · TypeScript strict mode preferred',    c: 'dim',  ms: 420 },
    { t: '    · Use pnpm over npm',                   c: 'dim',  ms: 540 },
    { t: '',                                          c: 'dim',  ms: 590 },
    { t: '  project_patterns.md',                     c: 'blue', ms: 690 },
    { t: '    · Write tests before implementation',   c: 'dim',  ms: 810 },
    { t: '    · Follow conventional commits',         c: 'dim',  ms: 930 },
  ],
  '/review': [
    { t: 'Reviewing staged changes...',                      c: 'dim',    ms: 300 },
    { t: '',                                                  c: 'dim',    ms: 420 },
    { t: '⚠  src/auth.js:42',                               c: 'yellow', ms: 600 },
    { t: '   Possible null dereference on user.profile',     c: 'yellow', ms: 750 },
    { t: '   → Add null check before accessing .email',      c: 'dim',    ms: 900 },
    { t: '',                                                  c: 'dim',    ms: 980 },
    { t: '✓  src/utils.js  — Clean, follows patterns',      c: 'green',  ms: 1100 },
    { t: '✓  src/router.js — No issues found',              c: 'green',  ms: 1220 },
    { t: '',                                                  c: 'dim',    ms: 1300 },
    { t: '💡 Consider extracting validation to a helper',   c: 'yellow', ms: 1450 },
  ],
  '/help': [
    { t: 'Available commands:',                   c: 'text', ms: 100 },
    { t: '',                                       c: 'dim',  ms: 150 },
    { t: '  /init         Initialize project',    c: 'blue', ms: 220 },
    { t: '  /clear        Clear conversation',    c: 'blue', ms: 290 },
    { t: '  /compact      Compress context',      c: 'blue', ms: 360 },
    { t: '  /memory list  List memories',         c: 'blue', ms: 430 },
    { t: '  /review       Review changes',        c: 'blue', ms: 500 },
    { t: '  /help         Show this message',     c: 'blue', ms: 570 },
    { t: '',                                       c: 'dim',  ms: 620 },
    { t: '💡 Type any command above to practice', c: 'yellow', ms: 720 },
  ],
}

function pushLine(text, color = 'text') {
  lines.value.push({ type: 'output', text, color })
  scroll()
}

function pushInput(text) {
  lines.value.push({ type: 'input', text })
  scroll()
}

async function scroll() {
  await nextTick()
  if (outputEl.value) outputEl.value.scrollTop = outputEl.value.scrollHeight
}

async function runCommand(cmd) {
  const trimmed = cmd.trim()
  if (!trimmed) return

  cmdHistory.value.unshift(trimmed)
  historyIndex.value = -1
  pushInput(trimmed)
  emit('command-run', trimmed)

  const def = COMMANDS[trimmed]

  if (!def) {
    setTimeout(() => {
      pushLine(`zsh: command not found: ${trimmed}`, 'red')
      pushLine('Try /help to see available commands', 'dim')
    }, 120)
    return
  }

  // /clear has special structure
  if (def.action === 'clear') {
    def.lines.forEach(l => {
      setTimeout(() => { pushLine(l.t, l.c) }, l.ms)
    })
    setTimeout(() => { lines.value = []; scroll() }, 800)
    return
  }

  // Normal array of lines
  const lineArr = Array.isArray(def) ? def : def.lines || []
  lineArr.forEach(l => {
    setTimeout(() => { pushLine(l.t, l.c) }, l.ms)
  })
}

function onKeydown(e) {
  if (e.key === 'Enter') {
    const cmd = input.value.trim()
    input.value = ''
    runCommand(cmd)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (historyIndex.value < cmdHistory.value.length - 1) {
      historyIndex.value++
      input.value = cmdHistory.value[historyIndex.value]
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (historyIndex.value > 0) {
      historyIndex.value--
      input.value = cmdHistory.value[historyIndex.value]
    } else {
      historyIndex.value = -1
      input.value = ''
    }
  }
}

function focus() { inputEl.value?.focus() }

function runSuggested(cmd) {
  runCommand(cmd)
  input.value = ''
  focus()
}

onMounted(() => {
  lines.value = [
    { type: 'output', text: 'Claude Code  ·  Terminal Simulator', color: 'purple' },
    { type: 'output', text: '──────────────────────────────────────', color: 'dim' },
    { type: 'output', text: 'Practica comandos reales de Claude Code', color: 'dim' },
    { type: 'output', text: 'Escribe /help para ver los comandos', color: 'dim' },
    { type: 'output', text: '', color: 'dim' },
  ]
  focus()
})

defineExpose({ runSuggested })
</script>

<template>
  <div
    class="rounded-xl overflow-hidden border border-gray-700 flex flex-col shadow-xl select-none"
    style="background:#0d1117; min-height:380px; height:clamp(380px,50vh,520px);"
  >
    <!-- Title bar -->
    <div
      class="flex items-center gap-2 px-4 py-2.5 border-b flex-shrink-0"
      style="background:#161b22; border-color:#30363d;"
    >
      <div class="flex gap-1.5">
        <span class="w-3 h-3 rounded-full block" style="background:#ef4444;"></span>
        <span class="w-3 h-3 rounded-full block" style="background:#f59e0b;"></span>
        <span class="w-3 h-3 rounded-full block" style="background:#22c55e;"></span>
      </div>
      <span class="flex-1 text-center text-xs font-mono" style="color:#6b7280;">
        claude — terminal
      </span>
    </div>

    <!-- Output -->
    <div
      ref="outputEl"
      class="flex-1 overflow-y-auto p-4 font-mono text-sm cursor-text"
      style="line-height:1.6;"
      @click="focus"
    >
      <div v-for="(line, i) in lines" :key="i">
        <!-- Input line (command typed by user) -->
        <div v-if="line.type === 'input'" class="flex items-baseline gap-2 mb-0.5">
          <span class="flex-shrink-0 font-bold" style="color:#4ade80;">›</span>
          <span style="color:#e6edf3; word-break:break-all;">{{ line.text }}</span>
        </div>
        <!-- Output line -->
        <div
          v-else
          class="mb-0.5"
          :style="{
            color: line.color === 'green'  ? '#4ade80' :
                   line.color === 'yellow' ? '#fbbf24' :
                   line.color === 'red'    ? '#f87171' :
                   line.color === 'blue'   ? '#93c5fd' :
                   line.color === 'purple' ? '#c084fc' :
                   line.color === 'cyan'   ? '#67e8f9' :
                   line.color === 'dim'    ? '#6b7280' :
                                             '#d1d5db',
            minHeight: '1.4em',
            whiteSpace: 'pre',
          }"
        >{{ line.text || '\u200b' }}</div>
      </div>

      <!-- Live input line -->
      <div class="flex items-baseline gap-2 mt-1">
        <span class="flex-shrink-0 font-bold" style="color:#4ade80;">›</span>
        <input
          ref="inputEl"
          v-model="input"
          @keydown="onKeydown"
          class="flex-1 bg-transparent outline-none font-mono text-sm min-w-0"
          style="color:#e6edf3; caret-color:#4ade80;"
          placeholder="Escribe un comando..."
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
        />
      </div>
    </div>

    <!-- Suggestions bar -->
    <div
      class="flex items-center gap-1.5 px-3 py-2 border-t flex-shrink-0 flex-wrap"
      style="background:#161b22; border-color:#30363d;"
    >
      <span class="text-xs font-mono mr-1 flex-shrink-0" style="color:#6b7280;">›</span>
      <button
        v-for="cmd in ['/init', '/compact', '/clear', '/review', '/help', '/memory list']"
        :key="cmd"
        @click="runSuggested(cmd)"
        class="text-xs font-mono px-2 py-0.5 rounded border transition-all duration-150 flex-shrink-0
          hover:opacity-100"
        style="background:#21262d; border-color:#30363d; color:#8b949e; opacity:0.85;"
        @mouseover="e => { e.target.style.color='#e6edf3'; e.target.style.borderColor='#58a6ff'; e.target.style.opacity='1' }"
        @mouseout="e => { e.target.style.color='#8b949e'; e.target.style.borderColor='#30363d'; e.target.style.opacity='0.85' }"
      >{{ cmd }}</button>
    </div>
  </div>
</template>
