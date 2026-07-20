import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Home } from 'lucide-react'
import { BackgroundFX } from '@/components/common/BackgroundFX'
import { Logo } from '@/components/brand/Logo'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found · StuAr AI'
  }, [])
  return (
    <div className="relative grid min-h-screen place-items-center px-6">
      <BackgroundFX subtle />
      <div className="text-center">
        <Logo className="mx-auto mb-10 w-fit" />
        <p className="font-display text-[7rem] font-bold leading-none text-gradient sm:text-[9rem]">404</p>
        <h1 className="mt-2 font-display text-xl font-semibold">This page skipped class</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          The route you&apos;re looking for doesn&apos;t exist — but your study streak is still safe.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/" className="btn-ghost">
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link to="/app" className="btn-primary">
            <Compass className="h-4 w-4" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
