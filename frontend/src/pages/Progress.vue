<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import { useProgressStore } from '../store/progress.js'
import { commands } from '../data/commands.js'
import { sections } from '../data/sections.js'
import { PROMPT_EXAMPLES, analyzePrompt } from '../utils/tokenizer.js'

const router = useRouter()
const progress = useProgressStore()

const promptInput = ref('')
const promptAnalysis = computed(() => promptInput.value ? analyzePrompt(promptInput.value) : null)

const commandList = computed(() => commands.map(cmd => ({
  ...cmd,
  state: progress.getCommandState(cmd.id)
})))

const sectionList = computed(() => sections.map(sec => ({
  ...sec,
  completed: progress.completedSections.includes(sec.id),
  quizResult: progress.getSectionQuizResult(sec.id),
  locked: !progress.isLevelUnlocked(sec.level)
})))

const levelProgress = computed(() => ({
  basic: {
    label: 'Nivel 1 · Básico',
    unlocked: progress.isLevelUnlocked(1),
    total: commands.filter(c => c.level === 'basic').length,
    completed: commands.filter(c => c.level === 'basic' && progress.getCommandState(c.id) === 'completed').length,
  },
  intermediate: {
    label: 'Nivel 2 · Intermedio',
    unlocked: progress.isLevelUnlocked(2),
    total: commands.filter(c => c.level === 'intermediate').length,
    completed: commands.filter(c => c.level === 'intermediate' && progress.getCommandState(c.id) === 'completed').length,
  },
  advanced: {
    label: 'Nivel 3 · Avanzado',
    unlocked: progress.isLevelUnlocked(3),
    total: commands.filter(c => c.level === 'advanced').length,
    completed: commands.filter(c => c.level === 'advanced' && progress.getCommandState(c.id) === 'completed').length,
  },
}))

function efficiencyColor(eff) {
  return {
    excellent: 'text-green-600 dark:text-green-400',
    good:      'text-blue-600 dark:text-blue-400',
    fair:      'text-amber-600 dark:text-amber-400',
    poor:      'text-red-600 dark:text-red-400'
  }[eff] || 'text-gray-500'
}
</script>

