import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@Components": path.resolve(__dirname, "./src/components"),
      "@Tasks": path.resolve(__dirname, "./src/components/Tasks"),
      "@Contexts": path.resolve(__dirname, "./src/contexts"),
      "@Types": path.resolve(__dirname, "./src/types"),
      "@Lib": path.resolve(__dirname, "./src/lib"),
      "@Config": path.resolve(__dirname, "./src/config"),
    },
  },
});
