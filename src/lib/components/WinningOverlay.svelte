<script lang="ts">
	import { eventStore } from '$lib/eventStore.svelte';

	let showWinAnimation = $derived(eventStore.hasWin);

	$effect(() => {
		// Hide winning animation after 3 seconds
		if (showWinAnimation) {
			setTimeout(() => {
				showWinAnimation = false;
			}, 4000);
		}

		return () => {};
	});
</script>

{#if eventStore.hasWin}
	<div class="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
		<!-- Trophy and winning text -->
		<div class={['flex  flex-col items-center']}>
			<div class="mb-6 text-8xl text-yellow-400">🏆</div>
			<div
				class={[
					'mb-4  text-center text-5xl font-bold tracking-wide text-white',
					showWinAnimation && 'animate-pulse'
				]}
			>
				YOU WIN!
			</div>
			<div
				class="rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 px-6 py-3 text-xl font-bold text-white shadow-lg"
			>
				Challenge Complete!
			</div>
			<div class="px-6 py-4 text-xl font-bold text-white shadow-lg">
				Refresh the screen to start new game.
			</div>
		</div>

		<!-- Star burst animation -->
		<div class="pointer-events-none absolute inset-0">
			<div
				class={[
					'absolute inset-0  bg-gradient-to-r from-yellow-400 to-orange-500 opacity-20',
					showWinAnimation && 'animate-pulse'
				]}
			></div>
			<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
				<div
					class={[
						'bg-gradient-to-r from-yellow-300 to-orange-400 opacity-30',
						showWinAnimation && 'h-96 w-96 animate-ping rounded-full'
					]}
				></div>
			</div>
		</div>
	</div>
{/if}
