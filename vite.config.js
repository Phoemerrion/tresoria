// doc : https://vitejs.dev/config/
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
export default defineConfig({
  base: `/${path.basename(__dirname)}/dist/`,
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