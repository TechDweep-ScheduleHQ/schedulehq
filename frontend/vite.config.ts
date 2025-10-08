import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
   server: {
    host: true,        
    port: 5173,       
    strictPort: true,  // fail if port is busy
    watch: {
      usePolling: true,  // required for Docker on Windows
    },
  },
})