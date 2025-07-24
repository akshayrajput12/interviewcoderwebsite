# GhostCoder

A Next.js application built with TypeScript, Tailwind CSS, and Framer Motion, featuring a modern landing page for an AI-powered interview assistance tool.

## 🚀 Features

- **Modern Design**: Dark theme with yellow accent colors and glowing effects
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: Powered by Framer Motion for engaging user interactions
- **Component Architecture**: Well-organized folder structure with reusable components
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

## 📁 Project Structure

```
src/
├── app/
│   ├── home/
│   │   ├── home-components/
│   │   │   ├── Header.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CompatibilitySection.tsx
│   │   │   ├── UndetectabilitySection.tsx
│   │   │   ├── HowToUseSection.tsx
│   │   │   ├── CommandsSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── FAQSection.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── Footer.tsx
│   │   ├── home.tsx
│   │   └── page.tsx
│   ├── features/
│   ├── pricing/
│   └── globals.css
└── components/
    ├── ui/
    │   └── Button.tsx
    └── layout/
        └── Navigation.tsx
```

## 🛠️ Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **Roboto Font** - Google Fonts integration

## 🎨 Design Features

- **Dark Theme**: Primary background `#0D0D0D` with card backgrounds `#1A1A1A`
- **Yellow Accents**: Primary yellow `#F8E71C` with hover state `#FFD700`
- **Glowing Effects**: Text and border glow effects for enhanced visual appeal
- **Smooth Transitions**: Hover effects and page transitions
- **Interactive Components**: Animated FAQ sections, pricing cards, and buttons

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages

- **Home (`/home`)**: Main landing page with all sections
- **Features (`/features`)**: Features page (placeholder)
- **Pricing (`/pricing`)**: Pricing page (placeholder)

## 🎯 Key Components

### Home Page Sections:
- **Hero Section**: Main headline with CTA buttons
- **Compatibility Section**: Platform compatibility showcase
- **Undetectability Section**: Feature highlights with cards
- **How to Use Section**: Step-by-step guide with code examples
- **Commands Section**: Keyboard shortcuts display
- **Pricing Section**: Three-tier pricing plans
- **FAQ Section**: Collapsible question/answer pairs
- **CTA Section**: Final call-to-action
- **Footer**: Links and company information

### Reusable Components:
- **Button**: Customizable button with variants and animations
- **Navigation**: Responsive navigation component

## 🎨 Styling

The project uses a custom design system with:
- Custom CSS classes for glowing effects
- Roboto font family
- Consistent color palette
- Responsive breakpoints
- Smooth animations and transitions

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

- **Tailwind Config**: Custom colors, fonts, and utilities
- **TypeScript Config**: Strict type checking enabled
- **ESLint Config**: Next.js recommended rules
- **PostCSS Config**: Tailwind CSS processing

This project demonstrates modern React development practices with a focus on performance, accessibility, and user experience.
