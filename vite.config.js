import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Tailwind CSS v4 전용 Vite 플러그인

// https://vitejs.dev/config/
export default defineConfig({
  // React 컴포넌트 해석 및 Tailwind CSS 빌드를 위한 플러그인 등록
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    // 개발 서버 구동 시 포트를 5173으로 고정하고 브라우저를 자동으로 열어줍니다.
    port: 5173,
    open: true,
  },
});