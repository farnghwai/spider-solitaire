<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { initNewGameSession } from '$lib/shared.svelte';
	import { initCardStacks } from '$lib/eventStore.svelte';
	import { RESPONSIVE_CLASS } from '$lib/constants';

	import CardSystem from '$lib/components/CardSystem.svelte';
	import CompletedDeck from '$lib/components/CompletedDeck.svelte';
	import DrawPileButton from '$lib/components/DrawPileButton.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import WinningOverlay from '$lib/components/WinningOverlay.svelte';

	let isLoading = $state(false);
	let cardSystemWidth = $state(0);

	function initCards() {
		// no action if cardStacks already have card
		if (!initCardStacks.display.every((cardSlot) => cardSlot.length === 0)) {
			return;
		}

		initNewGameSession();
	}

	function handleConfirm() {
		isLoading = true;
		initNewGameSession();

		return tick().then(() => {
			isLoading = false;
		});
	}

	onMount(() => {
		initCards();
	});
</script>

<div class="@container flex min-h-dvh min-w-xs flex-col overflow-y-hidden">
	<div class="hidden items-center justify-center text-white noscript:flex noscript:flex-1">
		Please enable JavaScript to use this app.
	</div>

	{#if !isLoading}
		<div
			class={[
				'flex flex-1 flex-col @2xl:flex-row',
				'p-0.5 @2xl:p-1 @5xl:p-2 @7xl:p-4',
				'mx-auto w-full gap-4 @5xl:gap-12 @7xl:gap-16'
			]}
		>
			<!-- CardSystem -->
			<CardSystem bind:cardSystemWidth />

			<div
				class={[
					'flex items-center justify-between',
					'flex-row @2xl:flex-col',
					'order-first @2xl:order-last',
					// RESPONSIVE_CLASS.PADDING_SIZE,
					//RESPONSIVE_CLASS.DRAW_PILE_CARD_COL_SIZE
					//'w-full @2xl:w-32'
					'p-1'
				]}
			>
				<!-- CompletedDeck Pile -->
				<CompletedDeck {cardSystemWidth} />

				<!-- Draw Pile -->
				<DrawPileButton {cardSystemWidth} />
			</div>
		</div>
	{/if}
	<!-- Toolbar -->
	<Toolbar {handleConfirm} />

	<WinningOverlay {handleConfirm} />
</div>
