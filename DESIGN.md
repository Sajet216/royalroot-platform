---
name: Ethereal Grandeur
colors:
  surface: '#faf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#faf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeeb'
  surface-container-high: '#e9e8e5'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1a'
  on-surface-variant: '#444748'
  inverse-surface: '#2f312f'
  inverse-on-surface: '#f2f1ee'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#775a19'
  on-secondary: '#ffffff'
  secondary-container: '#fed488'
  on-secondary-container: '#785a1a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#291806'
  on-tertiary-container: '#9a7f65'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#fedcbe'
  tertiary-fixed-dim: '#e1c1a4'
  on-tertiary-fixed: '#291806'
  on-tertiary-fixed-variant: '#59422c'
  background: '#faf9f6'
  on-background: '#1a1c1a'
  surface-variant: '#e3e2e0'
typography:
  display-xl:
    fontFamily: notoSerif
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg:
    fontFamily: notoSerif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: notoSerif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: notoSerif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1440px
  gutter: 32px
  margin-desktop: 80px
  section-gap: 120px
---

## Brand & Style

This design system embodies the concept of "Architectural Silence." It is designed for a discerning clientele that values heritage, craftsmanship, and modern curation. The brand personality is authoritative yet understated, prioritizing the physical beauty of furniture over interface noise.

The visual direction follows a **Minimalist** approach with **Tactile** undertones. By utilizing expansive whitespace and a restrained palette, the interface acts as a gallery frame for high-fidelity product photography. The emotional response is one of calm, exclusivity, and timelessness, ensuring the digital experience feels as intentional as a bespoke interior.

## Colors

The color strategy relies on a foundation of "Warm Neutrals" to avoid the clinical feel of pure blacks and whites. 

- **Primary (Charcoal):** Used for primary text and structural elements to provide grounding and weight.
- **Secondary (Muted Gold):** Reserved for high-value calls to action, small accents, and luxury indicators.
- **Tertiary (Deep Oak):** An organic anchor used sparingly for depth in iconography or subtle dividers.
- **Neutral (Warm White):** The primary canvas color, chosen to harmonize with natural wood tones and soft fabrics in imagery.

## Typography

This design system employs a sophisticated typographic hierarchy that pairs the literary elegance of **Noto Serif** with the functional precision of **Inter**. 

Headlines use generous leading and tight letter-spacing in larger formats to create a "vogue" editorial feel. Body text is optimized for readability with increased line height (1.6) to ensure descriptions of materials and dimensions feel approachable. Labels and small utility text utilize uppercase tracking to denote a sense of premium categorization.

## Layout & Spacing

The layout philosophy centers on a **Fixed Grid** system that prioritizes negative space. A 12-column grid is used for the main content area, with a maximum width of 1440px to prevent lines of text from becoming uncomfortably long on ultra-wide monitors.

Spacing is aggressive in its use of "air." Vertical gaps between sections should be large (120px+) to allow each piece of furniture to exist in its own visual context. Internal component spacing follows an 8px rhythmic scale, ensuring that while the overall layout is expansive, individual interactive elements remain tight and disciplined.

## Elevation & Depth

Depth in this design system is achieved through **Ambient Shadows** and tonal layering rather than heavy borders. 

- **Level 1 (Surface):** Warm White background.
- **Level 2 (Cards/Navigation):** Uses a highly diffused, low-opacity shadow (4% opacity Charcoal) with a large blur radius (30px+) to simulate a soft "lift" off the surface.
- **Level 3 (Modals/Overlays):** Incorporates a subtle backdrop blur (8px) to maintain the sense of light passing through the interface, keeping the experience airy.

Avoid heavy solid borders; use 1px Soft Grey (#E5E5E5) strokes only when necessary for structural definition in complex forms.

## Shapes

The shape language is "Softly Geometric." Elements use a subtle 4px corner radius (Soft) to bridge the gap between the rigid lines of architectural modernism and the organic comfort of home furniture. 

This restrained roundedness applies to buttons, input fields, and image containers. Large-scale imagery containers may occasionally use sharp (0px) corners to emphasize a "full-bleed" editorial look, but interactive components must remain consistent with the soft-radius standard to signal touchability.

## Components

Components follow the **Shadcn/UI** structural pattern, emphasizing light weights and high-quality interaction states.

- **Buttons:** The primary button is a solid Charcoal with Warm White text. The secondary "Gold" variant is used only for high-conversion moments (e.g., "Inquire" or "Purchase"). Ghost buttons use a subtle Oak text color with no background.
- **Inputs:** Minimalist bottom-border-only or very light 4nd-radius outlines. Focus states should be a subtle transition to the Muted Gold color.
- **Cards:** Product cards are borderless with a soft ambient shadow on hover. The product name (Serif) and price (Sans) should have a clear vertical hierarchy.
- **Chips/Badges:** Small, uppercase labels with a Soft Grey background and Charcoal text. Used for material types (e.g., "SOLID OAK", "VELVET").
- **Interactive Lists:** Clean dividers using 1px Soft Grey lines, with generous 24px padding between items to maintain the premium feel.
- **Imagery Containers:** Every image should have a subtle 1px inner stroke to give the photography a "finished" edge.
