// vite.config.ts
import { defineConfig } from "file:///D:/temp/react-pdf-annotator-v2-package/node_modules/vite/dist/node/index.js";
import react from "file:///D:/temp/react-pdf-annotator-v2-package/node_modules/@vitejs/plugin-react/dist/index.js";
import { resolve } from "path";
import dts from "file:///D:/temp/react-pdf-annotator-v2-package/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\temp\\react-pdf-annotator-v2-package";
var vite_config_default = defineConfig(({ mode }) => {
  if (mode === "lib") {
    return {
      plugins: [
        react(),
        dts({
          insertTypesEntry: true,
          include: ["lib/**/*", "components/**/*", "hooks/**/*", "types.ts", "constants.ts"],
          entryRoot: "."
        })
      ],
      build: {
        lib: {
          entry: resolve(__vite_injected_original_dirname, "lib/index.ts"),
          name: "ReactPdfAnnotator",
          formats: ["es", "umd"],
          fileName: (format) => `react-pdf-annotator.${format}.js`
        },
        rollupOptions: {
          onwarn(warning, defaultHandler) {
            if (warning.code === "EVAL" && warning.id?.includes("pdfjs-dist/build/pdf.js")) {
              return;
            }
            defaultHandler(warning);
          },
          external: ["react", "react-dom", "react/jsx-runtime"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react/jsx-runtime": "jsxRuntime"
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === "style.css") return "style.css";
              return assetInfo.name || "asset";
            }
          }
        },
        cssCodeSplit: false,
        sourcemap: true,
        emptyOutDir: true
      }
    };
  }
  return {
    plugins: [react()]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx0ZW1wXFxcXHJlYWN0LXBkZi1hbm5vdGF0b3ItdjItcGFja2FnZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcdGVtcFxcXFxyZWFjdC1wZGYtYW5ub3RhdG9yLXYyLXBhY2thZ2VcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3RlbXAvcmVhY3QtcGRmLWFubm90YXRvci12Mi1wYWNrYWdlL3ZpdGUuY29uZmlnLnRzXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgLy8gTGlicmFyeSBidWlsZCBjb25maWd1cmF0aW9uXG4gIGlmIChtb2RlID09PSAnbGliJykge1xuICAgIHJldHVybiB7XG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIHJlYWN0KCksXG4gICAgICAgIGR0cyh7XG4gICAgICAgICAgaW5zZXJ0VHlwZXNFbnRyeTogdHJ1ZSxcbiAgICAgICAgICBpbmNsdWRlOiBbJ2xpYi8qKi8qJywgJ2NvbXBvbmVudHMvKiovKicsICdob29rcy8qKi8qJywgJ3R5cGVzLnRzJywgJ2NvbnN0YW50cy50cyddLFxuICAgICAgICAgIGVudHJ5Um9vdDogJy4nLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgICBidWlsZDoge1xuICAgICAgICBsaWI6IHtcbiAgICAgICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdsaWIvaW5kZXgudHMnKSxcbiAgICAgICAgICBuYW1lOiAnUmVhY3RQZGZBbm5vdGF0b3InLFxuICAgICAgICAgIGZvcm1hdHM6IFsnZXMnLCAndW1kJ10sXG4gICAgICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGByZWFjdC1wZGYtYW5ub3RhdG9yLiR7Zm9ybWF0fS5qc2AsXG4gICAgICAgIH0sXG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICBvbndhcm4od2FybmluZywgZGVmYXVsdEhhbmRsZXIpIHtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgd2FybmluZy5jb2RlID09PSAnRVZBTCcgJiZcbiAgICAgICAgICAgICAgd2FybmluZy5pZD8uaW5jbHVkZXMoJ3BkZmpzLWRpc3QvYnVpbGQvcGRmLmpzJylcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRlZmF1bHRIYW5kbGVyKHdhcm5pbmcpXG4gICAgICAgICAgfSxcbiAgICAgICAgICBleHRlcm5hbDogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3QvanN4LXJ1bnRpbWUnXSxcbiAgICAgICAgICBvdXRwdXQ6IHtcbiAgICAgICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICAgICAgcmVhY3Q6ICdSZWFjdCcsXG4gICAgICAgICAgICAgICdyZWFjdC1kb20nOiAnUmVhY3RET00nLFxuICAgICAgICAgICAgICAncmVhY3QvanN4LXJ1bnRpbWUnOiAnanN4UnVudGltZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcbiAgICAgICAgICAgICAgaWYgKGFzc2V0SW5mby5uYW1lID09PSAnc3R5bGUuY3NzJykgcmV0dXJuICdzdHlsZS5jc3MnO1xuICAgICAgICAgICAgICByZXR1cm4gYXNzZXRJbmZvLm5hbWUgfHwgJ2Fzc2V0JztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgY3NzQ29kZVNwbGl0OiBmYWxzZSxcbiAgICAgICAgc291cmNlbWFwOiB0cnVlLFxuICAgICAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfVxuICB9XG4gIFxuICAvLyBEZWZhdWx0IGFwcCBidWlsZCBjb25maWd1cmF0aW9uXG4gIHJldHVybiB7XG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixTQUFTLGVBQWU7QUFDeEIsT0FBTyxTQUFTO0FBSmhCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBRXhDLE1BQUksU0FBUyxPQUFPO0FBQ2xCLFdBQU87QUFBQSxNQUNMLFNBQVM7QUFBQSxRQUNQLE1BQU07QUFBQSxRQUNOLElBQUk7QUFBQSxVQUNGLGtCQUFrQjtBQUFBLFVBQ2xCLFNBQVMsQ0FBQyxZQUFZLG1CQUFtQixjQUFjLFlBQVksY0FBYztBQUFBLFVBQ2pGLFdBQVc7QUFBQSxRQUNiLENBQUM7QUFBQSxNQUNIO0FBQUEsTUFDQSxPQUFPO0FBQUEsUUFDTCxLQUFLO0FBQUEsVUFDSCxPQUFPLFFBQVEsa0NBQVcsY0FBYztBQUFBLFVBQ3hDLE1BQU07QUFBQSxVQUNOLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxVQUNyQixVQUFVLENBQUMsV0FBVyx1QkFBdUIsTUFBTTtBQUFBLFFBQ3JEO0FBQUEsUUFDQSxlQUFlO0FBQUEsVUFDYixPQUFPLFNBQVMsZ0JBQWdCO0FBQzlCLGdCQUNFLFFBQVEsU0FBUyxVQUNqQixRQUFRLElBQUksU0FBUyx5QkFBeUIsR0FDOUM7QUFDQTtBQUFBLFlBQ0Y7QUFDQSwyQkFBZSxPQUFPO0FBQUEsVUFDeEI7QUFBQSxVQUNBLFVBQVUsQ0FBQyxTQUFTLGFBQWEsbUJBQW1CO0FBQUEsVUFDcEQsUUFBUTtBQUFBLFlBQ04sU0FBUztBQUFBLGNBQ1AsT0FBTztBQUFBLGNBQ1AsYUFBYTtBQUFBLGNBQ2IscUJBQXFCO0FBQUEsWUFDdkI7QUFBQSxZQUNBLGdCQUFnQixDQUFDLGNBQWM7QUFDN0Isa0JBQUksVUFBVSxTQUFTLFlBQWEsUUFBTztBQUMzQyxxQkFBTyxVQUFVLFFBQVE7QUFBQSxZQUMzQjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsUUFDQSxjQUFjO0FBQUEsUUFDZCxXQUFXO0FBQUEsUUFDWCxhQUFhO0FBQUEsTUFDZjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBR0EsU0FBTztBQUFBLElBQ0wsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ25CO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
