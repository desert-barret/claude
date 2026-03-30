import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storage } from '../utils/storage.js'

const STORAGE_KEY = 'claude-academy-progress'

export const useProgressStore = defineStore('progress', () => {
  const commandProgress = ref(storage.get(STORAGE_KEY + '-commands', {}))
  const quizResults = ref(storage.get(STORAGE_KEY + '-quiz', {}))
  const unlockedLevels = ref(storage.get(STORAGE_KEY + '-levels', [1]))
  const completedSections = ref(storage.get(STORAGE_KEY + '-sections', []))

  const COMMAND_STATES = { UNSEEN: 'unseen', IN_PROGRESS: 'in_progress', COMPLETED: 'completed' }

  function save() {
    storage.set(STORAGE_KEY + '-commands', commandProgress.value)
    storage.set(STORAGE_KEY + '-quiz', quizResults.value)
    storage.set(STORAGE_KEY + '-levels', unlockedLevels.value)
    storage.set(STORAGE_KEY + '-sections', completedSections.value)
  }

  function getCommandState(commandId) {
    return commandProgress.value[commandId] || COMMAND_STATES.UNSEEN
  }

  function markInProgress(commandId) {
    if (commandProgress.value[commandId] !== COMMAND_STATES.COMPLETED) {
      commandProgress.value[commandId] = COMMAND_STATES.IN_PROGRESS
      save()
    }
  }

  function markCompleted(commandId) {
    commandProgress.value[commandId] = COMMAND_STATES.COMPLETED
    save()
  }

  function saveQuizResult(sectionId, answers, score) {
    quizResults.value[sectionId] = { answers, score, date: new Date().toISOString() }
    save()
    if (score >= 70) {
      if (!completedSections.value.includes(sectionId)) {
        completedSections.value.push(sectionId)
      }
      checkLevelUnlock()
    }
  }

  function checkLevelUnlock() {
    const { sections } = { sections: completedSections.value }
    // Level 2 unlocks after completing 2 sections
    if (completedSections.value.length >= 2 && !unlockedLevels.value.includes(2)) {
      unlockedLevels.value.push(2)
    }
    // Level 3 unlocks after completing 4 sections
    if (completedSections.value.length >= 4 && !unlockedLevels.value.includes(3)) {
      unlockedLevels.value.push(3)
    }
    save()
  }

  function isLevelUnlocked(level) {
    return unlockedLevels.value.includes(level)
  }

  function getSectionQuizResult(sectionId) {
    return quizResults.value[sectionId] || null
  }

  const totalCommands = computed(() => 12)

  const completedCommands = computed(() =>
    Object.values(commandProgress.value).filter(s => s === COMMAND_STATES.COMPLETED).length
  )

  const globalProgress = computed(() => {
    const total = totalCommands.value
    if (total === 0) return 0
    return Math.round((completedCommands.value / total) * 100)
  })

  const currentLevel = computed(() => {
    if (unlockedLevels.value.includes(3) && completedSections.value.length >= 5) return 3
    if (unlockedLevels.value.includes(2) && completedSections.value.length >= 3) return 2
    return 1
  })

  const levelLabel = computed(() => {
    const labels = { 1: 'Básico', 2: 'Intermedio', 3: 'Avanzado' }
    return labels[currentLevel.value]
  })

  function resetAll() {
    commandProgress.value = {}
    quizResults.value = {}
    unlockedLevels.value = [1]
    completedSections.value = []
    save()
  }

  return {
    commandProgress,
    quizResults,
    unlockedLevels,
    completedSections,
    COMMAND_STATES,
    getCommandState,
    markInProgress,
    markCompleted,
    saveQuizResult,
    isLevelUnlocked,
    getSectionQuizResult,
    totalCommands,
    completedCommands,
    globalProgress,
    currentLevel,
    levelLabel,
    resetAll
  }
})
