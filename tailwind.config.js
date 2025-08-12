/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'mo-',
  darkMode: ['selector', '[id="dark-theme"]'],
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '1rem',
        '4': '1.5rem',
        '5': '3rem'
      },
      colors: {
        initial: 'initial',
        inherit: 'inherit',
        current: 'currentColor',
        transparent: 'transparent',
        ofWhite: '#FDFDFD',
        muted: '#8B8B8B',
        borderColor: '#E4E4E4',
        primary: {
          50: '#F6FAF8',
          100: '#DFEFFB',
          200: '#CEDFF8',
          300: '#BFCEEF',
          400: '#AFBDE6',
          500: 'var(--primary-color)',
          600: '#1D7CC4',
          700: '#196496',
          800: '#153C67',
          900: '#103138'
        },
        error: {
          100: '#FBDFDE',
          200: '#F7BFBC',
          300: '#F29E9B',
          400: '#EE7E79',
          500: 'var(--error-color)',
          600: '#C04C47',
          700: '#963A36',
          800: '#6B2825',
          900: '#411614',
        },
        warning: {
          100: '#FFF3D8',
          200: '#FFE6B1',
          300: '#FEDA8B',
          400: '#FECD64',
          500: 'var(--warning-color)',
          600: '#CF9D31',
          700: '#A07925',
          800: '#715518',
          900: '#42310C',
        },
        success: {
          50: '#F6FAF8',
          100: '#DCF4E4',
          200: '#B9E9C9',
          300: '#96DEAE',
          400: '#73D393',
          500: 'var(--success-color)',
          600: '#40A060',
          700: '#307848',
          800: '#205030',
          900: '#183C24',
        },
        neutral: {
          100: '#FFFFFF',
          200: '#F0F0F0',
          300: '#D6D6D6',
          400: '#BDBDBD',
          500: 'var(--secondary-color)',
          600: '#8A8A8A',
          700: '#707070',
          800: '#575757',
          900: '#4F4F4F ',
        },
        violet: {
          100: '#F9D2FF',
          500: 'var(--violet-color)',
        },
        info: {
          100: '#BBE2FF',
          500: 'var(--info-color)',
        }
      }
    },
  },
  plugins: [],
}

