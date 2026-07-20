import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, TriangleAlert, UserPlus } from 'lucide-react'
import { AuthLayout } from './AuthLayout'
import { GoogleButton } from './Login'
import { useAuth } from '@/services/auth'

const schema = z
  .object({
    name: z.string().min(2, 'Tell us your name (2+ characters)').max(60, 'Name is too long'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Use at least 8 characters')
      .regex(/[A-Za-z]/, 'Include at least one letter')
      .regex(/[0-9]/, 'Include at least one number'),
    confirm: z.string(),
    terms: z.boolean().refine((v) => v === true, { message: 'Please accept the terms to continue' }),
  })
  .refine((d) => d.password === d.confirm, { message: 'Passwords do not match', path: ['confirm'] })
type FormValues = z.infer<typeof schema>

function strength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-400' }
  if (score <= 3) return { score, label: 'Good', color: 'bg-amber-400' }
  return { score, label: 'Strong', color: 'bg-emerald-400' }
}

export default function Register() {
  const { signUp, user } = useAuth()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', confirm: '' },
  })
  const pw = watch('password') ?? ''
  const pwStrength = strength(pw)

  useEffect(() => {
    document.title = 'Create account · StuAr AI'
  }, [])
  useEffect(() => {
    if (user) navigate('/app', { replace: true })
  }, [user, navigate])

  const onSubmit = async (values: FormValues) => {
    setServerError('')
    try {
      await signUp(values.name.trim(), values.email, values.password)
      navigate('/app', { replace: true })
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Registration failed')
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Free forever. Upgrade when you're ready.">
      <div className="space-y-5">
        <GoogleButton label="Sign up with Google" />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-white/10" /> or with email <span className="h-px flex-1 bg-white/10" />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Full name</label>
            <input id="name" autoComplete="name" className="input-field" placeholder="Alex Morgan" {...register('name')} />
            {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
            <input id="email" type="email" autoComplete="email" className="input-field" placeholder="you@school.edu" {...register('email')} />
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                id="password"
                type={show ? 'text' : 'password'}
                autoComplete="new-password"
                className="input-field pr-11"
                placeholder="8+ characters"
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
            {pw && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <div className={`h-full rounded-full transition-all duration-500 ${pwStrength.color}`} style={{ width: `${(pwStrength.score / 5) * 100}%` }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{pwStrength.label}</span>
              </div>
            )}
            {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium">Confirm password</label>
            <input id="confirm" type="password" autoComplete="new-password" className="input-field" placeholder="Repeat your password" {...register('confirm')} />
            {errors.confirm && <p className="mt-1.5 text-xs text-red-400">{errors.confirm.message}</p>}
          </div>
          <div>
            <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-input accent-brand" {...register('terms')} />
              <span>
                I agree to the <span className="font-medium text-foreground">Terms of Service</span> and{' '}
                <span className="font-medium text-foreground">Privacy Policy</span>.
              </span>
            </label>
            {errors.terms && <p className="mt-1.5 text-xs text-red-400">{errors.terms.message}</p>}
          </div>
          {serverError && (
            <p className="flex items-start gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs leading-5 text-red-300">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {serverError}
            </p>
          )}
          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Create account
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-soft hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
