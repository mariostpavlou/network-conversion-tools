// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Keep dark mode class, even if not toggled. It doesn't hurt.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Status Colors (adjusted for Aqua background)
        'status-success': '#32CD32', // Lime Green
        'status-warning': '#FFD700', // Gold
        'status-error': '#FF4500',   // Orange Red
      },
      // Extend backdrop blur utilities for glass effect
      backdropBlur: {
        xs: '2px',
      },
      // Keep existing gradients for utility
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // Custom keyframes for animations (already present, keep)
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-shift': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        'shine-pulse': { // For subtle button/card shine
          '0%': { opacity: '0', transform: 'scale(0.8) rotate(-45deg)' },
          '50%': { opacity: '0.2', transform: 'scale(1) rotate(-45deg)' },
          '100%': { opacity: '0', transform: 'scale(0.8) rotate(-45deg)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'gradient-shift': 'gradient-shift 15s ease infinite',
        'shine-pulse': 'shine-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;