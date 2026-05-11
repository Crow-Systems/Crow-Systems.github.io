import { createContext, useContext, useMemo } from 'react'
import type { AppConfig } from '@/types'

interface AppContextValue {
  config: AppConfig
  navigateTo: (path: string) => void
  navigateToSection: (sectionId: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
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
      navigateTo: (path: string) => {
        window.location.href = path
      },
      navigateToSection: (sectionId: string) => {
        const el = document.getElementById(sectionId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      },
    }),
    [],
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