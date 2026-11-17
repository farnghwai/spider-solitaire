import { resolve } from '$app/paths';

export const prerender = true;

export const GET = () => {
	return Response.json({
		name: 'Spider Solitaire',
		short_name: 'Solitaire',
		description: 'Spider Solitaire Progressive Web App (PWA)',
		start_url: resolve(`/`.slice(1)),
		scope: resolve(`/`.slice(1)),
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#016630',
		icons: [
			{
				src: resolve(`pwa-192x192.png`),
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: resolve(`pwa-512x512.png`),
				sizes: '512x512',
				type: 'image/png'
			}
		]
	});
};
