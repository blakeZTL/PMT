import { nodeResolve } from '@rollup/plugin-node-resolve';
// import terser from '@rollup/plugin-terser';

export default {
    input: '../Webresources/js/index.js',
    output: {
        file: '../Webresources/js/bundle.js',
        format: 'cjs',
        name: 'bundle'
    },
    plugins: [nodeResolve()]
};
