<!-- src/lib/components/DrawPileButton.svelte -->
<script lang="ts">
	import { flip } from 'svelte/animate';
	import { send, receive } from './transition';
	import { eventStore, dispatch } from '$lib/eventStore.svelte';
	import { NO_OF_CARD_SLOT } from '$lib/constants';

	import PokerCard from './PokerCard.svelte';
	import PokerCardCover from './PokerCardCover.svelte';

	const { cardSystemWidth } = $props();

	let cardWidth = $derived.by(() => {
		return (cardSystemWidth / NO_OF_CARD_SLOT) * 0.8; // simplified card width calculation by using some assumpation
	});

	/**
	 * Handles click event on draw pile button
	 * Calculates remaining card count and dispatches drawPile action
	 * @returns void
	 */
	function handleDrawPileClick() {
		const remaingCount =
			eventStore.cards.remaining.length < NO_OF_CARD_SLOT
				? eventStore.cards.remaining.length
				: NO_OF_CARD_SLOT;
		if (remaingCount > 0) {
			dispatch({
				type: 'drawPile',
				payload: {
					remaingCount: remaingCount
				}
			});
		}
	}
</script>

<div class="w-(--card-width)" style={`--card-width: ${cardWidth}px;`}>
	{#if eventStore.cards.remaining.length > 0}
		<button
			aria-label="Draw Pile"
			class={['flex w-full cursor-pointer items-center justify-center', 'hover:scale-105']}
			onclick={handleDrawPileClick}
		>
			<PokerCardCover cardBalance={eventStore.cards.remaining.length} />
		</button>
	{/if}
	<div role="list">
		{#each eventStore.cards.remaining as stackedCard, stackPosition (stackedCard.id)}
			<div
				in:receive={{ key: stackedCard.id }}
				out:send={{ key: stackedCard.id }}
				animate:flip={{ duration: 300 }}
				class="sr-only"
			>
				<PokerCard
					card={stackedCard}
					index={0}
					{stackPosition}
					containerWidth={0}
					hideWhenPreview={false}
					isDragOver={false}
					isLastStackPosition={false}
				/>
			</div>
		{/each}
	</div>
</div>
