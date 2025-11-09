# GreenElephant.org Design Guidelines

## Design Approach
**Reference-Based + Custom System**: This project requires a unique visual identity centered around the Periodic Table of Conscious Communication, combined with spiritual/contemplative design patterns found in meditation apps and conscious communication platforms.

## Core Visual Identity

### Color System (Periodic Table Taxonomy)
- **Influence**: #cc3333 (Red)
- **Attitude**: #ff9933 (Orange)
- **Chaordic**: #ffcc00 (Yellow)
- **Flow**: #cccc33 (Yellow-Green)
- **Alignment**: #669966 (Green)
- **Needs**: #009999 (Teal)
- **Ego**: #3399cc (Blue)
- **Dynamics**: #666699 (Purple)

### Theme: Head-Up Display (HUD)
- **Base**: Dark backgrounds (deep charcoal/black)
- **Overlays**: White semi-transparent cards (rgba(255,255,255,0.1-0.15)) with subtle backdrop blur
- **Navigation**: Floating, translucent header bar
- **Pop-ups/Modals**: Glass-morphism effect with white overlays
- **Element Cards**: Flat white icons from periodic table, color-coded backgrounds per taxonomy

## Typography
- **Headlines**: Modern geometric sans-serif (e.g., Inter, DM Sans), bold weights
- **Body**: Warm, readable sans-serif (e.g., Inter, Source Sans), regular/medium weights
- **Accent/Spiritual**: Serif for quotes/testimonials (e.g., Merriweather)
- **Sizes**: Generous hierarchy with 1.25-1.5 scale ratio

## Layout System
**Tailwind Spacing**: Use units of 4, 8, 12, 16, 24, 32 (p-4, m-8, gap-12, etc.)
- Section padding: py-20 to py-32
- Component spacing: gap-8 to gap-16
- Container: max-w-7xl with px-4

## Component Library

### Navigation
- Floating translucent header with backdrop-blur
- Logo left, navigation center/right
- Mobile: hamburger menu with overlay drawer

### Interactive Periodic Table
- Grid layout (8 columns for 8 lenses)
- Each element: flat white icon, taxonomy color background, symbol/abbreviation
- Hover: subtle lift/glow effect
- Click: modal with element details, videos, learning resources
- Filters: Lens selector tabs at top

### Prompt Library (HUD Style)
- Dark background with code-editor aesthetic
- Filter sidebar: Lens, Role, Scenario dropdowns
- Prompt cards: white translucent overlays
- Copy button with visual feedback
- Search bar with live filtering

### Booking Integration
- Embedded Typeform/VideoAsk iframes
- Seamless dark theme integration
- Pre-filled fields from user context

### Content Sections
- **Hero**: Full-viewport (80-100vh), centered message, dual CTAs ("Explore Retreats" / "Explore Arbora")
- **Features**: 3-column grid (desktop), single column (mobile), icon + heading + description
- **Testimonials**: Carousel with quotes, photos, names
- **Retreats/Events**: Card grid with imagery, dates, seasonal theming
- **Arbora Lab**: Blog-style layout with featured article + grid of recent posts
- **Resources**: Library grid with downloadable assets (ebooks, Notion templates)

### Forms & Interactions
- Gentle, forgiving language ("Release" instead of "Delete")
- ACIM-aligned microcopy ("We're grateful for your willingness...")
- Smooth transitions, minimal animations
- Focus states with taxonomy colors

## Accessibility
- WCAG 2.1 AA compliance
- Sufficient contrast ratios (especially white text on dark backgrounds)
- Keyboard navigation for all interactive elements
- Screen reader-friendly labels
- Alt text for periodic table icons and imagery

## Images
- **Hero**: Abstract/spiritual imagery (nature, light, sacred geometry) - subtle, non-distracting
- **Team/Coaches**: Authentic photos with warm, approachable tone
- **Retreats**: Venue photos, group activities, contemplative settings
- **Arbora**: Professional headshots of agents/researchers
- All buttons on images: blurred backgrounds for readability

## Responsive Behavior
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Periodic table: Scrollable on mobile, full grid on desktop
- Navigation: Collapsible menu on mobile

## Special Considerations
- **Multilingual Support**: EN/FR/FI switcher in header
- **SEO**: Semantic HTML, meta tags, structured data
- **Performance**: Lazy-load images, optimized assets
- **Spiritual Tone**: Every page as a "sacred space" - clean, uncluttered, intentional