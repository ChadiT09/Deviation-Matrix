import { defineConfig } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "src");
const distDir = resolve(__dirname, "dist");

// Copy a directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = resolve(src, entry.name);
    const destPath = resolve(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export default defineConfig({
  root: "src",
  base: "./",
  build: {
    outDir: distDir,
    emptyOutDir: true,
    copyPublicDir: true,
    rollupOptions: {
      input: resolve(srcDir, "index.html"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
