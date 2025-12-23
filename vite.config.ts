
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Library build configuration
  if (mode === 'lib') {
    return {
      plugins: [
        react(),
        dts({
          insertTypesEntry: true,
          include: ['lib/**/*', 'components/**/*', 'hooks/**/*', 'types.ts', 'constants.ts'],
          entryRoot: '.',
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'lib/index.ts'),
          name: 'ReactPdfAnnotator',
          formats: ['es', 'umd'],
          fileName: (format) => `react-pdf-annotator.${format}.js`,
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'jsxRuntime',
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'style.css') return 'style.css';
              return assetInfo.name || 'asset';
            },
          },
        },
        cssCodeSplit: false,
        sourcemap: true,
        emptyOutDir: true,
      },
    }
  }
  
  // Default app build configuration
  return {
    plugins: [react()],
  }
})
