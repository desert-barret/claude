<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProgressStore } from '../../store/progress.js'
import { sections } from '../../data/sections.js'

const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['close'])

const router = useRouter()
const route = useRoute()
const progress = useProgressStore()

const navItems = [
  { name: 'Inicio', path: '/', icon: '🏠' },
  { name: 'Terminal', path: '/terminal', icon: '⌨️' },
  { name: 'Mi Progreso', path: '/progress', icon: '📊' },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function navigate(path) {
  router.push(path)
  emit('close')
}

function navigateSection(sectionId) {
  router.push({ path: '/docs', query: { section: sectionId } })
  emit('close')
}

function isSectionCompleted(id) {
  return progress.completedSections.includes(id)
}

function getSectionPct(section) {
  const cmds = section.commands || []
  const done = cmds.filter(id => progress.getCommandState(id) === progress.COMMAND_STATES.COMPLETED).length
  return cmds.length > 0 ? Math.round((done / cmds.length) * 100) : 0
}

const levelBadgeClass = computed(() => ({
  1: 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800',
  2: 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-800',
  3: 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800',
}[progress.currentLevel]))
</script>

<template>
  <aside :class="[
    'fixed left-0 top-0 h-full w-64 flex flex-col z-40 overflow-hidden transition-all duration-300',
    'bg-white border-r border-gray-200 dark:bg-gray-950 dark:border-gray-800/80',
    open ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:shadow-none'
  ]">

    <!-- Logo -->
    <div class="flex items-center justify-between px-4 py-3.5 border-b border-gray-200 dark:border-gray-800/80">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0">
          CC
        </div>
        <div>
          <div class="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">Claude Code</div>
          <div class="text-xs text-gray-400 leading-tight">Academy</div>
        </div>
      </div>
      <!-- Close button (mobile only) -->
      <button
        @click="$emit('close')"
        class="lg:hidden w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Level & Progress -->
    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-800/80">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs text-gray-500">Tu nivel</span>
        <span :class="['text-xs px-2 py-0.5 rounded font-medium', levelBadgeClass]">
          {{ progress.levelLabel }}
        </span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress.globalProgress + '%' }"></div>
      </div>
      <div class="text-xs text-gray-400 mt-1 text-right">{{ progress.globalProgress }}% completado</div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 overflow-y-auto py-3 px-2">
      <!-- Main links -->
      <div class="mb-2 space-y-0.5">
        <div
          v-for="item in navItems"
          :key="item.path"
          :class="['nav-item', isActive(item.path) ? 'active' : '']"
          @click="navigate(item.path)"
        >
          <span class="text-base w-5 text-center flex-shrink-0">{{ item.icon }}</span>
          <span class="font-medium">{{ item.name }}</span>
        </div>
      </div>

      <!-- Section divider -->
      <div class="pt-2 pb-1 border-t border-gray-200 dark:border-gray-800/50">
        <div class="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Secciones
        </div>
      </div>

      <div class="space-y-0.5">
        <div
          v-for="section in sections"
          :key="section.id"
          :class="['nav-item', route.path === '/docs' && route.query.section === section.id ? 'active' : '']"
          @click="navigateSection(section.id)"
        >
          <span class="text-sm w-5 text-center flex-shrink-0">{{ section.icon }}</span>
          <span class="flex-1 text-sm truncate">{{ section.title }}</span>
          <span v-if="isSectionCompleted(section.id)" class="text-green-500 dark:text-green-400 text-xs flex-shrink-0 font-bold">✓</span>
          <span v-else-if="getSectionPct(section) > 0" class="text-xs text-gray-400 flex-shrink-0">{{ getSectionPct(section) }}%</span>
          <span v-if="!progress.isLevelUnlocked(section.level)" class="text-gray-300 dark:text-gray-600 text-xs flex-shrink-0">🔒</span>
        </div>
      </div>
    </nav>

    <!-- Footer -->
    <div class="p-3 border-t border-gray-200 dark:border-gray-800/80">
      <button
        @click="progress.resetAll()"
        class="w-full text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors py-1.5 text-center rounded-md hover:bg-red-50 dark:hover:bg-red-900/10"
      >
        Reiniciar progreso
      </button>
    </div>
  </aside>
</template>
