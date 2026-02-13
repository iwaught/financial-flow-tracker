// Supabase is disabled for simplified deployment
// This stub provides a compatible API for offline use

const createMockClient = () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => ({ data: null, error: { message: 'Authentication disabled' } }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Authentication disabled' } }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: { code: 'PGRST116' } }),
          limit: async () => ({ data: [], error: null }),
        }),
        order: () => ({
          limit: async () => ({ data: [], error: null }),
        }),
        limit: async () => ({ data: [], error: null }),
      }),
      insert: () => ({
        select: async () => ({ data: null, error: { message: 'Database disabled' } }),
      }),
      update: () => ({
        eq: () => ({
          select: async () => ({ data: null, error: { message: 'Database disabled' } }),
        }),
      }),
      upsert: () => ({
        select: async () => ({ data: null, error: { message: 'Database disabled' } }),
      }),
    }),
  }
}

export const supabase = createMockClient()
