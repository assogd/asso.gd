/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}'
  ],
  safelist: [
    {
      pattern: /^col-(span|start|end)-(1[0-3]|[1-9]|full)$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'] // Responsive variants
    },
    {
      pattern: /^row-(span|start|end)-(1[0-3]|[1-9]|full)$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'] // Responsive variants
    },
    {
      pattern: /^object-(cover|contain|top|bottom)$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'] // Responsive variants
    },
    {
      pattern: /^text-(left|center|right)$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'] // Responsive variants
    },
    {
      pattern:
        /^(p|px|py|pb|pt|pl|pr)-(1[0-2]|[1-9]|16|20|24|28|32|36|40|44|48|1\/2|1\/3|2\/3|1\/4|3\/4|1\/5|2\/5|3\/5|4\/5|1\/6|5\/6|full)$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'] // Responsive variants
    },
    {
      pattern:
        /^(-mt|mb|mt)-(0|1[0-2]|[1-9]|16|20|24|28|32|36|40|44|48|64|72|1\/2|1\/3|2\/3|1\/4|3\/4|1\/5|2\/5|3\/5|4\/5|1\/6|5\/6|full)$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'] // Responsive variants
    },
    {
      pattern: /^max-w-(sm|md|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl)$/,
      variants: ['sm', 'md', 'lg', 'xl', '2xl'] // Responsive variants
    },
    {
      pattern: /^max-h-(1\/2-screen)$/ // Safelist the max-height class
    }
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: 'rgba(255, 255, 255, 1)',
      lightGrey: 'rgb(240, 240, 240)',
      black: '#000000',
      red: '#FF0000'
    },
    extend: {
      fontSize: {
        xs: ['0.65rem', '1.2em'],
        sm: ['0.8rem', '1.2em'],
        base: ['1rem', '1.2em'], //18px
        md: ['1.3333333rem', '1.3em'], //24px
        lg: ['1.5rem', '1.3em'], //24px
        xl: ['2.6666666rem', '1em'], //48px
        '2xl': ['clamp(1.25rem, 6vw, 4rem)', '1em'],
        mega: ['clamp(2.5rem, 15vw, 12rem)', '1em']
      },
      gridTemplateColumns: {
        16: 'repeat(16, minmax(0, 1fr))'
      },
      screens: {
        xs: '480px',
        shortest: { raw: '(max-height: 400px)' },
        shorter: { raw: '(min-height: 401px) and (max-height: 600px)' },
        short: { raw: '(min-height: 601px) and (max-height: 800px)' }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      fontFamily: {
        serif: ['var(--font-serif)']
      },
      maxHeight: {
        '1/2-screen': '50vh'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
