import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    includeSource: ['src/**/*.{js,ts}'],
    exclude: ['node_modules', 'dist', 'public'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'tests']
    }
  }
}); 