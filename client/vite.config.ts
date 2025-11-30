import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    allowedHosts: [
      '9b4f0566-4d0a-496b-be4c-b9bd7cf152bd-00-3fxapm4mzv3wj.pike.replit.dev',
    ],
    fs: {
      strict: false,
    },
    // 👇 this line makes /app and nested routes load properly even after refresh
    historyApiFallback: true,
  },
});
