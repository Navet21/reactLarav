import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    build: {
            minify: process.env.APP_ENV === 'production' ? 'esbuild' : false,
            cssMinify: process.env.APP_ENV === 'production',
            },
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/css/app.css'],
            refresh: true,
        }),
        react(),
    ],
});