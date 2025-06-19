import react from '@vitejs/plugin-react';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '#shared': resolve(__dirname, '../shared'),
      '#SUtils': resolve(__dirname, '../shared/utils'),
      '#SModels': resolve(__dirname, '../shared/models'),
      '#SUi': resolve(__dirname, '../shared/ui'),
      '#MJ': resolve(__dirname, './src')
    },
  },
  test: {
    environment: 'jsdom'
  }
});