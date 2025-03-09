import dynamic from 'next/dynamic'

const HeroSection = dynamic(() => import('@/components/landing/HeroSection'))
const FeaturesSection = dynamic(() => import('@/components/landing/FeaturesSection'))
const HowItWorksSection = dynamic(() => import('@/components/landing/HowItWorksSection'))
const LawFirmsSection = dynamic(() => import('@/components/landing/LawFirmsSection'))
const ContactSection = dynamic(() => import('@/components/landing/ContactSection'))
const Navbar = dynamic(() => import('@/components/landing/Navbar'))
const Footer = dynamic(() => import('@/components/landing/Footer'))

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <LawFirmsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}