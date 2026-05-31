import { readState, writeState } from '../eval/state'

/**
 * Poller ntfy-channel via JSON Streaming API. Hvis vi ser melding "stop",
 * setter manualStop=true i state.json. Kjøres som sidekick under loopen.
 */
export async function ntfyWatch(channel: string, statePath: string): Promise<void> {
  const url = `https://ntfy.sh/${channel}/json`
  const res = await fetch(url)
  if (!res.body) throw new Error('ntfy stream uten body')

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const msg = JSON.parse(line) as { event?: string; message?: string }
        if (msg.event === 'message' && msg.message?.toLowerCase().trim() === 'stop') {
          const s = readState(statePath)
          s.manualStop = true
          writeState(statePath, s)
          return
        }
      } catch {
        // ignore non-JSON lines
      }
    }
  }
}
