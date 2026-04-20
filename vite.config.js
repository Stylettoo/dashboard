import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.SURVEY_PROXY_TARGET || '';

  return {
    plugins: [react()],
    base: '/dashboard/',
    server: proxyTarget
      ? {
          proxy: {
            '/api/survey': {
              target: proxyTarget,
              changeOrigin: true,
              secure: false,
              rewrite: () => '',
            },
          },
        }
      : undefined,
  };
});