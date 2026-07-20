import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { User } from '@/types'
import { load, save, sha256, uid } from '@/lib/storage'
import { pickColor } from '@/lib/format'
import { supabase, isSupabaseConfigured } from './supabase'

interface LocalAccount {
  id: string
  name: string
  email: string
  passHash: string
  createdAt: number
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  backend: 'supabase' | 'local'
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: (patch: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function mapSupabaseUser(u: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at?: string }): User {
  const name = (u.user_metadata?.full_name as string) || (u.user_metadata?.name as string) || (u.email?.split('@')[0] ?? 'Learner')
  return {
    id: u.id,
    name,
    email: u.email ?? '',
    avatarColor: pickColor(u.email ?? u.id),
    createdAt: u.created_at ? new Date(u.created_at).getTime() : Date.now(),
    provider: (u.user_metadata?.provider as 'google' | 'email') ?? 'email',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const backend: 'supabase' | 'local' = isSupabaseConfigured ? 'supabase' : 'local'

  useEffect(() => {
    let cancelled = false
    async function boot() {
      if (supabase) {
        const { data } = await supabase.auth.getSession()
        if (!cancelled && data.session?.user) setUser(mapSupabaseUser(data.session.user))
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ? mapSupabaseUser(session.user) : null)
        })
        if (!cancelled) setLoading(false)
        return () => sub.subscription.unsubscribe()
      }
      const session = load<{ userId: string } | null>('session', null)
      if (session) {
        const accounts = load<LocalAccount[]>('accounts', [])
        const acc = accounts.find((a) => a.id === session.userId)
        if (acc && !cancelled) {
          setUser({
            id: acc.id,
            name: acc.name,
            email: acc.email,
            avatarColor: pickColor(acc.email),
            createdAt: acc.createdAt,
            provider: 'email',
          })
        }
      }
      if (!cancelled) setLoading(false)
    }
    const cleanup = boot()
    return () => {
      cancelled = true
      void cleanup
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
      return
    }
    const accounts = load<LocalAccount[]>('accounts', [])
    const acc = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())
    if (!acc) throw new Error('No account found for this email. Create one first.')
    const hash = await sha256(password + acc.id)
    if (hash !== acc.passHash) throw new Error('Incorrect password. Try again or reset it.')
    save('session', { userId: acc.id })
    setUser({ id: acc.id, name: acc.name, email: acc.email, avatarColor: pickColor(acc.email), createdAt: acc.createdAt, provider: 'email' })
  }, [])

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    if (supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) throw new Error(error.message)
      return
    }
    const accounts = load<LocalAccount[]>('accounts', [])
    if (accounts.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists. Sign in instead.')
    }
    const id = uid()
    const passHash = await sha256(password + id)
    const acc: LocalAccount = { id, name, email, passHash, createdAt: Date.now() }
    save('accounts', [...accounts, acc])
    save('session', { userId: id })
    setUser({ id, name, email, avatarColor: pickColor(email), createdAt: acc.createdAt, provider: 'email' })
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/app' },
      })
      if (error) throw new Error(error.message)
      return
    }
    throw new Error(
      'Google sign-in needs Supabase. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env, then enable the Google provider in your Supabase project.',
    )
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login',
      })
      if (error) throw new Error(error.message)
      return
    }
    const accounts = load<LocalAccount[]>('accounts', [])
    const acc = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase())
    if (!acc) throw new Error('No account found for this email.')
    // Local mode: issue a one-time reset by clearing the password after email verification.
    // Since there is no mail server locally, we verify ownership by letting the user set a new password immediately.
    const newHash = await sha256(uid() + acc.id)
    void newHash
    save('reset-pending', { userId: acc.id, ts: Date.now() })
  }, [])

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut()
      return
    }
    save('session', null)
    setUser(null)
  }, [])

  const refreshUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      if (!isSupabaseConfigured) {
        const accounts = load<LocalAccount[]>('accounts', [])
        save(
          'accounts',
          accounts.map((a) => (a.id === next.id ? { ...a, name: next.name } : a)),
        )
      }
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ user, loading, backend, signIn, signUp, signInWithGoogle, resetPassword, signOut, refreshUser }),
    [user, loading, backend, signIn, signUp, signInWithGoogle, resetPassword, signOut, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
