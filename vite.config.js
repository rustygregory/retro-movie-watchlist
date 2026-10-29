import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Project site: https://rustygregory.github.io/retro-movie-watchlist/
  base: '/retro-movie-watchlist/',
})
