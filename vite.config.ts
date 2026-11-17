import adapter from '@sveltejs/adapter-static';
import pkg from './package.json' with { type: 'json' };
import * as child_process from 'node:child_process';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const gitCommitHash = child_process.execSync('git rev-parse HEAD | cut -c 1-7').toString().trim();
const versionName = `${pkg.version} (build ${gitCommitHash})`;
const basePath = process.argv.includes('dev')
	? ''
	: process.env.BASE_PATH?.startsWith('/')
		? (process.env.BASE_PATH as `/${string}`)
		: undefined;

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			version: { name: versionName },
			paths: {
				base: basePath
			}
		})
	]
});
