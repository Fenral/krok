import { IndexedDbAdapter } from './IndexedDbAdapter'
import type { StorageAdapter } from './StorageAdapter'

// Bytt til en SupabaseAdapter her når skylagring skal på — se SupabaseAdapter.stub.ts.
export const storage: StorageAdapter = new IndexedDbAdapter()
