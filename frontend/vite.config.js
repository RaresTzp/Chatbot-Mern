import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  define: {
    'import.meta.env.VITE_LANGGRAPH_URL': JSON.stringify(process.env.VITE_LANGGRAPH_URL),
    'import.meta.env.VITE_LANGGRAPH_KEY': JSON.stringify(process.env.VITE_LANGGRAPH_KEY),
  },
  plugins: [react()],
})
