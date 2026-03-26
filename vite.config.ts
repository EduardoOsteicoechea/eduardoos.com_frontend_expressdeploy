import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
   plugins: [sveltekit()],
   server: {
      host: true, 
      // Add your Railway URL here to allow traffic
      allowedHosts: ['eduardooscomfrontendexpressdeploy-production.up.railway.app'],
      proxy: {
         '/api': {
            target: 'http://backend:3000', 
            changeOrigin: true,
         }
      }
   }
});