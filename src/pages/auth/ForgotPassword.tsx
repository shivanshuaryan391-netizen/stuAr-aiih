import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, MailCheck, TriangleAlert } from 'lucide-react'
import { AuthLayout } from './AuthLayout'
import { useAuth } from '@/services/auth'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
})
type FormValues = z.infer<typeof schema>

export default function ForgotPassword() {
  const { resetPassword, backend } = useAuth()
  const [serverError, setServerError] = useState('')
  const [sentTo, setSentTo] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '' } })

  useEffect(() => {
    document.title = 'Reset password · StuAr AI'
  }, [])

  const onSubmit = async (values: FormValues) => {
    setServerError('')
    try {
      await resetPassword(values.email)
      setSentTo(values.email)
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Could not process reset')
    }
  }

  return (
    <AuthLayout title="Reset your password" subtitle="We'll get you back to studying in a minute.">
      {sentTo ? (
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-400">
            <MailCheck className="h-7 w-7" />
          </div>
          <h2 className="font-display text-lg font-semibold">Check your inbox</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {backend === 'supabase' ? (
              <>We sent a password-reset link to <span className="font-medium text-foreground">{sentTo}</span>. Follow it to set a new password.</>
            ) : (
              <>
                Account found for <span className="font-medium text-foreground">{sentTo}</span>. In local mode
                (no Supabase connected), accounts are stored in this browser — contact your deployment admin, or
                create a new account to continue.
              </>
            )}
          </p>
          <Link to="/login" className="btn-primary mt-6 w-full">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Account email</label>
            <input id="email" type="email" autoComplete="email" className="input-field" placeholder="you@school.edu" {...register('email')} />
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          {serverError && (
            <p className="flex items-start gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs leading-5 text-red-300">
              <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {serverError}
            </p>
          )}
          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailCheck className="h-4 w-4" />}
            Send reset link
          </button>
          <Link to="/login" className="btn-ghost w-full">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </form>
      )}
    </AuthLayout>
  )
}
