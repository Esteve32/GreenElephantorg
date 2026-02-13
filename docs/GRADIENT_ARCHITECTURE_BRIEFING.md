# Gradient Architecture Briefing

## Purpose
This document captures all learnings from building the seamless gradient system on the GreenElephant.org homepage. Follow these guidelines when working on other pages to avoid the same problems and ensure visual consistency.

---

## Core Problem We Solved

The homepage features a "space-to-earth descent" visual narrative with multiple sections flowing from dark space through blue atmosphere to a vibrant Finnish archipelago landscape, then fading to black at the footer. The challenge was eliminating visible seams/lines where gradients meet background images.

---

## Key Learnings

### 1. NEVER Use Gradient Overlays to Blend Images

**The Problem:**
When you place a gradient overlay on top of an image to "blend" its edges, the gradient's opaque color START point creates a visible horizontal line. Even if the colors technically match, the doubling of color creates a perceptible seam.

**Bad Pattern (Creates Seams):**
```tsx
{/* Image layer */}
<div style={{ backgroundImage: `url(${image})` }} />
{/* Overlay to blend - THIS CREATES A SEAM */}
<div style={{ background: "linear-gradient(to bottom, #3ba4c0 0%, transparent 100%)" }} />
```

**Good Pattern (Seamless):**
```tsx
{/* Use CSS mask to fade the IMAGE ITSELF */}
<div 
  style={{ 
    backgroundImage: `url(${image})`,
    maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 100%)"
  }} 
/>
```

### 2. Use Shared Color Tokens

**The Problem:**
Hardcoded hex values that "look the same" can have subtle chroma differences that the human eye perceives as a seam, even if a color picker shows them as identical.

**Solution:**
Always import colors from `client/src/constants/atmosphericGradient.ts`:
```tsx
import { atmosphericPalette } from "@/constants/atmosphericGradient";

// Use the token, not a hardcoded hex
style={{ background: `linear-gradient(..., ${atmosphericPalette.highAtmosphere} 100%)` }}
```

### 3. Match Section Endpoint Colors Exactly

When section A ends and section B begins, the ending gradient color of A MUST be the exact same variable as the starting gradient color of B:

```tsx
// Section A (JourneySection)
background: `linear-gradient(..., ${atmosphericPalette.highAtmosphere} 100%)`

// Section B (LandingSection) 
background: `linear-gradient(${atmosphericPalette.highAtmosphere} 0%, ...)`
```

### 4. Avoid Interior Borders at Section Boundaries

**The Problem:**
A `border-t` or any horizontal line near a section boundary can appear to be a seam between sections, even if it's actually inside the content.

**Solution:**
Remove borders near section tops/bottoms, or ensure they're clearly positioned as content dividers (with sufficient padding) rather than appearing at the section edge.

### 5. Confine Atmospheric Tints to Image Areas Only

If you want to add a subtle color tint over an image, ensure the tint overlay ONLY covers the image area and never extends into the content/text area above:

```tsx
{/* CORRECT: Tint confined to image height */}
<div 
  className="absolute bottom-0 left-0 right-0 h-[55%]"
  style={{ 
    background: `linear-gradient(to bottom, ${atmosphericPalette.skyHorizon}99 0%, transparent 35%)`
  }}
/>
```

---

## Available Tools

### Color Palette (`atmosphericPalette`)
```typescript
{
  space: "#0a1628",           // Darkest - deep space
  highAtmosphere: "#0a2a48",  // High altitude blue
  upperAtmosphere: "#0e3d5c", // Upper atmosphere
  midAtmosphere: "#1a6180",   // Mid atmosphere
  lowerAtmosphere: "#2784a8", // Lower atmosphere
  skyHorizon: "#3ba4c0",      // Horizon sky blue
  horizonWater: "#3d9eb8",    // Water at horizon
  deepWater: "#2a7a9a",       // Deep water
  abyss: "#000000",           // Pure black
}
```

### Reusable Mask Presets (`imageMaskStyles`)
```typescript
// Fade image TOP edge to transparent
imageMaskStyles.topFade

// Fade image BOTTOM edge to transparent  
imageMaskStyles.bottomFade

// Fade BOTH edges to transparent
imageMaskStyles.bothFades
```

Usage:
```tsx
<div 
  style={{ 
    backgroundImage: `url(${myImage})`,
    ...imageMaskStyles.topFade
  }}
/>
```

### Pre-built Gradients
```typescript
// Full atmospheric gradient for landing sections
landingSectionGradient

// Footer fade to black
footerFadeGradient
```

---

## Layering Pattern (Z-Index Order)

When building complex sections with images and gradients:

