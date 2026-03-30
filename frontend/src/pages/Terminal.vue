<script setup>
import { ref } from 'vue'
import AppLayout from '../components/layout/AppLayout.vue'
import TerminalSimulator from '../components/interactive/TerminalSimulator.vue'
import { useProgressStore } from '../store/progress.js'

const progress = useProgressStore()
const terminalRef = ref(null)
const commandsRan = ref(new Set())

function onCommandRun(cmd) {
  commandsRan.value.add(cmd)
  const map = {
    '/init': 'init', '/clear': 'clear', '/compact': 'compact',
    '/review': 'review', '/memory list': 'memory', '/memory': 'memory', '/help': 'help'
  }
  const id = map[cmd]
  if (id) progress.markInProgress(id)
}

function runCommand(cmd) { terminalRef.value?.runSuggested(cmd) }

const tips = [
  { icon: '⬆️', text: 'Flechas arriba/abajo para historial' },
  { icon: '💡', text: 'Haz clic en los botones de sugerencias' },
  { icon: '↩️', text: 'Enter para ejecutar el comando' },
  { icon: '🔄', text: 'Flujo real: /init → trabajar → /compact' },
]

const scenarios = [
  { title: 'Inicio de proyecto', cmd: '/init',        desc: 'Inicializar contexto del proyecto' },
  { title: 'Sesión muy larga',   cmd: '/compact',     desc: 'Comprimir contexto sin perder info' },
  { title: 'Reset completo',     cmd: '/clear',       desc: 'Limpiar sesión y comenzar' },
  { title: 'Code review',        cmd: '/review',      desc: 'Revisar cambios antes de commit' },
  { title: 'Ver memorias',       cmd: '/memory list', desc: 'Listar memorias guardadas' },
]
</script>

<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">⌨️ Terminal Simulator</h1>
        <p class="text-sm text-gray-500">Practica comandos de Claude Code en un entorno seguro</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-8">
        <!-- Terminal (full width mobile, 2/3 desktop) -->
        <div class="lg:col-span-2">
          <TerminalSimulator ref="terminalRef" @command-run="onCommandRun" />
        </div>

        <!-- Sidebar -->
        <div class="space-y-4">
          <!-- Tips -->
          <div class="rounded-xl p-4 border shadow-sm
            bg-white border-gray-200
            dark:bg-gray-900/60 dark:border-gray-800">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Consejos</h3>
            <div class="space-y-2">
              <div v-for="tip in tips" :key="tip.text" class="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
                <span class="flex-shrink-0">{{ tip.icon }}</span>
                <span>{{ tip.text }}</span>
              </div>
            </div>
          </div>

          <!-- Scenarios -->
          <div class="rounded-xl p-4 border shadow-sm
            bg-white border-gray-200
            dark:bg-gray-900/60 dark:border-gray-800">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Escenarios</h3>
            <div class="space-y-1.5">
              <button
                v-for="s in scenarios"
                :key="s.title"
                @click="runCommand(s.cmd)"
                class="w-full text-left px-3 py-2.5 rounded-lg border transition-all group
                  bg-gray-50 hover:bg-indigo-50 border-gray-200 hover:border-indigo-200
                  dark:bg-gray-800/50 dark:hover:bg-gray-800 dark:border-gray-700 dark:hover:border-indigo-700/50"
              >
                <div class="text-xs font-medium text-gray-700 group-hover:text-indigo-700 dark:text-gray-200 dark:group-hover:text-indigo-300 leading-tight">{{ s.title }}</div>
                <div class="text-xs text-gray-400 mt-0.5 leading-tight">{{ s.desc }}</div>
              </button>
            </div>
          </div>

          <!-- Practiced commands -->
          <div class="rounded-xl p-4 border shadow-sm
            bg-white border-gray-200
            dark:bg-gray-900/60 dark:border-gray-800">
            <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Practicados</h3>
            <div v-if="commandsRan.size === 0" class="text-xs text-gray-400 dark:text-gray-500">
              Ninguno aún — empieza con /init
            </div>
            <div v-else class="flex flex-wrap gap-1.5">
              <span
                v-for="cmd in commandsRan"
                :key="cmd"
                class="text-xs font-mono px-2 py-0.5 rounded border
                  bg-indigo-50 border-indigo-200 text-indigo-700
                  dark:bg-indigo-900/30 dark:border-indigo-800/50 dark:text-indigo-400"
              >{{ cmd }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Flujo recomendado -->
      <div class="mt-6 rounded-xl p-4 sm:p-6 border shadow-sm
        bg-white border-gray-200
        dark:bg-gray-900/40 dark:border-gray-800">
        <h2 class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Flujo de trabajo recomendado</h2>
        <div class="flex items-start sm:items-center gap-2 flex-wrap">
          <div
            v-for="(step, i) in [
              { cmd: '/init',     desc: 'Inicializar' },
              { cmd: 'trabajar',  desc: 'Desarrollar' },
              { cmd: '/review',   desc: 'Revisar' },
              { cmd: '/compact',  desc: 'Comprimir' },
              { cmd: 'iterar',    desc: 'Continuar' },
            ]"
            :key="i"
            class="flex items-center gap-2"
          >
            <div class="text-center">
              <div class="rounded-lg px-2.5 py-1.5 border
                bg-gray-100 border-gray-300
                dark:bg-gray-800 dark:border-gray-700">
                <code class="text-xs font-mono text-indigo-600 dark:text-indigo-300">{{ step.cmd }}</code>
              </div>
              <div class="text-xs text-gray-400 mt-1">{{ step.desc }}</div>
            </div>
            <span v-if="i < 4" class="text-gray-300 dark:text-gray-700 font-light">→</span>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
