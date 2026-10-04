import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      // 실연동 개발용 — /api 요청을 AI 레포 dev_bff(또는 Spring)로 넘긴다.
      // 같은 출처가 되므로 CORS 설정 없이 붙고, 업로드 이미지 경로(/api/v1/uploads/…)도 그대로 열린다.
      proxy: {
        '/api': {
          target: env.VITE_DEV_PROXY_TARGET || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
  };
});
