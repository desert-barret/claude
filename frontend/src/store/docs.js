import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { commands, commandsByCategory } from '../data/commands.js'
import { sections } from '../data/sections.js'

export const useDocsStore = defineStore('docs', () => {
  const searchQuery = ref('')
  const activeCategory = ref('all')
  const activeSection = ref(null)

  const allCommands = computed(() => commands)
  const allSections = computed(() => sections)

  const filteredCommands = computed(() => {
    let list = commands
    if (activeCategory.value !== 'all') {
      list = list.filter(c => c.category === activeCategory.value)
    }
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      )
    }
    return list
  })

  function getCommand(slug) {
    return commands.find(c => c.slug === slug) || null
  }

  function getSection(id) {
    return sections.find(s => s.id === id) || null
  }

  function getSectionCommands(sectionId) {
    const section = getSection(sectionId)
    if (!section) return []
    return section.commands.map(id => getCommand(id)).filter(Boolean)
  }

  return {
    searchQuery,
    activeCategory,
    activeSection,
    allCommands,
    allSections,
    filteredCommands,
    getCommand,
    getSection,
    getSectionCommands
  }
})
