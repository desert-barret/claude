<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../../store/progress.js'
import { sections } from '../../data/sections.js'

const props = defineProps({
  section: { type: Object, required: true },
  commands: { type: Array, default: () => [] }
})

const router = useRouter()
const progress = useProgressStore()

const isCompleted = computed(() => progress.completedSections.includes(props.section.id))
const quizResult = computed(() => progress.getSectionQuizResult(props.section.id))
const isLocked = computed(() => !progress.isLevelUnlocked(props.section.level))

const levelBadge = computed(() => ({
  1: { label: 'Básico',      cls: 'badge-basic' },
  2: { label: 'Intermedio',  cls: 'badge-intermediate' },
  3: { label: 'Avanzado',    cls: 'badge-advanced' },
}[props.section.level]))

function getCommandState(commandId) {
  return progress.getCommandState(commandId)
}

function goToQuiz() {
  router.push(`/quiz/${props.section.id}`)
}
</script>

<template>
  <div :class="['rounded-xl border transition-all duration-200',
    isCompleted
      ? 'border-green-200 bg-green-50/50 dark:border-green-800/50 dark:bg-green-900/5'
      : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/30 dark:hover:border-gray-700'
  ]">

    <!-- Header -->
    <div class="p-6 pb-4">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-3">
          <span class="text-2xl">{{ section.icon }}</span>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ section.title }}</h3>
            <p class="text-sm mt-0.5 text-gray-500 dark:text-gray-500">{{ section.description }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0 ml-4">
          <span :class="levelBadge.cls">{{ levelBadge.label }}</span>
          <span v-if="isCompleted" class="text-lg text-green-600 dark:text-green-400">✓</span>
          <span v-if="isLocked" class="text-lg text-gray-400 dark:text-gray-600">🔒</span>
        </div>
      </div>

      <!-- Quiz result -->
      <div v-if="quizResult" class="flex items-center gap-2 mt-3 text-xs">
        <span :class="quizResult.score >= 70
          ? 'text-green-600 dark:text-green-400'
          : 'text-amber-600 dark:text-yellow-400'">
          Quiz: {{ Math.round(quizResult.score) }}%
        </span>
        <span class="text-gray-400 dark:text-gray-600">·</span>
        <span class="text-gray-400 dark:text-gray-600">{{ new Date(quizResult.date).toLocaleDateString('es') }}</span>
      </div>
    </div>

    <!-- Command list -->
    <div v-if="!isLocked" class="px-6 pb-4">
      <div class="grid gap-2">
        <router-link
          v-for="cmd in commands"
          :key="cmd.id"
          :to="`/docs/${cmd.slug}`"
          class="flex items-center gap-3 p-3 rounded-lg border transition-colors group
            bg-gray-50 hover:bg-gray-100 border-gray-200
            dark:bg-gray-800/40 dark:hover:bg-gray-800/70 dark:border-gray-700/50"
        >
          <span class="text-lg">{{ cmd.icon }}</span>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-medium
              text-gray-800 group-hover:text-gray-900
              dark:text-gray-200 dark:group-hover:text-white">
              {{ cmd.name }}
            </div>
            <div class="text-xs truncate text-gray-500 dark:text-gray-500">{{ cmd.description }}</div>
          </div>
          <span :class="[
            'text-sm font-mono flex-shrink-0',
            getCommandState(cmd.id) === 'completed'   ? 'text-green-500 dark:text-green-400' :
            getCommandState(cmd.id) === 'in_progress' ? 'text-amber-500 dark:text-yellow-400' :
                                                        'text-gray-300 dark:text-gray-700'
          ]">
            {{ getCommandState(cmd.id) === 'completed' ? '●' : getCommandState(cmd.id) === 'in_progress' ? '◑' : '○' }}
          </span>
        </router-link>
      </div>
    </div>

    <!-- Locked state -->
    <div v-else class="px-6 pb-4">
      <div class="rounded-lg border p-4 text-center
        border-gray-200 bg-gray-50 text-gray-500
        dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-500">
        <p class="text-sm">Completa las secciones anteriores para desbloquear este nivel</p>
      </div>
    </div>

    <!-- Quiz button -->
    <div v-if="!isLocked" class="px-6 pb-6">
      <button
        @click="goToQuiz"
        :class="['w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border',
          isCompleted
            ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:border-green-800/50 dark:text-green-400 dark:hover:bg-green-900/50'
            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-600'
        ]"
      >
        {{ isCompleted ? '✓ Repetir Quiz' : '→ Hacer Quiz de esta sección' }}
      </button>
    </div>
  </div>
</template>
