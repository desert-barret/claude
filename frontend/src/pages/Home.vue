<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import { useProgressStore } from '../store/progress.js'
import { sections } from '../data/sections.js'

const router = useRouter()
const progress = useProgressStore()

const stats = computed(() => [
  { label: 'Comandos completados', value: `${progress.completedCommands}/${progress.totalCommands}`, icon: '📖' },
  { label: 'Secciones aprobadas',  value: `${progress.completedSections.length}/${sections.length}`, icon: '✅' },
  { label: 'Progreso global',      value: progress.globalProgress + '%', icon: '📊' },
  { label: 'Nivel actual',         value: progress.levelLabel, icon: '⭐' },
])

const quickActions = [
  { label: 'Primeros pasos', path: '/docs?section=getting-started', icon: '🚀', desc: 'Aprende /init y el flujo básico' },
  { label: 'Practicar terminal',   path: '/terminal', icon: '⌨️',  desc: 'Simulador interactivo de comandos' },
  { label: 'Mi progreso',          path: '/progress', icon: '📊',  desc: 'Estadísticas y logros' },
]
</script>

<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      <!-- Hero -->
      <div class="mb-8 animate-fade-in">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 flex-shrink-0">
            CC
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">Claude Code Academy</h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-0.5">Aprende Claude Code de cero a experto</p>
          </div>
        </div>

        <div class="rounded-xl p-4 sm:p-6 border
          bg-indigo-50 border-indigo-100
          dark:bg-indigo-900/10 dark:border-indigo-800/30">
          <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Domina <span class="text-indigo-600 dark:text-indigo-400 font-semibold">Claude Code</span> con este manual interactivo.
            Aprende cada comando, practica en el terminal y valida con quizzes por sección.
          </p>
          <p class="text-xs sm:text-sm text-gray-500 mt-2">
            Al terminar podrás usar Claude Code con confianza real en cualquier proyecto.
          </p>
        </div>
      </div>

      <!-- Stats grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="rounded-xl p-3 sm:p-4 text-center border shadow-sm
            bg-white border-gray-200
            dark:bg-gray-900/60 dark:border-gray-800"
        >
          <div class="text-xl sm:text-2xl mb-1 sm:mb-2">{{ stat.icon }}</div>
          <div class="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{{ stat.value }}</div>
          <div class="text-xs text-gray-500 mt-0.5 leading-tight">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="mb-8 rounded-xl p-4 sm:p-5 border shadow-sm
        bg-white border-gray-200
        dark:bg-gray-900/60 dark:border-gray-800">
        <div class="flex items-center justify-between mb-2.5">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Progreso del curso</span>
          <span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">{{ progress.globalProgress }}%</span>
        </div>
        <div class="progress-bar h-2">
          <div class="progress-fill h-full" :style="{ width: progress.globalProgress + '%' }"></div>
        </div>
        <div class="flex justify-between text-xs text-gray-400 mt-2">
          <span>Básico</span><span>Intermedio</span><span>Avanzado</span>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="mb-8">
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Acceso rápido</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            v-for="action in quickActions"
            :key="action.path"
            @click="router.push(action.path)"
            class="rounded-xl p-4 sm:p-5 text-left transition-all duration-200 group border shadow-sm
              bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md
              dark:bg-gray-900/60 dark:border-gray-800 dark:hover:border-indigo-700/60 dark:hover:bg-indigo-900/10"
          >
            <div class="text-2xl mb-2.5">{{ action.icon }}</div>
            <div class="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 dark:text-gray-200 dark:group-hover:text-indigo-300 mb-1 leading-tight">{{ action.label }}</div>
            <div class="text-xs text-gray-500 leading-relaxed">{{ action.desc }}</div>
          </button>
        </div>
      </div>

      <!-- Sections list -->
      <div>
        <h2 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Secciones del curso</h2>
        <div class="space-y-2">
          <div
            v-for="section in sections"
            :key="section.id"
            @click="router.push({ path: '/docs', query: { section: section.id } })"
            class="flex items-center gap-3 sm:gap-4 rounded-xl p-3 sm:p-4 cursor-pointer transition-all group border
              bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm
              dark:bg-gray-900/40 dark:border-gray-800 dark:hover:border-gray-700"
          >
            <span class="text-xl sm:text-2xl flex-shrink-0">{{ section.icon }}</span>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white leading-tight">{{ section.title }}</div>
              <div class="text-xs text-gray-500 mt-0.5 leading-tight truncate">{{ section.description }}</div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <span :class="[
                'hidden sm:inline-flex',
                section.level === 1 ? 'badge-basic' :
                section.level === 2 ? 'badge-intermediate' : 'badge-advanced'
              ]">{{ section.level === 1 ? 'Básico' : section.level === 2 ? 'Intermedio' : 'Avanzado' }}</span>
              <span v-if="progress.completedSections.includes(section.id)" class="text-green-500 dark:text-green-400 font-bold">✓</span>
              <span v-else-if="!progress.isLevelUnlocked(section.level)" class="text-gray-400">🔒</span>
              <span v-else class="text-gray-400">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
