import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const port = Number(env.PORT);

  return {
    plugins: [react()],
    server: {
      // Allow overriding dev server port through .env, default to 5173.
      port: Number.isNaN(port) ? 5173 : port,
    },
  };
});