<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">📊 Mi Progreso</h1>

      <!-- Global stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div class="rounded-xl p-3 sm:p-4 text-center border shadow-sm
          bg-white border-gray-200 dark:bg-gray-900/60 dark:border-gray-800">
          <div class="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">{{ progress.globalProgress }}%</div>
          <div class="text-xs text-gray-500 mt-1 leading-tight">Progreso global</div>
        </div>
        <div class="rounded-xl p-3 sm:p-4 text-center border shadow-sm
          bg-white border-gray-200 dark:bg-gray-900/60 dark:border-gray-800">
          <div class="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{{ progress.completedCommands }}</div>
          <div class="text-xs text-gray-500 mt-1 leading-tight">Comandos completados</div>
        </div>
        <div class="rounded-xl p-3 sm:p-4 text-center border shadow-sm
          bg-white border-gray-200 dark:bg-gray-900/60 dark:border-gray-800">
          <div class="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-yellow-400">{{ progress.completedSections.length }}</div>
          <div class="text-xs text-gray-500 mt-1 leading-tight">Secciones aprobadas</div>
        </div>
        <div class="rounded-xl p-3 sm:p-4 text-center border shadow-sm
          bg-white border-gray-200 dark:bg-gray-900/60 dark:border-gray-800">
          <div class="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{{ progress.levelLabel }}</div>
          <div class="text-xs text-gray-500 mt-1 leading-tight">Nivel actual</div>
        </div>
      </div>

      <!-- Level progress -->
      <div class="mb-8">
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Niveles</h2>
        <div class="space-y-3">
          <div v-for="(lvl, key) in levelProgress" :key="key" class="rounded-xl p-4 sm:p-5 border shadow-sm
            bg-white border-gray-200 dark:bg-gray-900/40 dark:border-gray-800">
            <div class="flex items-center justify-between mb-2.5">
              <div class="flex items-center gap-2">
                <span v-if="!lvl.unlocked" class="text-gray-400">🔒</span>
                <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">{{ lvl.label }}</span>
              </div>
              <span class="text-xs text-gray-500 font-mono">{{ lvl.completed }}/{{ lvl.total }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: lvl.total ? (lvl.completed/lvl.total*100)+'%' : '0%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Commands grid -->
      <div class="mb-8">
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Estado de comandos</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div
            v-for="cmd in commandList"
            :key="cmd.id"
            @click="router.push(`/docs/${cmd.slug}`)"
            class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border"
            :class="[
              cmd.state === 'completed'   ? 'border-green-200 bg-green-50 hover:bg-green-100 dark:border-green-800/50 dark:bg-green-900/10 dark:hover:bg-green-900/20' :
              cmd.state === 'in_progress' ? 'border-amber-200 bg-amber-50 hover:bg-amber-100 dark:border-amber-800/30 dark:bg-amber-900/10 dark:hover:bg-amber-900/20' :
              'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900/40 dark:hover:bg-gray-900/70'
            ]"
          >
            <span class="text-xl flex-shrink-0">{{ cmd.icon }}</span>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium font-mono text-gray-800 dark:text-gray-300 truncate">{{ cmd.name }}</div>
              <div class="text-xs text-gray-400 truncate">{{ cmd.category }}</div>
            </div>
            <span :class="[
              'text-base font-mono flex-shrink-0',
              cmd.state === 'completed'   ? 'text-green-500 dark:text-green-400' :
              cmd.state === 'in_progress' ? 'text-amber-500 dark:text-yellow-400' :
              'text-gray-300 dark:text-gray-700'
            ]">{{ cmd.state === 'completed' ? '●' : cmd.state === 'in_progress' ? '◑' : '○' }}</span>
          </div>
        </div>
      </div>

      <!-- Quiz results -->
      <div class="mb-8">
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quizzes por sección</h2>
        <div class="space-y-2.5">
          <div v-for="sec in sectionList" :key="sec.id" class="flex items-center gap-3 p-3 sm:p-4 rounded-xl border shadow-sm
            bg-white border-gray-200 dark:bg-gray-900/40 dark:border-gray-800">
            <span class="text-xl flex-shrink-0">{{ sec.icon }}</span>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-800 dark:text-gray-300 truncate">{{ sec.title }}</div>
              <div v-if="sec.quizResult" class="text-xs text-gray-400 mt-0.5">{{ Math.round(sec.quizResult.score) }}% · {{ new Date(sec.quizResult.date).toLocaleDateString('es') }}</div>
              <div v-else-if="sec.locked" class="text-xs text-gray-400">Bloqueado</div>
              <div v-else class="text-xs text-gray-400">Sin intentos</div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span v-if="sec.completed" class="hidden sm:inline text-xs font-medium text-green-700 border border-green-200 bg-green-50 rounded px-2 py-0.5 dark:text-green-400 dark:border-green-800 dark:bg-green-900/20">✓</span>
              <button v-if="!sec.locked" @click="router.push(`/quiz/${sec.id}`)" class="btn-secondary text-xs py-1.5 px-2.5">
                {{ sec.quizResult ? 'Repetir' : 'Quiz' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Token analyzer -->
      <div class="mb-8">
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Analizador de prompts</h2>
        <div class="rounded-xl p-4 sm:p-6 border shadow-sm
          bg-white border-gray-200 dark:bg-gray-900/60 dark:border-gray-800">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">Analiza la eficiencia de tu prompt antes de enviarlo</p>
          <textarea
            v-model="promptInput"
            placeholder="Escribe un prompt aquí para analizarlo..."
            class="w-full rounded-lg p-3 text-sm resize-none focus:outline-none h-24 border transition-colors
              bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/20
              dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-600 dark:focus:border-indigo-600"
          ></textarea>

          <div v-if="promptAnalysis" class="mt-3 space-y-2 animate-fade-in">
            <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
              <div>
                <span class="text-gray-500 text-xs">Tokens: </span>
                <span class="font-mono font-medium text-gray-800 dark:text-gray-200">~{{ promptAnalysis.tokens }}</span>
              </div>
              <div>
                <span class="text-gray-500 text-xs">Eficiencia: </span>
                <span :class="['font-semibold text-sm', efficiencyColor(promptAnalysis.efficiency)]">{{ promptAnalysis.efficiency }}</span>
              </div>
            </div>
            <div v-if="promptAnalysis.issues.length" class="space-y-1">
              <div v-for="issue in promptAnalysis.issues" :key="issue.msg" class="text-xs flex items-start gap-1.5 text-amber-700 dark:text-yellow-400">
                <span class="flex-shrink-0">⚠️</span><span>{{ issue.msg }}</span>
              </div>
            </div>
            <div v-if="promptAnalysis.suggestions.length" class="space-y-1">
              <div v-for="s in promptAnalysis.suggestions" :key="s" class="text-xs flex items-start gap-1.5 text-blue-600 dark:text-blue-400">
                <span class="flex-shrink-0">💡</span><span>{{ s }}</span>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <div class="text-xs text-gray-400 mb-2">Haz clic en un ejemplo para cargarlo:</div>
            <div class="space-y-2">
              <div
                v-for="ex in PROMPT_EXAMPLES"
                :key="ex.label"
                @click="promptInput = ex.prompt"
                class="p-3 rounded-lg border cursor-pointer transition-all text-xs"
                :class="[
                  ex.type === 'bad'  ? 'border-red-200 bg-red-50 hover:border-red-300 dark:border-red-900/40 dark:bg-red-900/10 dark:hover:border-red-800' :
                  ex.type === 'good' ? 'border-amber-200 bg-amber-50 hover:border-amber-300 dark:border-amber-900/40 dark:bg-amber-900/10 dark:hover:border-amber-800' :
                  'border-green-200 bg-green-50 hover:border-green-300 dark:border-green-900/40 dark:bg-green-900/10 dark:hover:border-green-800'
                ]"
              >
                <div class="font-semibold mb-1" :class="ex.type === 'bad' ? 'text-red-600 dark:text-red-400' : ex.type === 'good' ? 'text-amber-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'">
                  {{ ex.label }} · ~{{ ex.tokens }} tokens
                </div>
                <div class="text-gray-600 dark:text-gray-400 font-mono leading-relaxed break-words">{{ ex.prompt }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reset -->
      <div class="rounded-xl p-4 sm:p-5 border text-center
        bg-red-50 border-red-200
        dark:bg-red-900/10 dark:border-red-900/30">
        <p class="text-sm text-gray-500 mb-3">¿Quieres empezar desde cero?</p>
        <button @click="progress.resetAll()" class="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-300 hover:border-red-400 dark:border-red-800 dark:hover:border-red-700 px-4 py-2 rounded-lg transition-colors">
          Reiniciar todo el progreso
        </button>
      </div>
    </div>
  </AppLayout>
</template>
