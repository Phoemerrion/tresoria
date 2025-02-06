// doc : https://vitejs.dev/config/
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
export default defineConfig({
  base: `/${path.basename(__dirname)}/dist/`,
  plugins: [vue()],
  build: {
    watch: {
      exclude: [
        'dist/**',
      ]
    }
  }
})