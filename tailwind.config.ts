import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,astro,html}', './pages/**/*.{astro,html,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#218bf6',
          light: '#4ea8f8',
          dark: '#1a6fc4',
          muted: '#d6eefb',
          mutedDim: '#b3d5f2',
        },
        accent: {
          DEFAULT: '#06D6A0',
          light: '#54fdc4',
          dark: '#00513b',
        },
        surface: {
          DEFAULT: '#f8f9ff',
          dim: '#ccdbf3',
          bright: '#f8f9ff',
          lowest: '#ffffff',
          low: '#eff4ff',
          container: '#e6eeff',
          high: '#dce9ff',
          highest: '#d5e3fc',
        },
        neutral: {
          light: '#F4F6FB',
          dark: '#2D3748',
          charcoal: '#2D3748',
        },
        slate: {
          dark: '#1A2744',
        },
        navy: {
          deep: '#0A1628',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk Variable', 'Space Grotesk', 'sans-serif'],
        body: ['Inter Variable', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px' }],
        'body-md': ['16px', { lineHeight: '24px' }],
        'label-md': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '600' }],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      spacing: {
        'margin-mobile': '16px',
        gutter: '24px',
        'margin-desktop': '64px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;