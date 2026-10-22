import { defineConfig } from 'vite';
export default defineConfig({base:'./',server:{host:'127.0.0.1',port:4173,strictPort:true},build:{outDir:'build',rollupOptions:{output:{manualChunks:{three:['three']}}}}});
