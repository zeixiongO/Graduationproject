import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { config } from 'dotenv'

export default defineConfig(({ command }) => {
  // 根据命令加载对应的环境变量文件
  const envFilePath = command === 'build' ? '.env.prod' : '.env.dev'
  const envConfig = config({ path: envFilePath }).parsed

  return {
    base: './',
    plugins: [
      vue(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      open: false, //项目启东时是否打开页面
      host: "127.0.0.1",
      port: 5073,
      proxy: {
        "^/api/": {
          target: envConfig.VITE_API_DOMAIN, // 从环境变量中获取
          changeOrigin: true /* 允许跨域 */,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
