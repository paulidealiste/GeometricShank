import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default ({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  return defineConfig({
    plugins: [vue()],
    server: {
      host: process.env.DEV_SERVER,
      port: process.env.DEV_PORT
    }
  })
};
