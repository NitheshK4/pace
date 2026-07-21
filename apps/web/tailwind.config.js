/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pace: {
          bg: '#0B0F17',
          surface: '#151C28',
          border: '#232D3F',
          accent: '#3B82F6',
          accentHover: '#2563EB',
          text: '#F3F4F6',
          muted: '#9CA3AF',
          danger: '#EF4444',
          success: '#10B981',
          warning: '#F59E0B',
        }
      }
    },
  },
  plugins: [],
}
