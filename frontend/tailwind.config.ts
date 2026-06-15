import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#080D1A',
        'bg-surface': '#0F1629',
        'bg-elevated': '#162040',
        'accent-blue': '#3B82F6',
        'accent-green': '#10B981',
        'accent-yellow': '#F59E0B',
        'accent-red': '#EF4444',
        'accent-orange': '#F97316',
        'accent-purple': '#8B5CF6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
