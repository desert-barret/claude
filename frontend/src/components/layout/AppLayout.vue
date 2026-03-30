<script setup>
import { ref, provide } from 'vue'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'

const sidebarOpen = ref(false)
provide('sidebarOpen', sidebarOpen)

function closeSidebar() { sidebarOpen.value = false }
function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-black/50 lg:hidden"
      @click="closeSidebar"
    />

    <Sidebar :open="sidebarOpen" @close="closeSidebar" />
    <Topbar @toggle-sidebar="toggleSidebar" />

    <main class="lg:ml-64 pt-14 min-h-screen">
      <slot />
    </main>
  </div>
</template>
