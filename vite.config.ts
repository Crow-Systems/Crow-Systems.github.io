import type { UserConfig } from 'vite';

const config: UserConfig = {
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    sourcemap: false,
    cssCodeSplit: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022',
    },
  },
};

export default config;