1. **z-[1]**: Base atmospheric gradient (covers full section)
2. **z-[2]**: Background image with CSS mask
3. **z-[3]**: Optional atmospheric tint (confined to image area only)
4. **z-[4]**: Footer/edge fade overlays
5. **z-10+**: Content (text, buttons, etc.)

---

## Debugging Checklist

When you see a visible line/seam:

1. [ ] Check for gradient overlays starting with opaque colors - replace with CSS masks
2. [ ] Verify section endpoint colors use the SAME token variable
3. [ ] Look for `border-t`, `border-b`, or box-shadows near section boundaries
4. [ ] Ensure any tint overlays are confined to image areas only
5. [ ] Check z-index ordering - content should be above all gradient layers
6. [ ] Test on different monitors - subtle color differences are more visible on some displays

---

## Example: Full Section Structure

```tsx
function MySection() {
  return (
    <section 
      style={{ backgroundColor: atmosphericPalette.skyHorizon }}
    >
      {/* Layer 1: Atmospheric gradient */}
      <div 
        className="absolute inset-0 z-[1]"
        style={{ background: landingSectionGradient }}
      />
      
      {/* Layer 2: Background image with mask */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[55%] bg-cover bg-top z-[2]"
        style={{ 
          backgroundImage: `url(${myImage})`,
          ...imageMaskStyles.topFade
        }}
      />
      
      {/* Layer 3: Atmospheric tint (image area only) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[55%] z-[3]"
        style={{ 
          background: `linear-gradient(to bottom, ${atmosphericPalette.skyHorizon}99 0%, transparent 35%)`
        }}
      />
      
      {/* Layer 4: Footer fade */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[30%] z-[4]"
        style={{ background: footerFadeGradient }}
      />
      
      {/* Layer 5: Content */}
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </section>
  );
}
```

---

## Files to Reference

- **Color tokens & masks**: `client/src/constants/atmosphericGradient.ts`
- **Implementation example**: `client/src/pages/HomePage.tsx` (LandingSection)
- **Project docs**: `replit.md` (Gradient Architecture Pattern section)

---

## Alternative Approach: Floating Card Design

When gradient blending proves too difficult or seams persist, use the **floating card pattern** instead:

### The Concept
Instead of trying to blend an image seamlessly into a gradient background, present the image as a distinct, contained element - like a window or portal.

### Implementation
```tsx
<section 
  style={{ 
    background: `linear-gradient(180deg, 
      ${atmosphericPalette.highAtmosphere} 0%, 
      ${atmosphericPalette.upperAtmosphere} 50%, 
      ${atmosphericPalette.midAtmosphere} 100%
    )`
  }}
>
  {/* Content on solid gradient - no image blending needed */}
  <div className="text-center mb-16">
    <h2>Your Heading</h2>
    <p>Your content here...</p>
  </div>

  {/* Image as floating card - completely contained */}
  <div 
    className="rounded-2xl overflow-hidden shadow-2xl max-w-4xl mx-auto"
    style={{ 
      boxShadow: "0 25px 80px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(59, 164, 192, 0.2)"
    }}
  >
    <img 
      src={imageUrl} 
      alt="Description" 
      className="w-full h-[400px] object-cover"
    />
    {/* Optional: subtle vignette */}
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{
        background: "radial-gradient(ellipse at center, transparent 40%, rgba(10, 42, 72, 0.4) 100%)"
      }}
    />
  </div>

  {/* Bottom fade to next section */}
  <div 
    className="absolute bottom-0 left-0 right-0 h-32"
    style={{ background: `linear-gradient(to bottom, transparent 0%, ${atmosphericPalette.abyss} 100%)` }}
  />
</section>
```

### Benefits
1. **No seams possible** - the image is contained within a card with defined borders
2. **Elegant presentation** - the rounded corners and shadow create a premium feel
3. **Simpler implementation** - no complex layering or mask calculations
4. **Responsive** - the card scales naturally on different devices
5. **Semantic** - presents the image as a distinct visual element with meaning

### When to Use This Pattern
- When gradient-to-image blending creates persistent seams
- When you want to present an image as a "window" or "portal" to somewhere
- When the image represents a destination or goal
- When a premium, contained aesthetic is desired

---

## Summary

**Two reliable approaches for images with gradients:**

1. **CSS Mask Blending**: Use `maskImage` to fade the image's edges into the gradient. Works when you need full-bleed images. See mask presets in `atmosphericGradient.ts`.

2. **Floating Card Pattern**: Present the image as a contained card with rounded corners and shadow. Eliminates all seam possibilities. Use when CSS masks still create visible artifacts.

Always use shared color tokens from `atmosphericPalette`, and match section endpoint colors exactly.
