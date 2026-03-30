<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import QuizBlock from '../components/interactive/QuizBlock.vue'
import { useProgressStore } from '../store/progress.js'
import { sections } from '../data/sections.js'

const route = useRoute()
const router = useRouter()
const progress = useProgressStore()

const section = computed(() => sections.find(s => s.id === route.params.sectionId))
const quizResult = computed(() => progress.getSectionQuizResult(route.params.sectionId))

function onCompleted({ answers, score }) {
  progress.saveQuizResult(route.params.sectionId, answers, score)
}
</script>

<template>
  <AppLayout>
    <div class="max-w-2xl mx-auto px-8 py-8">
      <button @click="router.push('/docs')" class="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-6">
        ← Volver a documentación
      </button>

      <div v-if="section">
        <div class="mb-8">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-2xl">{{ section.icon }}</span>
            <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100">Quiz: {{ section.title }}</h1>
          </div>
          <p class="text-gray-500 text-sm">{{ section.quiz?.length || 0 }} preguntas · Necesitas 70% para completar</p>

          <div v-if="quizResult" class="mt-4 p-3 rounded-lg border flex items-center justify-between"
            :class="quizResult.score >= 70
              ? 'border-green-200 bg-green-50 dark:border-green-800/50 dark:bg-green-900/10'
              : 'border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-900/10'"
          >
            <div class="text-sm font-medium" :class="quizResult.score >= 70 ? 'text-green-700 dark:text-green-400' : 'text-amber-700 dark:text-amber-400'">
              Último intento: {{ Math.round(quizResult.score) }}%
              {{ quizResult.score >= 70 ? '✓ Aprobado' : '✗ No aprobado' }}
            </div>
            <span class="text-xs text-gray-400">{{ new Date(quizResult.date).toLocaleDateString('es') }}</span>
          </div>
        </div>

        <div v-if="section.quiz?.length">
          <QuizBlock :questions="section.quiz" :sectionId="section.id" @completed="onCompleted" />
        </div>
        <div v-else class="text-center py-16 text-gray-400">
          No hay preguntas de quiz para esta sección todavía.
        </div>
      </div>

      <div v-else class="text-center py-20">
        <div class="text-4xl mb-4">🔍</div>
        <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Sección no encontrada</h2>
        <button @click="router.push('/docs')" class="btn-primary">← Volver</button>
      </div>
    </div>
  </AppLayout>
</template>
