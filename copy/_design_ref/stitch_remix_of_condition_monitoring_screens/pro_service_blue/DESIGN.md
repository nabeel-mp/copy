---
name: Pro-Service Blue
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#434653'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#737784'
  outline-variant: '#c3c6d5'
  surface-tint: '#215abd'
  primary: '#00357f'
  on-primary: '#ffffff'
  primary-container: '#004aad'
  on-primary-container: '#a9c1ff'
  inverse-primary: '#b0c6ff'
  secondary: '#5d5f5f'
  on-secondary: '#ffffff'
  secondary-container: '#dfe0e0'
  on-secondary-container: '#616363'
  tertiary: '#35393c'
  on-tertiary: '#ffffff'
  tertiary-container: '#4c5053'
  on-tertiary-container: '#bfc2c5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b0c6ff'
  on-primary-fixed: '#001945'
  on-primary-fixed-variant: '#00429b'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#e0e3e6'
  tertiary-fixed-dim: '#c3c7ca'
  on-tertiary-fixed: '#181c1e'
  on-tertiary-fixed-variant: '#43474a'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 24px
  gutter: 16px
  stack-sm: 12px
  stack-md: 20px
---

## Brand & Style

This design system is built for a reliable, logistics-focused mobile experience. The brand personality is professional, efficient, and trustworthy, utilizing a "Modern Corporate" aesthetic that prioritizes clarity and speed of use. 

The visual language balances high-contrast brand elements with functional utility. It employs large, approachable surface areas and clean lines to evoke a sense of security and modern service delivery. The interface is designed to feel "native" and high-performance, ensuring users feel confident while navigating critical tasks like login and order tracking.

## Colors

The palette is anchored by a deep "Pro Blue" (#004AAD) which serves as the primary identifier for brand backgrounds, primary actions, and key semantic highlights. 

- **Primary:** Used for the main splash background and high-emphasis action buttons.
- **Surface:** Pure white is used for the main content containers, creating a "card-on-blue" or "blue-on-white" hierarchy that is highly legible.
- **Background:** A very light cool grey/blue (#F4F7FA) is used for secondary backgrounds to differentiate between content sections.
- **Text:** The primary neutral is a near-black for high legibility on white surfaces. Secondary text uses a mid-tone grey to denote supporting information.

## Typography

The system utilizes **Plus Jakarta Sans** for its friendly yet geometric and professional appearance. Headlines are bold and tight, ensuring impact even at small mobile scales. For technical or utility data, **Inter** provides a highly legible, neutral alternative.

Large display type is reserved for brand moments and splash screens. Functional headings use medium weights to maintain a clean, organized hierarchy without overwhelming the content.

## Layout & Spacing

This design system employs a **Fluid Grid** model optimized for mobile-first delivery. Content is primarily housed within large-radius containers that have a consistent 24px horizontal margin from the screen edge.

The vertical rhythm follows an 8px base unit. Interaction elements (like input fields and buttons) are tall and prominent to accommodate thumb-driven navigation. In mobile views, large top-section headers often occupy the upper 30-40% of the screen to establish brand presence before transitioning into functional white surfaces.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and subtle **Ambient Shadows**. 

1. **Brand Layer:** The base layer is often the primary blue brand color.
2. **Surface Layer:** White cards or containers sit on top of the brand layer, using a 40px - 60px corner radius at the top to create a "sheet" effect.
3. **Interactive Layer:** Inputs and buttons use low-contrast outlines (1px solid primary blue or light grey) rather than heavy shadows to maintain a clean, professional look. 
4. **Active State:** When elements are pressed or active, they may utilize a soft, diffused shadow (10% opacity primary color) to indicate depth.

## Shapes

The design system uses a "Rounded" language to feel modern and accessible. 

- **Primary Containers:** Large sheets and background containers use a 40px (ultra-rounded) radius to create a distinct, modern silhouette.
- **Buttons and Inputs:** These use a consistent 12px - 16px radius.
- **Icons:** Should follow a soft-cornered or "squircle" aesthetic to match the UI components.

## Components

### Buttons
Primary buttons are high-contrast, usually primary blue with white bold text. They should include a distinct "action area" on the left (e.g., a chevron or icon container) to emphasize the forward motion of the service.

### Input Fields
Inputs feature a floating label or a label that breaks the top border. The border remains a constant 1px stroke in primary blue or neutral grey. Inside the field, text is centered vertically for a spacious, touch-friendly feel.

### Cards
Cards are the primary vehicle for information. They should have no border, a subtle off-white background, and high-radius corners. Use internal padding of 16px - 20px to keep content from feeling cramped.

### Checkboxes
Checkboxes are rounded-square shapes, utilizing the primary blue color for the "checked" state to ensure visual consistency with the rest of the brand language.