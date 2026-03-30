<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../../store/progress.js'
import { useDocsStore } from '../../store/docs.js'
import { useTheme } from '../../composables/useTheme.js'

const props = defineProps({})
const emit = defineEmits(['toggle-sidebar'])

const router = useRouter()
const progress = useProgressStore()
const docs = useDocsStore()
const { isDark, toggle } = useTheme()

const searchFocused = ref(false)
const searchResults = ref([])

function onSearch(e) {
  docs.searchQuery = e.target.value
  searchResults.value = docs.searchQuery.length > 1
    ? docs.filteredCommands.slice(0, 5)
    : []
}

function goToCommand(slug) {
  router.push(`/docs/${slug}`)
  docs.searchQuery = ''
  searchResults.value = []
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 lg:left-64 h-14 z-20 flex items-center gap-3 px-4
    bg-white/95 backdrop-blur-sm border-b border-gray-200
    dark:bg-gray-950/95 dark:border-gray-800/80 transition-colors duration-200">

    <!-- Hamburger (mobile only) -->
    <button
      @click="$emit('toggle-sidebar')"
      class="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0
        text-gray-500 hover:text-gray-700 hover:bg-gray-100
        dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Search -->
    <div class="relative flex-1 min-w-0 max-w-sm">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Buscar comandos..."
          :value="docs.searchQuery"
          @input="onSearch"
          @focus="searchFocused = true"
          @blur="() => setTimeout(() => { searchFocused = false; searchResults = [] }, 200)"
          class="w-full rounded-lg pl-8 pr-3 py-1.5 text-sm transition-colors
            bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400
            focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-1 focus:ring-indigo-400/30
            dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-600
            dark:focus:border-indigo-600 dark:focus:bg-gray-900"
        />
      </div>

      <!-- Search dropdown -->
      <div
        v-if="searchResults.length > 0 && searchFocused"
        class="absolute top-full mt-1.5 left-0 right-0 rounded-xl shadow-2xl overflow-hidden z-50 border
          bg-white border-gray-200
          dark:bg-gray-900 dark:border-gray-700"
      >
        <div
          v-for="cmd in searchResults"
          :key="cmd.id"
          @click="goToCommand(cmd.slug)"
          class="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors
            hover:bg-indigo-50 dark:hover:bg-gray-800"
        >
          <span class="text-xl flex-shrink-0">{{ cmd.icon }}</span>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ cmd.name }}</div>
            <div class="text-xs text-gray-500 truncate">{{ cmd.description }}</div>
          </div>
          <span :class="['flex-shrink-0 text-xs',
            cmd.level === 'basic' ? 'badge-basic' :
            cmd.level === 'intermediate' ? 'badge-intermediate' : 'badge-advanced'
          ]">{{ cmd.level }}</span>
        </div>
      </div>
    </div>

    <!-- Right side -->
    <div class="flex items-center gap-2 ml-auto flex-shrink-0">
      <!-- Stats (hidden on small mobile) -->
      <div class="hidden sm:flex items-center gap-1.5 text-sm">
        <span class="font-semibold text-green-600 dark:text-green-400">{{ progress.completedCommands }}</span>
        <span class="text-gray-300 dark:text-gray-600">/</span>
        <span class="text-gray-500">{{ progress.totalCommands }}</span>
      </div>

      <!-- Progress bar (hidden on small mobile) -->
      <div class="hidden sm:flex items-center gap-1.5">
        <div class="w-16 progress-bar">
          <div class="progress-fill" :style="{ width: progress.globalProgress + '%' }"></div>
        </div>
        <span class="text-xs text-gray-400 w-7 text-right">{{ progress.globalProgress }}%</span>
      </div>

      <!-- Terminal button (hidden on xs) -->
      <button
        @click="router.push('/terminal')"
        class="hidden sm:flex btn-secondary text-xs py-1.5 px-3 items-center gap-1.5"
      >
        <span>⌨️</span>
        <span class="hidden md:inline">Terminal</span>
      </button>

      <!-- Theme toggle -->
      <button
        @click="toggle"
        class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0
          bg-gray-100 hover:bg-gray-200 text-gray-600
          dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300"
        :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      >
        <span class="text-sm leading-none">{{ isDark ? '☀️' : '🌙' }}</span>
      </button>
    </div>
  </header>
</template>
