import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/DuyYeuMan/', // 👈 BẮT BUỘC, đúng tên repo
  plugins: [react()],
});
