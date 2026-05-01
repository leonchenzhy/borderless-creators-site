/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bc: {
          // Backgrounds
          base:     '#020617',   // page background (slate-950 equiv)
          deep:     '#07111F',   // secondary dark sections
          surface:  '#0B1220',   // elevated surfaces
          // Cards
          card:     'rgba(255, 255, 255, 0.04)',
          border:   'rgba(255, 255, 255, 0.10)',
          // Text
          primary:  '#F8FAFC',
          secondary:'#94A3B8',
          muted:    '#64748B',
          // Accents
          teal:     '#2DD4BF',
          aqua:     '#22D3EE',
          blue:     '#38BDF8',
          violet:   '#8B5CF6',
          rose:     '#FB7185',
          amber:    '#F59E0B',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
