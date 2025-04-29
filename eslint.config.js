import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      'android/**',
      'ios/**',
      'ReactNativeFastImageExample/**',
      'ReactNativeFastImageExampleServer/**',
      'README.md',
      '**/node_modules/**',
      'node_modules/**',
      'dist/**',
    ]
  },
  // Apply TypeScript configuration, but with some rules modified
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    rules: {
      ...config.rules,
      // Disable rules that are too strict for this codebase
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    }
  })),
  // Custom rules for all files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      semi: 'off',
      'no-unused-vars': 'off', // Disable JS rule in favor of TS rule
      '@typescript-eslint/no-unused-vars': 'warn',
    }
  }
]; 