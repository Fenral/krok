import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ntfyPush } from '../tools/ntfy-push'

describe('ntfy-push', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('POSTer melding til riktig channel-URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await ntfyPush('krok-loop', 'Runde 3: GREEN')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://ntfy.sh/krok-loop',
      expect.objectContaining({ method: 'POST', body: 'Runde 3: GREEN' }),
    )
  })

  it('throws hvis fetch returnerer !ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    await expect(ntfyPush('krok-loop', 'x')).rejects.toThrow(/500/)
  })
})
