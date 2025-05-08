<!-- src/lib/components/WinCardSuitDeck.svelte -->
<script lang="ts">
	import { tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { receive, send } from './transition';

	import { CardSuit, CardColors } from './shared.svelte';
	import { eventStore } from '$lib/eventStore.svelte';
	import PokerCard from './PokerCard.svelte';

	$effect.pre(() => {
		// reference `winCardStacks` array length so that this code re-runs whenever it changes
		eventStore.cards.completed.length;

		tick().then(() => {});
	});
</script>

<div class="absolute top-16 left-5 grid grid-cols-1 gap-1">
	{#each eventStore.cards.completed as stackedCards, index}
		<div class="grid grid-cols-subgrid grid-rows-subgrid">
			{#each stackedCards as stackedCard, stackPosition (stackedCard.id)}
				<div
					animate:flip={{ duration: 300 }}
					in:receive={{ key: stackedCard.id }}
					out:send={{ key: stackedCard.id }}
					class={['h-14 w-8 @xl:h-18 @xl:w-10 @5xl:h-36 @5xl:w-20']}
					style="z-index: {100 - stackPosition};"
				>
					<PokerCard
						card={stackedCard}
						{index}
						{stackPosition}
						hideWhenPreview={false}
						isDragOver={false}
					/>
				</div>
			{/each}
		</div>
	{/each}
</div>
