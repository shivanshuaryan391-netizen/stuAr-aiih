import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, LogIn, TriangleAlert } from 'lucide-react'
import { AuthLayout } from './AuthLayout'
import { useAuth } from '@/services/auth'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormValues = z.infer<typeof schema>

export function GoogleButton({ label }: { label: string }) {
  const { signInWithGoogle } = useAuth()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <div>
      <button
        type="button"
        className="btn-ghost w-full"
        disabled={busy}
        onClick={async () => {
          setError('')
          setBusy(true)
          try {
            await signInWithGoogle()
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Google sign-in failed')
          } finally {
            setBusy(false)
          }
        }}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.28v3.1A12 12 0 0 0 12 24Z" />
            <path fill="#FBBC05" d="M5.29 14.29A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.57.38-2.29v-3.1H1.28a12 12 0 0 0 0 10.78l4.01-3.1Z" />
            <path fill="#EA4335" d="M12 4.76c1.76 0 3.34.6 4.58 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.28 6.61l4.01 3.1C6.23 6.87 8.88 4.76 12 4.76Z" />
          </svg>
        )}
        {label}
      </button>
      {error && (
        <p className="mt-2.5 flex items-start gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs leading-5 text-amber-300">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      )}
    </div>
  )
}

export default function Login() {
  const { signIn, user } = useAuth()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } })

  useEffect(() => {
    document.title = 'Sign in · StuAr AI'
  }, [])

  useEffect(() => {
    if (user) navigate('/app', { replace: true })
  }, [user, navigate])

  const onSubmit = async (values: FormValues) => {
    setServerError('')
    try {
      await signIn(values.email, values.password)
      navigate('/app', { replace: true })
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Sign-in failed')
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your streak.">
      <div className="space-y-5">
        <GoogleButton label="Continue with Google" />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-white/10" /> or with email <span className="h-px flex-1 bg-white/10" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
            <input id="email" type="email" autoComplete="email" className="input-field" placeholder="you@school.edu" {...register('email')} />
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs font-medium text-aqua-soft hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                className="input-field pr-11"
                placeholder="••••••••"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
          </div>
          {serverError && (
            <p className="flex items-start gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs leading-5 text-red-300">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {serverError}
            </p>
          )}
          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            Sign in
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          New to StuAr AI?{' '}
          <Link to="/register" className="font-semibold text-brand-soft hover:underline">
            Create a free account
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
