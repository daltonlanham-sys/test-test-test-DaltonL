// Builds the single-page artifact: the app's own code as one IIFE, with React
// left external so the page loads it from cdnjs as the UMD globals React /
// ReactDOM. React 19 ships no UMD build, so the artifact runs on React 18.3.1.
// scripts/build-artifact.ts inlines the output into dist-artifact/.
import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    jsxInject: `import React from 'react'`,
  },
  build: {
    outDir: 'dist-artifact/build',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: { entry: 'src/ui/main.tsx', formats: ['iife'], name: 'TalkTrack', fileName: () => 'app.js' },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-dom/client'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM', 'react-dom/client': 'ReactDOM' },
        assetFileNames: 'app[extname]',
      },
    },
  },
});
