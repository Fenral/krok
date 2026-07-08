// FREMTIDIG: skylagring via Supabase (utsatt etter eget ønske).
//
// Skisse når den tid kommer:
//   npm i @supabase/supabase-js
//   - Storage-bucket «manuskripter» for originalbytes (nøkkel = docId)
//   - Tabeller: doc_meta (kolonner som DocRecord), doc_text (id, text, html),
//     meta (k, v jsonb) — RLS på auth.uid()
//   - Implementer StorageAdapter 1:1; putDoc laster opp blob + upserter rader
//   - Bytt eksporten i ./index.ts til new SupabaseAdapter(url, anonKey)
//
// Resten av appen trenger ingen endringer — det er hele poenget med sømmen.
export {}
