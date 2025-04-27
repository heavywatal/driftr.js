import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const config = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    path: __dirname,
    filename: 'driftr.js'
  }
}

export default config
