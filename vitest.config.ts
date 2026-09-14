import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./apps/web/app", import.meta.url)),
    },
  },
  test: {
    exclude: ["apps/web/e2e/**", "**/node_modules/**"],
    include: ["apps/**/*.test.ts", "apps/**/*.test.tsx"],
    restoreMocks: true,
  },
});
