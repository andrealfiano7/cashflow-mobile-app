import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteAuthPlugin } from './vite-auth-plugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteAuthPlugin()],
})

