---
name: react-tailwind-ui-ux
description: "Expert guide for building modern, responsive, and accessible React UIs with Tailwind CSS. Covers mobile-first design, component patterns, accessibility, performance optimization, and UX best practices."
keywords: react, tailwind, ui, ux, responsive, mobile-first, accessibility, components, design-system, frontend
risk: safe
source: community
author: community
version: 1.0.0
compatibility: claude, gpt, gemini, cursor
category: frontend
tags:
  - react
  - tailwind
  - ui-design
  - ux
  - responsive-design
  - accessibility
  - frontend
  - web-development
---

# React + Tailwind UI/UX Expert

## What This Skill Does

This skill provides comprehensive guidance for building production-ready React applications with Tailwind CSS, focusing on responsive design, accessibility, performance, and modern UX patterns. You will learn mobile-first design principles, component architecture, state management for UI, animation patterns, and how to create interfaces that work beautifully across all devices while maintaining accessibility standards.

## When to Use This Skill

- Building or refactoring React components with Tailwind CSS
- Implementing responsive layouts that work on mobile, tablet, and desktop
- Improving accessibility (WCAG compliance, ARIA attributes, keyboard navigation)
- Optimizing UI performance (lazy loading, code splitting, image optimization)
- Creating reusable component libraries or design systems
- Implementing dark mode, theming, or multi-brand designs
- Debugging layout issues or responsive breakpoint problems
- Converting designs (Figma, Sketch) to React + Tailwind code
- Replacing emoji icons with proper icon libraries (Lucide, Heroicons)
- Implementing animations and micro-interactions

## Core Principles

### 1. Mobile-First Design

Always start with mobile layouts and progressively enhance for larger screens. Tailwind's responsive prefixes make this natural.

```tsx
// ❌ Bad: Desktop-first thinking
<div className="grid grid-cols-3 md:grid-cols-1">

// ✅ Good: Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

**Breakpoints:**
- `sm:` 640px (small tablets)
- `md:` 768px (tablets)
- `lg:` 1024px (laptops)
- `xl:` 1280px (desktops)
- `2xl:` 1536px (large screens)

### 2. Accessibility First

Accessibility is not optional. Every component must be usable by keyboard, screen readers, and assistive technologies.

**Essential Practices:**
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<article>`)
- Add ARIA labels where needed (`aria-label`, `aria-describedby`)
- Ensure keyboard navigation works (`tabIndex`, `onKeyDown`)
- Maintain color contrast ratios (WCAG AA: 4.5:1 for text)
- Provide focus indicators (never `outline-none` without replacement)
- Add alt text to images
- Use `loading="lazy"` for images below the fold

```tsx
// ✅ Accessible button
<button
  onClick={handleClick}
  aria-label="Close modal"
  className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
>
  <X className="w-5 h-5" />
</button>
```

### 3. Component Composition

Build small, reusable components that compose together. Avoid monolithic components.

```tsx
// ✅ Good: Composable components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### 4. Consistent Spacing Scale

Use Tailwind's spacing scale consistently. Avoid arbitrary values unless absolutely necessary.

```tsx
// ❌ Bad: Arbitrary values
<div className="p-[13px] mb-[27px]">

// ✅ Good: Consistent scale
<div className="p-3 mb-6 md:p-4 md:mb-8">
```

## Responsive Design Patterns

### Container Queries Pattern

```tsx
export default function ResponsiveCard() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {items.map(item => (
          <Card key={item.id} />
        ))}
      </div>
    </div>
  )
}
```

### Responsive Typography

```tsx
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
  Responsive Heading
</h1>

<p className="text-sm md:text-base lg:text-lg text-gray-600">
  Body text that scales appropriately
</p>
```

### Responsive Spacing

```tsx
<section className="py-12 md:py-16 lg:py-24">
  <div className="space-y-6 md:space-y-8 lg:space-y-12">
    {/* Content with responsive spacing */}
  </div>
</section>
```

### Hide/Show Elements

```tsx
// Show only on mobile
<div className="block md:hidden">Mobile menu</div>

// Show only on desktop
<nav className="hidden md:flex gap-6">Desktop nav</nav>

// Show on tablet and up
<aside className="hidden sm:block">Sidebar</aside>
```

## Icon Best Practices

### Replace Emojis with Icon Libraries

Emojis are inconsistent across platforms and not accessible. Use icon libraries instead.

**Recommended: Lucide React**

```bash
npm install lucide-react
```

```tsx
import { Check, X, Menu, Search, User, Settings } from 'lucide-react'

// ❌ Bad: Using emojis
<div className="text-2xl">✓</div>

// ✅ Good: Using Lucide icons
<Check className="w-6 h-6 text-green-600" strokeWidth={2.5} />

