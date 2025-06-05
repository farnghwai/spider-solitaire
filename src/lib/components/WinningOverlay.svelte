<script lang="ts">
	import { eventStore } from '$lib/eventStore.svelte';
	let { handleConfirm } = $props();

	let showWinAnimation = $derived(eventStore.hasWin);

	// Event handlers
	/**
	 * Handles the confirmation to start a new game.
	 */
	function handleConfirmNewGame() {
		handleConfirm();
	}

	$effect(() => {
		// Hide winning animation after 3 seconds
		let timerId: number;
		if (showWinAnimation) {
			timerId = setTimeout(() => {
				showWinAnimation = false;
			}, 3000);
		}

		return () => {
			if (timerId) {
				clearTimeout(timerId);
			}
		};
	});
</script>

{#if eventStore.hasWin}
	<div class="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
		<!-- Trophy and winning text -->
		<div class={['flex flex-col items-center']}>
			<div class="mb-4 text-6xl text-yellow-400 md:mb-6 md:text-8xl">🏆</div>
			<div
				class={[
					'mb-2 text-center text-2xl font-bold tracking-wide text-white md:mb-4 md:text-5xl',
					showWinAnimation && 'animate-pulse'
				]}
			>
				YOU WIN!
			</div>
			<div class="mb-2 text-center text-lg font-medium text-white md:mb-4 md:text-3xl">
				Congratulations!
			</div>
			<div
				class="rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text px-3 py-1.5 text-base font-extrabold text-transparent shadow-lg md:px-6 md:py-3 md:text-3xl"
			>
				Challenge Complete!
			</div>
			<div class="px-3 py-2 text-base font-bold text-white shadow-lg md:px-6 md:py-4 md:text-xl">
				<button
					type="button"
					class="inline-flex w-full cursor-pointer justify-center rounded-md bg-green-700 px-3 py-2 text-base font-semibold text-white shadow-xs hover:bg-green-600 sm:ml-3 sm:w-auto"
					onclick={handleConfirmNewGame}
				>
					<svg
						class="mr-1 h-2.5 w-2.5 stroke-current md:mr-1.5 md:h-5 md:w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke-width="2"
					>
						<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
						<path d="M3 3 h18 v18 h-18 v-18 M8 12 h8 M12 8 v8"></path>
					</svg> Start New Game / 開始新遊戲</button
				>
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
