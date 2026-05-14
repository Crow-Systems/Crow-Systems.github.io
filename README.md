# Crow Systems - Astro Project

A modern, professional consulting platform built with Astro, React, and Tailwind CSS.

## Features

- **Hero / Landing Section** - Clear messaging with trust indicators
- **Services Section** - 6 consulting service cards with icons
- **Audio Idea Submission** - Browser-based MediaRecorder API for voice submissions
- **Consulting Request Form** - Full form with inline validation (Zod + React Hook Form)
- **About Section** - Company story, mission/vision, values, team
- **Contact Section** - Lightweight contact form with validation
- **SEO Optimized** - Semantic HTML, meta tags, Open Graph, JSON-LD ready
- **Accessible** - WCAG 2.1 AA compliance, keyboard navigation, ARIA labels
- **Responsive** - Mobile-first design
- **API-Ready** - Configurable endpoints via environment variables

## Tech Stack

- Astro 5
- React 19
- TypeScript (strict)
- Tailwind CSS 4
- React Hook Form + Zod

## Project Structure

```
src/
  api/          - API wrappers and request logic
  assets/       - Static assets
  components/   - Reusable UI components
    ui/         - Primitives (Button, Input, Card, etc.)
    layout/     - Layout components (Navbar, MainLayout)
  config/       - Global configuration (API endpoints, env vars)
  data/         - Static content and constants
  hooks/        - Reusable React hooks (useAudioRecorder, useForms)
  sections/     - Page sections (Services, About, Consulting, etc.)
  services/     - Integration services
  styles/       - Global CSS styles
  types/        - Shared TypeScript interfaces
  utils/        - Utility helpers
  pages/        - Astro pages (index, about, consulting, contact, 404)
```

## Environment Variables

```env
PUBLIC_API_BASE_URL=https://crowsys.chrislabs.net/api/v1
PUBLIC_CONTACT_ENDPOINT=/contact
PUBLIC_CONSULTATION_ENDPOINT=/consultation
PUBLIC_AUDIO_UPLOAD_ENDPOINT=/audio/upload
```

## Development

```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Deployment

Production deployment target: GitHub Pages (static)
Run `bun run build` to generate static output in `dist/`.