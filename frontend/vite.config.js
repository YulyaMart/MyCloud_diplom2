import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://127.0.0.1:8000/', // URL Django сервера
  //       // target: 'http://cloudhaven-backend:8000', // используйте имя сервиса из docker-compose
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
})
