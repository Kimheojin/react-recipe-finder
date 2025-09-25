import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 1000,
    proxy: {
      "/seo": {
        target: "http://heojineee.ddnsking.com:1400",
        changeOrigin: true,
      },
    },
  },
});
