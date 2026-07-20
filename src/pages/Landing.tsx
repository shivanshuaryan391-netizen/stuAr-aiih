import { useEffect } from 'react'
import { BackgroundFX } from '@/components/common/BackgroundFX'
import { LandingNav } from '@/sections/landing/Nav'
import { Hero } from '@/sections/landing/Hero'
import { Features, Why } from '@/sections/landing/Sections'
import { ToolsShowcase } from '@/sections/landing/ToolsShowcase'
import { Testimonials } from '@/sections/landing/Testimonials'
import { Pricing } from '@/sections/landing/Pricing'
import { Contact, Faq } from '@/sections/landing/FaqContact'
import { Footer } from '@/sections/landing/Footer'

export default function Landing() {
  useEffect(() => {
    document.title = 'StuAr AI — Learn Smarter. Build Your Future.'
  }, [])

  return (
    <div className="relative min-h-screen">
      <BackgroundFX />
      <LandingNav />
      <main>
        <Hero />
        <Features />
        <Why />
        <ToolsShowcase />
        <Testimonials />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
