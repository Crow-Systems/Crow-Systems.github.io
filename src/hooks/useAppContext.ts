import { createContext, useContext, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { AppConfig } from '@/types'

interface AppContextValue {
  config: AppConfig
  isHomePage: boolean
  navigateTo: (path: string) => void
  navigateToSection: (sectionId: string) => void
  isActiveSection: (sectionId: string) => boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()

  const context = useMemo(
    () => ({
      config: {
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://crowsys.chrislabs.net/api/v1',
        contactEndpoint: '/contact',
        consultationEndpoint: '/consultation',
        audioUploadEndpoint: '/audio/upload',
        linkedinUrl: 'https://linkedin.com/company/crow-systems',
        supportEmail: 'solutions@crowsystems.tech',
        companyRegion: 'International',
        siteName: 'Crow Systems',
      },
      isHomePage: location.pathname === '/' || location.pathname === '',
      navigateTo: (path: string) => navigate(path),
      navigateToSection: (sectionId: string) => {
        const el = document.getElementById(sectionId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.location.href = `/#${sectionId}`
        }
      },
      isActiveSection: (sectionId: string) => {
        const el = document.getElementById(sectionId)
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom >= 100
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.pathname],
  )

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return ctx
}