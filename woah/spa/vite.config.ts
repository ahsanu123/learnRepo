import { defineConfig } from 'vite'
import react, { Options } from '@vitejs/plugin-react'

const option: Options = {
  babel: {
    parserOpts: {
      plugins: [
        'decorators',
        'classProperties',
        'decoratorAutoAccessors'
      ]
    }
  }
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(option)],
  define: {
    'process.env': {}
  },
  server: {
    port: 4040
  }
})
