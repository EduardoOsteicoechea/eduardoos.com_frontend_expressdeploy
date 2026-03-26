import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
   server: {
		// Required for Docker so it exposes the port outside the container
		host: true, 
		proxy: {
			// Any request starting with /api will be forwarded to your Node backend
			'/api': {
				target: 'http://backend:3000', 
				changeOrigin: true,
				// Optional: If your backend routes don't start with /api, you can rewrite the path
				// rewrite: (path) => path.replace(/^\/api/, '') 
			}
		}
	}
});
