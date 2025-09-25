import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react()],
    server: {
      port: 1000,
      proxy: {
        "/seo": {
          target: env.VITE_PROXY_TARGET,
          changeOrigin: true,
        },
      },
    },
  };
});
