import { readCoreProps } from '../docx/coreProps'
import { countWords, parseDocx } from '../docx/parseDocx'

export interface WorkerRequest {
  seq: number
  buffer: ArrayBuffer
}

export type WorkerResponse =
  | {
      seq: number
      ok: true
      text: string
      html: string
      wordCount: number
      modifiedDocx: number | null
      docxTitle: string | null
    }
  | { seq: number; ok: false; error: string }

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { seq, buffer } = e.data
  try {
    const core = readCoreProps(new Uint8Array(buffer))
    const { text, html } = await parseDocx(buffer)
    const res: WorkerResponse = {
      seq,
      ok: true,
      text,
      html,
      wordCount: countWords(text),
      modifiedDocx: core.modified,
      docxTitle: core.title,
    }
    self.postMessage(res)
  } catch (err) {
    const res: WorkerResponse = { seq, ok: false, error: err instanceof Error ? err.message : String(err) }
    self.postMessage(res)
  }
}
