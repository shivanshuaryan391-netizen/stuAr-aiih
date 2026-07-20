export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }>
}

export interface StreamOptions {
  apiKey: string
  model: string
  messages: AIMessage[]
  signal?: AbortSignal
  onToken?: (full: string, delta: string) => void
  temperature?: number
  maxTokens?: number
}

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

export class AIError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

/** Stream a chat completion from OpenRouter via SSE. Returns the full text. */
export async function streamChat(opts: StreamOptions): Promise<string> {
  const { apiKey, model, messages, signal, onToken } = opts
  let res: Response
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'StuAr AI',
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.maxTokens ?? 4096,
      }),
    })
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e
    throw new AIError('Network error — check your connection and try again.')
  }

  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const data = await res.json()
      detail = data?.error?.message || data?.message || detail
    } catch {
      // keep default
    }
    if (res.status === 401) detail = 'Invalid OpenRouter API key. Check it in Settings.'
    if (res.status === 402) detail = 'OpenRouter credits exhausted. Top up at openrouter.ai or pick a free model.'
    if (res.status === 429) detail = 'Rate limited — wait a moment and try again.'
    throw new AIError(detail, res.status)
  }

  if (!res.body) throw new AIError('Empty response from model.')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let full = ''

  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const payload = trimmed.slice(5).trim()
      if (payload === '[DONE]') {
        return full
      }
      try {
        const json = JSON.parse(payload)
        const delta: string = json?.choices?.[0]?.delta?.content ?? ''
        if (delta) {
          full += delta
          onToken?.(full, delta)
        }
      } catch {
        // partial chunk — ignore
      }
    }
  }
  return full
}

/** Non-streaming helper used by structured generators (flashcards, quiz). */
export async function complete(opts: Omit<StreamOptions, 'onToken'>): Promise<string> {
  const { apiKey, model, messages, signal } = opts
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'StuAr AI',
    },
    body: JSON.stringify({
      model,
      messages,
      stream: false,
      temperature: opts.temperature ?? 0.5,
      max_tokens: opts.maxTokens ?? 4096,
    }),
  })
  if (!res.ok) {
    let detail = `Request failed (${res.status})`
    try {
      const data = await res.json()
      detail = data?.error?.message || detail
    } catch {
      // keep default
    }
    throw new AIError(detail, res.status)
  }
  const data = await res.json()
  return data?.choices?.[0]?.message?.content ?? ''
}

/** Extract a JSON value from model output (fenced block or first balanced bracket). */
export function extractJson<T>(text: string): T {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fence ? fence[1]! : text
  const first = candidate.search(/[[{]/)
  if (first === -1) throw new AIError('The model did not return structured data. Try again.')
  const open = candidate[first]!
  const close = open === '[' ? ']' : '}'
  let depth = 0
  let inStr = false
  let esc = false
  for (let i = first; i < candidate.length; i++) {
    const ch = candidate[i]!
    if (esc) {
      esc = false
      continue
    }
    if (ch === '\\') {
      esc = true
      continue
    }
    if (ch === '"') inStr = !inStr
    if (inStr) continue
    if (ch === open) depth++
    if (ch === close) {
      depth--
      if (depth === 0) {
        return JSON.parse(candidate.slice(first, i + 1)) as T
      }
    }
  }
  throw new AIError('The model returned incomplete data. Try again.')
}

export const TUTOR_SYSTEM = `You are StuAr AI, an elite AI tutor built for school students, college students, competitive-exam aspirants, teachers and self-learners.

Rules you always follow:
- Teach, don't just answer: explain reasoning step by step, define terms briefly, and end with a quick check or practice hint when useful.
- Use clean markdown: headings, bullet points, numbered steps, LaTeX-style formulas inside $...$ when needed, and fenced code blocks with a language tag.
- Match the learner's level when stated; otherwise assume an ambitious high-school/early-college level.
- Be precise and honest. If unsure, say so and suggest how to verify.
- Keep formatting skimmable. Bold key terms. Use tables for comparisons.
- For problems: show the method, the worked solution, and a common-mistake warning.`
