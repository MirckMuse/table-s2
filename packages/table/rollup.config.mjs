import { defineConfig } from 'rollup'
import typescript from "@rollup/plugin-typescript";
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: "lib/index.cjs.js",
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: "dist/index.umd.js",
        format: 'umd',
        name: 'STable',
        sourcemap: true,
        globals: {}
      },
      {
        file: './esm/index.esm.js',
        format: 'es',
        sourcemap: true,
        globals: {}
      }
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json'
      }),
    ]
  }
])