// Responsive icon sizes
<Search className="w-4 h-4 md:w-5 md:h-5" />
```

**Icon Sizing:**
- `w-4 h-4` (16px) - Small icons, inline with text
- `w-5 h-5` (20px) - Default size for buttons
- `w-6 h-6` (24px) - Larger buttons, headers
- `w-8 h-8` (32px) - Feature icons
- `w-12 h-12` (48px) - Hero sections

## Component Patterns

### Button Component

```tsx
import { Loader2 } from 'lucide-react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading, 
  children,
  onClick 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    ghost: "bg-transparent hover:bg-gray-100 focus:ring-gray-500"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  }
  
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}
```

### Card Component

```tsx
export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100">{children}</div>
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-3 md:px-6 md:py-4">{children}</div>
}

export function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="px-4 py-3 md:px-6 md:py-4 border-t border-gray-100 bg-gray-50">{children}</div>
}
```

### Modal Component

```tsx
import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <h2 id="modal-title" className="text-lg md:text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
```

## Image Handling

### Responsive Images with Fallback

```tsx
import { useState } from 'react'
import { ImageOff } from 'lucide-react'

interface ImageProps {
  src: string
  alt: string
  className?: string
}

export function ResponsiveImage({ src, alt, className = '' }: ImageProps) {
  const [error, setError] = useState(false)
  
  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center text-gray-400 p-4">
          <ImageOff className="w-12 h-12 mx-auto mb-2" />
          <p className="text-xs font-medium">Image not available</p>
        </div>
      </div>
    )
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  )
}
```

## Animation Patterns

### Hover Effects

```tsx
// Card hover
<div className="transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

// Button hover
<button className="transition-colors hover:brightness-110">

// Icon hover
<div className="group">
  <Icon className="transition-transform group-hover:scale-110" />
</div>
```

### Loading States

```tsx
// Skeleton loader
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
```

### Transitions

```tsx
// Fade in
<div className="animate-in fade-in duration-500">

// Slide in from bottom
<div className="animate-in slide-in-from-bottom duration-700">

// Custom transition
<div className="transition-all duration-300 ease-in-out">
```

## Dark Mode

### Setup with Tailwind

```tsx
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  // ...
}

// Component
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  <h1 className="text-gray-900 dark:text-gray-100">Title</h1>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### Dark Mode Toggle

```tsx
import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

export function DarkModeToggle() {
  const [dark, setDark] = useState(false)
  
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])
  
  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label="Toggle dark mode"
    >
      {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
```

## Performance Optimization

### Code Splitting

```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Image Optimization

```tsx
// Use next/image for Next.js projects
import Image from 'next/image'

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // for above-the-fold images
  placeholder="blur"
/>

// For regular React, use srcset
<img
  src="/image-800.jpg"
  srcSet="/image-400.jpg 400w, /image-800.jpg 800w, /image-1200.jpg 1200w"
  sizes="(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px"
  alt="Responsive image"
  loading="lazy"
/>
```

## Common Pitfalls

### 1. Not Using Semantic HTML

```tsx
// ❌ Bad
<div onClick={handleClick}>Click me</div>

// ✅ Good
<button onClick={handleClick}>Click me</button>
```

### 2. Removing Focus Outlines

```tsx
// ❌ Bad
<button className="outline-none">

// ✅ Good
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500">
```

### 3. Hardcoding Colors

```tsx
// ❌ Bad
<div className="bg-[#FF6B00]">

// ✅ Good: Use Tailwind colors or CSS variables
<div className="bg-orange-500">
// or
<div className="bg-brand-primary"> // defined in tailwind.config.js
```

### 4. Not Testing Responsiveness

Always test on:
- Mobile (320px - 640px)
- Tablet (640px - 1024px)
- Desktop (1024px+)

### 5. Ignoring Loading States

```tsx
// ✅ Always show loading states
{loading ? (
  <Skeleton />
) : (
  <Content />
)}
```

## Checklist for Production-Ready Components

- [ ] Works on mobile, tablet, and desktop
- [ ] Keyboard accessible (Tab, Enter, Escape work)
- [ ] Screen reader friendly (ARIA labels, semantic HTML)
- [ ] Has loading and error states
- [ ] Images have alt text and lazy loading
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No console errors or warnings
- [ ] Tested in Chrome, Firefox, Safari

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Accessibility](https://react.dev/learn/accessibility)
- [Headless UI](https://headlessui.com/) - Unstyled accessible components

## Quick Commands

When user asks to:
- "Make it responsive" → Apply mobile-first breakpoints to all elements
- "Fix accessibility" → Add ARIA labels, semantic HTML, keyboard navigation
- "Replace emojis" → Import Lucide icons and replace with appropriate components
- "Add dark mode" → Implement dark: variants and toggle component
- "Improve UX" → Add loading states, transitions, hover effects, error handling
- "Optimize images" → Add lazy loading, fallbacks, responsive srcset

---

**Remember:** Great UI/UX is invisible. Users should never think about the interface—they should just accomplish their goals effortlessly.
