// Token optimization utilities for Claude Code best practices
export function estimateTokens(text) {
  // Rough estimate: ~4 chars per token
  return Math.ceil(text.length / 4)
}

export function analyzePrompt(prompt) {
  const tokens = estimateTokens(prompt)
  const issues = []
  const suggestions = []

  if (tokens > 500) issues.push({ type: 'length', msg: 'Prompt is very long. Consider breaking it into smaller tasks.' })
  if (prompt.includes('please') || prompt.includes('kindly')) issues.push({ type: 'filler', msg: 'Remove polite filler words — they waste tokens without adding value.' })
  if (prompt.split('\n').length > 10) issues.push({ type: 'structure', msg: 'Many lines detected. Use bullet points for clarity.' })
  if (!prompt.includes('--') && tokens > 200) suggestions.push('Consider using flags like --output or --format to be more specific.')
  if (prompt.toLowerCase().includes('fix this') || prompt.toLowerCase().includes('help me')) suggestions.push('Be specific about what to fix — describe the expected vs actual behavior.')

  return {
    tokens,
    efficiency: tokens < 100 ? 'excellent' : tokens < 300 ? 'good' : tokens < 600 ? 'fair' : 'poor',
    issues,
    suggestions,
    score: Math.max(0, 100 - issues.length * 20 - Math.max(0, tokens - 200) / 10)
  }
}

export const PROMPT_EXAMPLES = [
  {
    label: 'Vago (ineficiente)',
    prompt: 'Please help me fix this code, it\'s not working properly and I would really appreciate your assistance with this issue that I\'m having',
    tokens: 0,
    type: 'bad'
  },
  {
    label: 'Específico (eficiente)',
    prompt: 'Fix TypeError in /src/api.js:42 — map() called on undefined. Expected: array from fetchUsers()',
    tokens: 0,
    type: 'good'
  },
  {
    label: 'Con contexto (óptimo)',
    prompt: 'Bug: login fails with 401 after password reset. Flow: reset → email → link → login. Error in auth.js:88, token comparison fails.',
    tokens: 0,
    type: 'best'
  }
].map(ex => ({ ...ex, tokens: estimateTokens(ex.prompt) }))
