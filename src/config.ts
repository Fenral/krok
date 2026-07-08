// Eden som åpner biblioteket (sammenlignes uten store/små bokstaver og tegnsetting)
export const OATH_PHRASE = 'Jeg lover høytidelig at jeg pønsker på noe galt'

// Grupperingsterskler — justeres via testene i tests/groupWorks.test.ts
export const KEY_SIMILARITY_THRESHOLD = 0.85 // Levenshtein-likhet mellom normaliserte filnavn
export const CONTENT_SIMILARITY_THRESHOLD = 0.6 // trigram-Jaccard på tekstprøve
export const DUPLICATE_SIMILARITY_THRESHOLD = 0.98 // «trolig duplikat»-flagg

export const TEXT_SAMPLE_LENGTH = 2000 // tegn lagret i docMeta for innholdssammenligning
export const IMPORT_CONCURRENCY = 3 // filer parset samtidig under bulk-import
