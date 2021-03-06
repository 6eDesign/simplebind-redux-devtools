import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from "rollup-plugin-uglify";
import buble from 'rollup-plugin-buble';
import pkg from './package.json';

let isProd = process.env.buildTarget == 'prod';

let plugins = [
	resolve(),
	commonjs(), 
	buble()
]; 

if(isProd) { 
	plugins.push(uglify());
}

export default [
	// browser-friendly UMD build
	{
    input: 'index.js',
    external: [
			...Object.keys(pkg.devDependencies || {}),
		],
		output: {
			name: 'simplebind-redux-devtools',
			file: pkg.browser,
			format: 'umd',
			sourcemap: true
		},
		plugins
  },

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify 
	// `file` and `format` for each target)
	{
		input: 'index.js',
		external: [
			...Object.keys(pkg.devDependencies || {})
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];