import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,           // чтобы запускался на том же порту, что и раньше
        open: true,
    },
    build: {
        outDir: 'build',      // чтобы build собирался в папку build (как раньше)
    },
})
