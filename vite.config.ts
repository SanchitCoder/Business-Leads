import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const meetingRoot = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  root: meetingRoot,
  envDir: meetingRoot,
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
