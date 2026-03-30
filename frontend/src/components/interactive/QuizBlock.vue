<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  questions: { type: Array, required: true },
  sectionId: { type: String, required: true }
})

const emit = defineEmits(['completed'])

const currentIndex = ref(0)
const selectedAnswer = ref(null)
const showResult = ref(false)
const answers = ref([])
const quizDone = ref(false)

const currentQuestion = computed(() => props.questions[currentIndex.value])
const isLast = computed(() => currentIndex.value === props.questions.length - 1)
const isCorrect = computed(() => selectedAnswer.value === currentQuestion.value.correct)

const score = computed(() => {
  if (!quizDone.value) return 0
  const correct = answers.value.filter((a, i) => a === props.questions[i].correct).length
  return Math.round((correct / props.questions.length) * 100)
})

function selectAnswer(index) {
  if (showResult.value) return
  selectedAnswer.value = index
  showResult.value = true
}

function next() {
  answers.value.push(selectedAnswer.value)
  if (isLast.value) {
    quizDone.value = true
    emit('completed', { answers: answers.value, score: score.value })
  } else {
    currentIndex.value++
    selectedAnswer.value = null
    showResult.value = false
  }
}

function restart() {
  currentIndex.value = 0
  selectedAnswer.value = null
  showResult.value = false
  answers.value = []
  quizDone.value = false
}
</script>

<template>
  <div class="rounded-xl border overflow-hidden shadow-sm
    bg-white border-gray-200
    dark:bg-gray-900/60 dark:border-gray-800">

    <!-- Progress bar -->
    <div class="h-1 bg-gray-200 dark:bg-gray-800">
      <div
        class="h-full bg-indigo-500 dark:bg-indigo-600 transition-all duration-500"
        :style="{ width: ((currentIndex) / questions.length * 100) + '%' }"
      ></div>
    </div>

    <!-- Quiz complete -->
    <div v-if="quizDone" class="p-8 text-center animate-fade-in">
      <div class="text-5xl mb-4">{{ score >= 70 ? '🎉' : '📚' }}</div>
      <h3 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        {{ score >= 70 ? '¡Excelente!' : 'Sigue practicando' }}
      </h3>
      <div class="text-4xl font-bold mb-2"
        :class="score >= 70
          ? 'text-green-600 dark:text-green-400'
          : 'text-amber-600 dark:text-yellow-400'">
        {{ score }}%
      </div>
      <p class="text-sm mb-6 text-gray-500 dark:text-gray-500">
        {{ answers.filter((a, i) => a === questions[i].correct).length }} de {{ questions.length }} correctas
      </p>

      <div v-if="score >= 70" class="mb-6 p-4 rounded-lg border text-sm
        bg-green-50 border-green-200 text-green-700
        dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400">
        ✓ Sección completada — has desbloqueado contenido nuevo
      </div>
      <div v-else class="mb-6 p-4 rounded-lg border text-sm
        bg-amber-50 border-amber-200 text-amber-700
        dark:bg-yellow-900/20 dark:border-yellow-800/50 dark:text-yellow-400">
        Necesitas 70% para completar la sección. ¡Repasa el contenido e intenta de nuevo!
      </div>

      <button @click="restart" class="btn-secondary">Repetir quiz</button>
    </div>

    <!-- Active question -->
    <div v-else class="p-6">
      <div class="flex items-center gap-2 mb-5">
        <span class="text-xs font-mono text-gray-400 dark:text-gray-600">{{ currentIndex + 1 }}/{{ questions.length }}</span>
        <div class="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
      </div>

      <h3 class="text-base font-semibold mb-5 leading-relaxed text-gray-900 dark:text-gray-100">
        {{ currentQuestion.question }}
      </h3>

      <div class="space-y-2.5 mb-6">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          @click="selectAnswer(index)"
          :class="[
            'w-full text-left p-4 rounded-lg border text-sm transition-all duration-150',
            !showResult
              ? 'border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/10'
              : index === currentQuestion.correct
                ? 'border-green-400 bg-green-50 text-green-800 dark:border-green-600 dark:bg-green-900/20 dark:text-green-300'
                : index === selectedAnswer
                  ? 'border-red-400 bg-red-50 text-red-800 dark:border-red-600 dark:bg-red-900/20 dark:text-red-300'
                  : 'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-800 dark:bg-gray-800/20 dark:text-gray-600'
          ]"
        >
          <div class="flex items-start gap-3">
            <span
              class="flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center text-xs mt-0.5"
              :class="[
                showResult && index === currentQuestion.correct
                  ? 'border-green-500 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                  : showResult && index === selectedAnswer
                    ? 'border-red-500 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400'
                    : 'border-gray-300 dark:border-gray-600'
              ]"
            >
              {{ showResult && index === currentQuestion.correct ? '✓' : showResult && index === selectedAnswer ? '✗' : String.fromCharCode(65 + index) }}
            </span>
            <span>{{ option }}</span>
          </div>
        </button>
      </div>

      <!-- Explanation -->
      <transition name="fade">
        <div v-if="showResult" class="mb-5 p-4 rounded-lg border animate-fade-in"
          :class="isCorrect
            ? 'border-green-200 bg-green-50 dark:border-green-800/50 dark:bg-green-900/10'
            : 'border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-900/10'"
        >
          <div class="text-xs font-semibold mb-1.5"
            :class="isCorrect
              ? 'text-green-700 dark:text-green-400'
              : 'text-amber-700 dark:text-amber-400'">
            {{ isCorrect ? '✓ Correcto' : '✗ Incorrecto' }}
          </div>
          <p class="text-sm leading-relaxed text-gray-700 dark:text-gray-400">{{ currentQuestion.explanation }}</p>
        </div>
      </transition>

      <button v-if="showResult" @click="next" class="btn-primary w-full">
        {{ isLast ? 'Ver resultado' : 'Siguiente pregunta →' }}
      </button>
    </div>
  </div>
</template>
