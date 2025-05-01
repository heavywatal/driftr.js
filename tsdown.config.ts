import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    driftr: './src/main.ts',
  },
  noExternal: ['d3'],
  platform: 'browser',
})
