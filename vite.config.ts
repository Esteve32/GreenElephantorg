import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { previewNetwork } from "./scripts/preview-hosts";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const network = previewNetwork();

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  preview: {
    host: network.host,
    port: network.remote ? 5000 : 4173,
    allowedHosts: network.allowedHosts,
  },
  server: {
    host: network.host,
    allowedHosts: network.allowedHosts,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
