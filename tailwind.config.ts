import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A1628',
        'primary-alt': '#1A2744',
        accent: '#0077FF',
        'accent-alt': '#06D6A0',
        'neutral-light': '#F4F6FB',
        'neutral-dark': '#2D3748',
        surface: '#F8F9FF',
        'surface-dim': '#CCD8F3',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#EFF4FF',
        'surface-container': '#E6EEFF',
        'surface-container-high': '#DCE9FF',
        'surface-container-highest': '#D5E3FC',
        'on-surface': '#0D1C2E',
        'on-surface-variant': '#414754',
        outline: '#717785',
        'outline-variant': '#C1C6D6',
        'primary-fixed': '#AAC7FF',
        'primary-fixed-dim': '#D7E3FF',
        'on-primary': '#FFFFFF',
        'on-primary-fixed': '#001B3E',
        secondary: '#006C4F',
        'secondary-container': '#51FAC1',
        'on-secondary-container': '#007152',
        'secondary-fixed': '#54FDC4',
        'secondary-fixed-dim': '#27E0A9',
        'on-secondary-fixed': '#002116',
        error: '#BA1A1A',
        'on-error': '#FFFFFF',
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      spacing: {
        '72': '18rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}

export default config