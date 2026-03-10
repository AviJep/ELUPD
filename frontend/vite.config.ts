import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Development server settings
  server: {
    // Make the dev server available on your local network (e.g. http://<your-ip>:5173)
    host: '0.0.0.0',
    proxy: {
      // Proxy API calls to the backend during development to avoid CORS issues
      '/api': 'http://localhost:3001'
    }
  }
})
