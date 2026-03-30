<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import CommandBlock from '../components/docs/CommandBlock.vue'
import ProgressBadge from '../components/docs/ProgressBadge.vue'
import { useDocsStore } from '../store/docs.js'
import { useProgressStore } from '../store/progress.js'

const route = useRoute()
const router = useRouter()
const docs = useDocsStore()
const progress = useProgressStore()

const command = computed(() => docs.getCommand(route.params.slug))

onMounted(() => { if (command.value) progress.markInProgress(command.value.id) })
watch(() => route.params.slug, () => { if (command.value) progress.markInProgress(command.value.id) })

function markDone() { if (command.value) progress.markCompleted(command.value.id) }

const levelBadgeClass = computed(() => ({
  basic: 'badge-basic', intermediate: 'badge-intermediate', advanced: 'badge-advanced'
}[command.value?.level] || ''))

const levelLabel = computed(() => ({
  basic: 'Básico', intermediate: 'Intermedio', advanced: 'Avanzado'
}[command.value?.level] || ''))

const isDone = computed(() =>
  command.value && progress.getCommandState(command.value.id) === progress.COMMAND_STATES.COMPLETED
)
</script>

<template>
  <AppLayout>
    <div v-if="command" class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">

      <!-- Breadcrumb -->
      <div class="flex items-center gap-1.5 text-sm text-gray-400 mb-5">
        <button @click="router.push('/docs')" class="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Docs</button>
        <span class="text-gray-300 dark:text-gray-700">/</span>
        <span class="text-gray-600 dark:text-gray-400 font-mono truncate">{{ command.name }}</span>
      </div>

      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <div class="flex items-start gap-3 sm:gap-4 mb-4">
          <span class="text-3xl sm:text-4xl flex-shrink-0">{{ command.icon }}</span>
          <div class="flex-1 min-w-0">
            <h1 class="text-xl sm:text-2xl font-bold font-mono text-gray-900 dark:text-gray-100 leading-tight break-all">{{ command.name }}</h1>
            <p class="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1.5 leading-relaxed">{{ command.description }}</p>
            <div class="flex flex-wrap items-center gap-2 mt-3">
              <span :class="levelBadgeClass">{{ levelLabel }}</span>
              <ProgressBadge :commandId="command.id" />
            </div>
          </div>
        </div>
        <button
          @click="markDone"
          :class="['btn-primary w-full sm:w-auto flex items-center justify-center gap-2', isDone ? 'bg-green-600 hover:bg-green-700' : '']"
        >
          {{ isDone ? '✓ Completado' : 'Marcar como completado' }}
        </button>
      </div>

      <!-- Syntax -->
      <div class="mb-6 p-4 rounded-xl border
        bg-gray-50 border-gray-200
        dark:bg-gray-900/60 dark:border-gray-800">
        <div class="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Sintaxis</div>
        <code class="font-mono text-indigo-600 dark:text-indigo-300 text-sm break-all">{{ command.syntax }}</code>
      </div>

      <!-- Description -->
      <div class="mb-6">
        <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mb-2.5">Descripción</h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{{ command.longDescription }}</p>
      </div>

      <!-- Examples -->
      <div class="mb-6">
        <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">Ejemplos</h2>
        <div class="space-y-5">
          <div v-for="(ex, i) in command.examples" :key="i">
            <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{{ ex.title }}</div>
            <CommandBlock :code="ex.code" :description="ex.description" />
          </div>
        </div>
      </div>

      <!-- Use cases -->
      <div class="mb-6">
        <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mb-2.5">Casos de uso</h2>
        <ul class="space-y-2">
          <li v-for="(uc, i) in command.useCases" :key="i" class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span class="text-indigo-500 mt-0.5 flex-shrink-0">→</span><span>{{ uc }}</span>
          </li>
        </ul>
      </div>

      <!-- Common errors -->
      <div v-if="command.commonErrors?.length" class="mb-6">
        <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">Errores comunes</h2>
        <div class="space-y-2.5">
          <div v-for="(err, i) in command.commonErrors" :key="i" class="rounded-lg p-4 border
            bg-red-50 border-red-200
            dark:bg-red-900/10 dark:border-red-900/40">
            <div class="text-sm font-mono text-red-600 dark:text-red-400 mb-1 break-all">{{ err.error }}</div>
            <div class="text-xs text-gray-600 dark:text-gray-400">→ {{ err.fix }}</div>
          </div>
        </div>
      </div>

      <!-- Token tips -->
      <div v-if="command.tokenTips?.length" class="mb-6">
        <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">Optimización de tokens</h2>
        <div class="rounded-xl p-4 border space-y-2.5
          bg-amber-50 border-amber-200
          dark:bg-yellow-900/10 dark:border-yellow-900/30">
          <div v-for="(tip, i) in command.tokenTips" :key="i" class="flex items-start gap-2 text-sm
            text-amber-800 dark:text-yellow-200/80 leading-relaxed">
            <span class="flex-shrink-0">💡</span><span>{{ tip }}</span>
          </div>
        </div>
      </div>

      <!-- Related commands -->
      <div v-if="command.relatedCommands?.length" class="mb-6">
        <h2 class="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">Comandos relacionados</h2>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="slug in command.relatedCommands"
            :key="slug"
            @click="router.push(`/docs/${slug}`)"
            class="px-3 py-1.5 rounded-lg text-sm font-mono transition-colors border
              bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700
              dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
          >{{ slug }}</button>
        </div>
      </div>

      <!-- Done CTA -->
      <div class="mt-8 p-5 rounded-xl border text-center
        bg-gray-50 border-gray-200
        dark:bg-gray-900/40 dark:border-gray-800">
        <p class="text-sm text-gray-500 mb-3">
          {{ isDone ? '¡Comando completado!' : 'Marca este comando como completado para avanzar.' }}
        </p>
        <button @click="markDone" :class="['btn-primary px-8', isDone ? 'bg-green-600 hover:bg-green-700' : '']">
          {{ isDone ? '✓ Completado' : 'Marcar como completado →' }}
        </button>
      </div>
    </div>

    <!-- 404 -->
    <div v-else class="max-w-lg mx-auto px-4 py-20 text-center">
      <div class="text-5xl mb-4">🔍</div>
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Comando no encontrado</h2>
      <p class="text-gray-500 text-sm mb-6">El comando que buscas no existe.</p>
      <button @click="router.push('/docs')" class="btn-primary">← Volver a docs</button>
    </div>
  </AppLayout>
</template>
