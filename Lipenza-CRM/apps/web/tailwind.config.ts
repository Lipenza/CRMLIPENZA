import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Urbanist', 'system-ui', 'sans-serif'],
        display: ['Urbanist', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Paleta de marca Lipenza (Manual de Identidad Corporativa)
        brand: {
          DEFAULT: '#0F7D4B', // Verde Vital
          50:  '#EEF6F1',
          100: '#D6ECE0',
          200: '#AEDAC3',
          300: '#79C09E',
          400: '#3E9E74',
          500: '#0F7D4B', // Verde Vital
          600: '#0C6F42',
          700: '#0A6340', // Verde Bosque
          800: '#084E32',
          900: '#063D28',
        },
        // Acentos secundarios de marca
        solar:   '#FFCC29', // Amarillo Solar
        energy:  '#F79633', // Naranja Energético
        lima:    '#A8CF45', // Verde Lima
        brillante: '#FFF212', // Amarillo Brillante
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
