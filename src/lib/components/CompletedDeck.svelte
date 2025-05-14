<!-- src/lib/components/WinCardSuitDeck.svelte -->
<script lang="ts">
	import { tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { receive, send } from './transition';

	import { eventStore } from '$lib/eventStore.svelte';
	import { RESPONSIVE_CLASS } from '$lib/constants';
	import PokerCard from './PokerCard.svelte';
	import { NO_OF_CARD_SLOT } from '$lib/constants';

	let { cardSystemWidth } = $props();
	let cardWidthEstimatedSize = $derived.by(() => {
		return (cardSystemWidth / NO_OF_CARD_SLOT) * 0.9; // simplified card width calculation by using some assumpation
	});
	let cardWidth = $derived(cardWidthEstimatedSize * 0.7);
	let cardHeight = $derived((cardWidth / 7) * 11);

	let cardWidthFontSize = $derived(cardSystemWidth * 0.6);
	$effect.pre(() => {
		// reference `winCardStacks` array length so that this code re-runs whenever it changes
		eventStore.cards.completed.length;

		tick().then(() => {});
	});
</script>

<div class="flex flex-1 items-center @3xl:flex-col">
	<div class={['grid grid-flow-col @3xl:grid-flow-row', RESPONSIVE_CLASS.GAP_SIZE]}>
		{#each eventStore.cards.completed as stackedCards, index}
			<div
				role="list"
				class={[
					'grid grid-rows-subgrid',
					'@3xl:mt-3 @4xl:mt-4 @6xl:mt-6',
					'@3xl:-translate-y-(--card-height)'
				]}
				style={`z-index: ${30 + index}; --card-height: ${index * cardHeight}px;`}
			>
				{#each stackedCards as stackedCard, stackPosition (stackedCard.id)}
					<div
						animate:flip={{ duration: 300 }}
						in:receive={{ key: stackedCard.id }}
						out:send={{ key: stackedCard.id }}
						class=" w-(--card-width)"
						style={`z-index: ${20 - stackPosition}; --card-width: ${cardWidth}px;`}
					>
						<PokerCard
							card={stackedCard}
							{index}
							{stackPosition}
							containerWidth={cardWidthFontSize}
							hideWhenPreview={false}
							isDragOver={false}
						/>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>
