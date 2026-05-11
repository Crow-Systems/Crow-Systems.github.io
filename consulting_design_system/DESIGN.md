---
name: Consulting Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#414754'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#717785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005cba'
  primary: '#005ab5'
  on-primary: '#ffffff'
  primary-container: '#0072e3'
  on-primary-container: '#fefcff'
  inverse-primary: '#aac7ff'
  secondary: '#006c4f'
  on-secondary: '#ffffff'
  secondary-container: '#51fac1'
  on-secondary-container: '#007152'
  tertiary: '#595c5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#727577'
  on-tertiary-container: '#fbfdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e3ff'
  primary-fixed-dim: '#aac7ff'
  on-primary-fixed: '#001b3e'
  on-primary-fixed-variant: '#00458e'
  secondary-fixed: '#54fdc4'
  secondary-fixed-dim: '#27e0a9'
  on-secondary-fixed: '#002116'
  on-secondary-fixed-variant: '#00513b'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The brand personality is rooted in the intersection of high-level technical expertise and human-centric partnership. This design system moves away from the cold, intimidating aesthetics often found in traditional "Big Tech" to embrace a "Non-Scary" and approachable visual language. 

The design style is **Corporate / Modern** with a lean toward **Minimalism**. It utilizes generous whitespace, purposeful technical accents, and a soft-focus lens on professional interactions. The goal is to evoke a sense of reliability and innovation through clarity. By removing unnecessary visual noise, we create an environment where complex technological solutions feel accessible and manageable.

## Colors

The palette is designed to be inviting yet authoritative. 

- **Primary (Trust Blue):** We use a softened medium blue (#2B88FF) as our anchor. It conveys stability and intelligence without the aggressive intensity of pure cobalt.
- **Accent (Refreshing Mint):** A soft teal (#06D6A0) provides a vibrant contrast, used sparingly to highlight innovation, growth, and positive outcomes.
- **Backgrounds:** We prioritize "Paper" whites (#FFFFFF) and "Cloud" grays (#F1F5F9) to keep the interface feeling light and breathable.
- **Typography & UI:** Deep slates and muted charcoals replace pure blacks to reduce eye strain and maintain a sophisticated, soft-contrast appearance.

## Typography

This system uses a dual-font strategy to balance technical edge with functional readability.

- **Headlines:** **Space Grotesk** is used for all headings. Its geometric, slightly eccentric letterforms reflect a modern, futuristic outlook while remaining professional.
- **Body & Labels:** **Inter** is utilized for all functional text. It offers exceptional legibility at small sizes and maintains a neutral, systematic tone that complements the personality of the headlines.

Hierarchy is established through clear weight variations (SemiBold for headers, Regular for body) and consistent vertical rhythm.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop to ensure content remains readable and focused, transitioning to a fluid model on smaller devices.

- **Grid:** A 12-column grid is standard for desktop (max-width 1280px) with 24px gutters. For mobile, a 4-column grid with 16px margins is used.
- **Spacing Rhythm:** We use a 4px-based scale to maintain mathematical harmony. Components should favor generous internal padding (MD or LG) to support the "approachable" brand pillar.
- **Vertical Flow:** Section-to-section spacing should be significant (XL) to allow the technical concepts room to breathe.

## Elevation & Depth

To maintain a clean and non-threatening aesthetic, depth is achieved through **Tonal Layers** and **Ambient Shadows** rather than heavy borders.

- **Surface Tiers:** Backgrounds are Level 0 (#F8FAFC). Cards and primary containers are Level 1 (#FFFFFF).
- **Shadows:** Use extremely soft, low-opacity shadows (Blur 20px, Spread 0, Opacity 4% Black) to give the impression of elements floating slightly above the surface.
- **Interactive Depth:** On hover, elements should lift slightly (increasing shadow spread and decreasing Y-offset) to provide tactile feedback without looking "heavy."

## Shapes

The shape language is defined by **Subtle Rounding (ROUND_FOUR)**. This avoids the clinical feel of sharp corners and the overly-playful feel of pill shapes.

- **Components:** Buttons, input fields, and small UI elements use a 4px (0.25rem) radius.
- **Containers:** Larger cards and modals use a 8px (0.5rem) radius to soften the visual footprint of large surfaces.
- **Icons:** Should be encased in rounded-square containers or utilize a consistent 1.5pt stroke weight with slightly rounded ends to match the UI.

## Components

- **Buttons:** Primary buttons use a solid Trust Blue background with white Inter Medium text. Secondary buttons use a transparent background with a 1px Blue border.
- **Chips/Badges:** Use the Mint Green accent at 10% opacity with 100% opacity text for "Success" or "Innovative" tags. All chips use a 4px corner radius.
- **Inputs:** Fields are defined by a light gray border (#E2E8F0) that transitions to Trust Blue on focus. Labels sit clearly above the field in Inter SemiBold 12px.
- **Cards:** White backgrounds with the defined ambient shadow. Avoid borders on cards; use the shadow and whitespace to define the boundary.
- **Data Visualization:** When presenting metrics, use Mint Green for growth and Trust Blue for baseline data. Keep charts minimal with hidden axes where possible to maintain the clean aesthetic.
- **Navigation:** Top-level navigation uses Inter Medium with high horizontal padding (24px) to ensure a spacious, premium feel.