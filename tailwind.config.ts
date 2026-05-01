import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAFAF8',
          dark: '#F5F4EF',
          darker: '#EDE9E0',
        },
        ink: {
          DEFAULT: '#1A1A1A',
          light: '#3D3D3D',
          muted: '#6B6B6B',
          faint: '#9A9A9A',
        },
        forest: {
          DEFAULT: '#165337',
          light: '#1E7A50',
          dark: '#165337',
          pale: '#D8F3DC',
        },
        navy: {
          DEFAULT: '#1B3A6B',
          light: '#2952A3',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E2C06A',
          dark: '#9E7C2A',
          pale: '#FFF8E7',
        },
        stone: {
          DEFAULT: '#E8E6E0',
          light: '#F0EEE9',
          dark: '#D0CEC6',
        },
      },
      fontFamily: {
        /* IBM Plex Sans Arabic — للنصوص والواجهة */
        naskh: ['var(--font-naskh)', 'sans-serif'],
        /* Amiri — للعناوين التحريرية */
        plex: ['var(--font-plex)', 'serif'],
      },
      lineHeight: {
        'relaxed-ar': '2',
        'loose-ar': '2.4',
      },
      maxWidth: {
        'article': '720px',
        'content': '1200px',
      },
    },
  },
  plugins: [],
}

export default config
