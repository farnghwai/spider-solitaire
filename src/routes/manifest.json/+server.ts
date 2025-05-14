import { json } from '@sveltejs/kit';
import { base } from '$app/paths';

export const prerender = true;

export const GET = () => {
	return json({
		name: 'Spider Solitaire',
		short_name: 'Solitaire',
		description: 'Spider Solitaire Progressive Web App (PWA)',
		start_url: `${base}/`,
		scope: `${base}/`,
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#016630',
		icons: [
			{
				src: `${base}/pwa-192x192.png`,
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: `${base}/pwa-512x512.png`,
				sizes: '512x512',
				type: 'image/png'
			}
		]
	});
};
