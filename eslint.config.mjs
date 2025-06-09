import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Base recommended ESLint rules for general code quality
  compat.extends("eslint:recommended")[0], // Access the first (and usually only) element
  // Next.js specific rules for core web vitals and TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript")
];

export default eslintConfig;