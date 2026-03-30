<script setup>
import { ref } from 'vue'

const props = defineProps({
  code: { type: String, required: true },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  language: { type: String, default: 'bash' },
})

const copied = ref(false)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}

function highlight(code) {
  return code
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(#.*$)/gm, '<span style="color:#6b7280">$1</span>')
    .replace(/\b(\/\w+)\b/g, '<span style="color:#a78bfa">$1</span>')
    .replace(/\b(--[\w-]+)/g, '<span style="color:#67e8f9">$1</span>')
    .replace(/(\$\s)/g, '<span style="color:#4ade80">$1</span>')
    .replace(/(✓|✅)/g, '<span style="color:#4ade80">$1</span>')
    .replace(/(⚠️)/g, '<span style="color:#fbbf24">$1</span>')
    .replace(/(❌|✗)/g, '<span style="color:#f87171">$1</span>')
    .replace(/(💡)/g, '<span style="color:#fde68a">$1</span>')
    .replace(/"([^"<]+)"/g, '<span style="color:#fcd34d">"$1"</span>')
}
</script>

<template>
  <div class="rounded-xl overflow-hidden border my-4 shadow-sm
    border-gray-200
    dark:border-gray-700/80">

    <!-- Title bar -->
    <div class="flex items-center justify-between px-4 py-2.5 border-b
      bg-gray-100 border-gray-200
      dark:bg-gray-800/80 dark:border-gray-700/60">
      <div class="flex items-center gap-2">
        <div class="flex gap-1.5">
          <div class="w-3 h-3 rounded-full bg-red-400 dark:bg-red-500/70"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-400 dark:bg-yellow-500/70"></div>
          <div class="w-3 h-3 rounded-full bg-green-400 dark:bg-green-500/70"></div>
        </div>
        <span v-if="title" class="text-xs font-medium ml-1
          text-gray-600
          dark:text-gray-400">{{ title }}</span>
      </div>
      <button
        @click="copyCode"
        class="text-xs transition-colors
          text-gray-400 hover:text-gray-700
          dark:text-gray-500 dark:hover:text-gray-300"
      >
        {{ copied ? '✓ Copiado' : 'Copiar' }}
      </button>
    </div>

    <!-- Code area — always dark, intentional -->
    <div class="p-4 overflow-x-auto" style="background:#0d1117;">
      <pre class="text-sm font-mono leading-relaxed whitespace-pre" style="color:#d1d5db;"><code v-html="highlight(code)"></code></pre>
    </div>

    <!-- Description -->
    <div v-if="description" class="px-4 py-2.5 border-t
      bg-gray-50 border-gray-200 text-gray-500
      dark:bg-gray-800/40 dark:border-gray-700/60 dark:text-gray-500">
      <p class="text-xs">{{ description }}</p>
    </div>
  </div>
</template>
