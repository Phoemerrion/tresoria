// doc : https://vitejs.dev/config/
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'
dotenv.config()
export default defineConfig({
  base: process.env.VITE_BASE_URL || `/`,
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        dir: 'dist', // Exclure le dossier dist des entrées
      },
    },
    emptyOutDir: true, // Nettoie le répertoire de sortie avant le nouveau build
  }
})