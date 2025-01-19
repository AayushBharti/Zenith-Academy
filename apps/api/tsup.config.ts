import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["index.ts"],
  clean: true,
  shims: true,
  target: "esnext",
  format: ["cjs"],
  minify: process.env.NODE_ENV === "production",
  loader: {
    ".html": "text",
  },
  ...options,
}));
