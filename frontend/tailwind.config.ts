import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        accent: 'hsl(var(--accent))',
        muted: 'hsl(var(--muted))',
        border: 'hsl(var(--border))'
      },
      boxShadow: {
        glow: '0 0 40px hsl(var(--primary) / 0.28)',
        soft: '0 2px 16px 0 rgba(0,0,0,0.10), 0 1px 4px 0 rgba(0,0,0,0.06)'
      }
    }
  },
  plugins: []
} satisfies Config;
