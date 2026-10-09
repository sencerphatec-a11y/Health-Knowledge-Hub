module.exports = {
  content: ['./public/pulsecare/index.html', './public/pulsecare/safeguards.js'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        brand: { 50: '#f0f9ff', 100: '#e0f2fe', 500: '#0284c7', 600: '#0369a1', 700: '#035483', 800: '#075985', 900: '#0c4a6e' },
        tealbrand: { 500: '#0d9488', 600: '#0f766e' },
      },
    },
  },
  plugins: [],
};
