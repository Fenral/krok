export async function ntfyPush(channel: string, message: string): Promise<void> {
  const res = await fetch(`https://ntfy.sh/${channel}`, {
    method: 'POST',
    body: message,
  })
  if (!res.ok) {
    throw new Error(`ntfy push failed: HTTP ${res.status}`)
  }
}
