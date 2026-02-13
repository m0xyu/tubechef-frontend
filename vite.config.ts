import path from "path"
import { fileURLToPath } from "url";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
	plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }) ,react(),  tailwindcss(),],
	server: {
		proxy: {
			'/sanctum': {
				target: 'http://localhost:80',
				changeOrigin: true,
			},
			'/api': {
				target: 'http://localhost:80',
				changeOrigin: true,
			},
			'/login': {
                target: 'http://localhost:80',
                changeOrigin: true,
            },
            '/logout': {
                target: 'http://localhost:80',
                changeOrigin: true,
            },
            '/register': {
                target: 'http://localhost:80',
                changeOrigin: true,
            },
            '/forgot-password': {
                target: 'http://localhost:80',
                changeOrigin: true,
            },
            '/reset-password': {
                target: 'http://localhost:80',
                changeOrigin: true,
            },
            '/user/confirmed-password-status': {
                target: 'http://localhost:80',
                changeOrigin: true,
            },
            '/email/verification-notification': {
                target: 'http://localhost:80',
                changeOrigin: true,
            },
		},
	},
	resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
