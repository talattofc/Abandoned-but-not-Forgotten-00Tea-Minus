/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Headings, titles, brand name, HUD headers
        display: ['"Structed Beginning"', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        // Body, subtitles, labels, buttons
        sans: ['Stickle', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      colors: {
        space: '#070A12',
        panel: '#0E1320',
        card: '#101522',
        line: '#232B42',
        'line-strong': '#2F3956',
        ink: '#E6E9F2',
        muted: '#8C95AD',
        sun: '#F59E0B',
        'sun-light': '#FBBF24',
        moon: '#CBD5E1',
        mars: '#E4572E',
        deep: '#8EA2FF',
      },
    },
  },
  plugins: [],
};
