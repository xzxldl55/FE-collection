import { mergeConfig } from 'vite';
import baseConfig from './vite.config';
import viteEslintPlugin from 'vite-plugin-eslint';

export default mergeConfig(
	{
		plugins: [viteEslintPlugin()],
		server: {
			hmr: true,
			open: true, // 自动打开 devweb
			// 设置接口代理转发
			// proxy: {
			// 	'/yqby-api': {
			// 		target: 'https://test-api.com',
			// 		changeOrigin: true,
			// 		rewrite: (path: string) => path.replace(/^\/yqby-api/, ''),
			// 	},
			// },
		},
	},
	baseConfig
);
