import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import copyPack from 'rollup-plugin-copy';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/js/background.js',
  },
  plugins: [
    typescript(),
    resolve(),
    terser({
      format: {
        comments: !production,
      },
      compress: {
        drop_console: production,
      },
    }),
    copyPack({
      targets: [
        {
          src: 'src/manifest/manifest.json',
          dest: 'dist/',
        },
        {
          src: 'src/assets/*',
          dest: 'dist/',
        },
      ],
    }),
  ],
};
