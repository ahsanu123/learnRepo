import { defineConfig } from 'vite'
import react, { Options } from '@vitejs/plugin-react'

const reactOptions: Options = {
  babel: {
    parserOpts: {
      plugins: [
        'decorators',
        'decoratorAutoAccessors',
        'classProperties'
      ]
    }
  }
}
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 7070,
  },
  plugins: [react(reactOptions)],
})
