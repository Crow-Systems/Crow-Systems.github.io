import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeroSection } from './sections/HeroSection'
import { ServicesSection } from './sections/ServicesSection'
import { ConsultingSection } from './sections/ConsultingSection'
import { AboutSection } from './sections/AboutSection'
import { ContactSection } from './sections/ContactSection'
import { Footer } from './components/layout/Footer'

function App() {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <HeroSection />
        <ServicesSection />
        <ConsultingSection />
        <AboutSection />
        <ContactSection />
        <Footer />

        {/* Scroll to top button */}
        <ScrollToTop />
      </motion.div>
    </AnimatePresence>
  )
}

function ScrollToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-accent text-white shadow-lg hover:bg-accent/90 transition-all duration-300 flex items-center justify-center ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <span className="material-symbols-outlined">arrow_upward</span>
    </button>
  )
}

export default App