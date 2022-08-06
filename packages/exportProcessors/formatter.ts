import { format } from 'prettier/standalone'
import babelParser from 'prettier/parser-babel'

export const formatCode = (code: string) =>
  format(code, {
    parser: 'babel',
    plugins: [babelParser],
    singleQuote: true,
  })
