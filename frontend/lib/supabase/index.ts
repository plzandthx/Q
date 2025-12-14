export { createClient, isSupabaseConfigured } from './client';
// Note: Server client not exported for static builds - import directly from './server' if needed in Server Components
export { AuthProvider, useAuth } from './auth-context';
export type { Database, Tables, InsertTables, UpdateTables, Enums } from './database.types';
export * from './hooks';
