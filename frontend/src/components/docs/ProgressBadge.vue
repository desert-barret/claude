<script setup>
import { computed } from 'vue'
import { useProgressStore } from '../../store/progress.js'

const props = defineProps({
  commandId: { type: String, required: true }
})

const progress = useProgressStore()
const state = computed(() => progress.getCommandState(props.commandId))

const config = computed(() => ({
  unseen:      { label: 'No visto',    icon: '○', cls: 'text-gray-500 bg-gray-100 border-gray-300 dark:text-gray-500 dark:bg-gray-800 dark:border-gray-700' },
  in_progress: { label: 'En progreso', icon: '◑', cls: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-800/60' },
  completed:   { label: 'Completado',  icon: '●', cls: 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/30 dark:border-green-800/60' },
}[state.value]))
</script>

<template>
  <span :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border font-medium', config.cls]">
    {{ config.icon }} {{ config.label }}
  </span>
</template>
