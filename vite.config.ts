import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the built dist/ works from any static host or a file path.
export default defineConfig({ plugins: [react()], base: './' });
