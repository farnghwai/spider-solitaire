import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import pkg from './package.json' with { type: 'json' };
import * as child_process from 'node:child_process';

const gitCommitHash = child_process.execSync('git rev-parse HEAD | cut -c 1-7').toString().trim();
const versionName = `${pkg.version} (build ${gitCommitHash})`

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		version: {
			name: versionName
		},
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH,
		}		
	},
};

export default config;
