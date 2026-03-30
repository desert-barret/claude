<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import { useDocsStore } from '../store/docs.js'
import { useProgressStore } from '../store/progress.js'
import { sections } from '../data/sections.js'

const route = useRoute()
const router = useRouter()
const docs = useDocsStore()
const progress = useProgressStore()

const activeSection = ref(route.query.section || sections[0].id)
watch(() => route.query.section, val => { if (val) activeSection.value = val })

function setSection(id) {
  activeSection.value = id
  router.push({ path: '/docs', query: { section: id } })
}

const currentSection = computed(() => sections.find(s => s.id === activeSection.value))
const sectionCommands = computed(() => {
  if (!currentSection.value) return []
  return currentSection.value.commands.map(id => docs.getCommand(id)).filter(Boolean)
})

const levelLabel = { 1: 'Básico', 2: 'Intermedio', 3: 'Avanzado' }
const showPicker = ref(false)

const isCompleted = computed(() => currentSection.value && progress.completedSections.includes(currentSection.value.id))
const isLocked = computed(() => currentSection.value && !progress.isLevelUnlocked(currentSection.value.level))
</script>

<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">

      <!-- Mobile section picker -->
      <div class="lg:hidden mb-6 relative z-10">
        <button
          @click="showPicker = !showPicker"
          class="w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium shadow-sm
            bg-white border-gray-200 text-gray-700
            dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
        >
          <div class="flex items-center gap-2">
            <span>{{ currentSection?.icon }}</span>
            <span>{{ currentSection?.title }}</span>
          </div>
          <svg class="w-4 h-4 text-gray-400 transition-transform" :class="showPicker ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div v-if="showPicker" class="absolute top-full mt-1 left-0 right-0 rounded-xl border shadow-xl overflow-hidden
          bg-white border-gray-200
          dark:bg-gray-900 dark:border-gray-700">
          <button
            v-for="section in sections"
            :key="section.id"
            @click="setSection(section.id); showPicker = false"
            :class="['w-full text-left flex items-center gap-3 px-4 py-3 text-sm transition-colors border-b last:border-0',
              activeSection === section.id
                ? 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-900/50'
                : 'text-gray-700 hover:bg-gray-50 border-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:border-gray-800'
            ]"
          >
            <span>{{ section.icon }}</span>
            <span class="flex-1">{{ section.title }}</span>
            <span v-if="progress.completedSections.includes(section.id)" class="text-green-500 font-bold">✓</span>
            <span v-else-if="!progress.isLevelUnlocked(section.level)" class="text-gray-400">🔒</span>
          </button>
        </div>
      </div>

      <div v-if="currentSection" class="animate-fade-in">

        <!-- Hero header -->
        <div class="rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 border
          bg-white border-gray-200 shadow-sm
          dark:bg-gray-900/60 dark:border-gray-800">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0
              bg-indigo-50 dark:bg-indigo-900/30">
              {{ currentSection.icon }}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {{ currentSection.title }}
              </h1>
              <p class="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1 leading-relaxed">
                {{ currentSection.description }}
              </p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2 sm:gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <span :class="currentSection.level === 1 ? 'badge-basic' : currentSection.level === 2 ? 'badge-intermediate' : 'badge-advanced'">
              Nivel {{ levelLabel[currentSection.level] }}
            </span>
            <span class="text-xs text-gray-400 dark:text-gray-600">·</span>
            <span class="text-xs text-gray-500">{{ sectionCommands.length }} comandos</span>
            <span class="text-xs text-gray-400 dark:text-gray-600">·</span>
            <span class="text-xs text-gray-500">{{ currentSection.quiz?.length || 0 }} preguntas quiz</span>
            <span v-if="isCompleted" class="ml-auto text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
              <span>✓</span> Completado
            </span>
          </div>
        </div>

        <!-- Locked state -->
        <div v-if="isLocked" class="rounded-2xl p-8 text-center border
          bg-gray-50 border-gray-200
          dark:bg-gray-900/30 dark:border-gray-800">
          <div class="text-4xl mb-3">🔒</div>
          <h3 class="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">Sección bloqueada</h3>
          <p class="text-sm text-gray-500">Completa las secciones anteriores para desbloquear este nivel</p>
        </div>

        <template v-else>
          <!-- Commands grid -->
          <div class="mb-6 sm:mb-8">
            <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
              Comandos en esta sección
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="cmd in sectionCommands"
                :key="cmd.id"
                @click="router.push(`/docs/${cmd.slug}`)"
                class="rounded-xl p-4 cursor-pointer transition-all group border shadow-sm
                  bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md
                  dark:bg-gray-900/40 dark:border-gray-800 dark:hover:border-indigo-700/50"
              >
                <div class="flex items-start gap-3">
                  <span class="text-2xl flex-shrink-0">{{ cmd.icon }}</span>
                  <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-2 mb-1">
                      <h3 class="text-sm font-semibold font-mono text-gray-900 group-hover:text-indigo-600 dark:text-gray-200 dark:group-hover:text-indigo-300">
                        {{ cmd.name }}
                      </h3>
                      <span :class="cmd.level === 'basic' ? 'badge-basic' : cmd.level === 'intermediate' ? 'badge-intermediate' : 'badge-advanced'">
                        {{ cmd.level === 'basic' ? 'Básico' : cmd.level === 'intermediate' ? 'Intermedio' : 'Avanzado' }}
                      </span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{{ cmd.description }}</p>
                    <div class="mt-2.5 font-mono text-xs px-2 py-0.5 rounded border inline-block
                      text-gray-500 bg-gray-50 border-gray-200
                      dark:text-gray-500 dark:bg-gray-900 dark:border-gray-800">
                      {{ cmd.syntax }}
                    </div>
                  </div>
                  <span class="text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0 text-lg">›</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quiz CTA -->
          <div class="rounded-2xl p-5 sm:p-6 border
            bg-indigo-50 border-indigo-100
            dark:bg-indigo-900/10 dark:border-indigo-800/30">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="flex-1">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  ¿Listo para el quiz?
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Valida tu conocimiento con {{ currentSection.quiz?.length || 0 }} preguntas. Necesitas 70% para completar esta sección.
                </p>
              </div>
              <button
                @click="router.push(`/quiz/${currentSection.id}`)"
                class="btn-primary flex-shrink-0 text-sm py-2.5 px-5"
              >
                {{ isCompleted ? '↺ Repetir quiz' : '→ Hacer quiz' }}
              </button>
            </div>
          </div>
        </template>

      </div>
    </div>
  </AppLayout>
</template>
