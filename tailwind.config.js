module.exports = {
  content: [
    // Specify the paths to all of your components so Tailwind can tree-shake unused styles:
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter', sans-serif"],
        mono: ["monospace"],
        'primary': ["'Inter', sans-serif"],
      },
      colors: {
        brand: {
          50: '#D5F7F3',
          100: '#0F172A',
          200: '#00DBC9',
          300: '#00C9B1',
          400: '#00B99E',
          500: '#00AA8B',
          600: '#00DCC8',
          'dark-blue': '#0F172A',
          'link-blue': '#00A5FD',
          'electric-blue': '#00A5FD',
          'field-border-gray': '#CFCDCD',
        },
        neutral: {
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#9CA3AF',
          500: '#6B7280',
          700: '#374151',
          800: '#D1D5DB',
          900: '#111827',
        },
      },
      maxWidth: {
        'mobile': '92.5%',
      },
      spacing: {
        "mobile": '92.5%',
      },
      boxShadow: {
        lg:
            "0 -1px 27px 0 rgba(0, 0, 0, 0.04), 0 4px 15px 0 rgba(0, 0, 0, 0.08)",
      },
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'lg-alt': '1110px',
      'xl': '1280px',
      'xxl': '1350px',
    },
  },
  plugins: [],
}
