<!-- src/lib/components/WinCardSuitDeck.svelte -->
<script lang="ts">
	import { tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { receive, send } from './transition';

	import { eventStore } from '$lib/eventStore.svelte';
	import { RESPONSIVE_CLASS } from '$lib/constants';
	import PokerCard from './PokerCard.svelte';

	$effect.pre(() => {
		// reference `winCardStacks` array length so that this code re-runs whenever it changes
		eventStore.cards.completed.length;

		tick().then(() => {});
	});
</script>

<div class="flex flex-1 items-center @2xl:flex-col">
	<div class={['grid grid-flow-col @2xl:grid-flow-row', RESPONSIVE_CLASS.GAP_SIZE]}>
		{#each eventStore.cards.completed as stackedCards, index}
			<div class={['grid grid-rows-subgrid']}>
				{#each stackedCards as stackedCard, stackPosition (stackedCard.id)}
					<div
						animate:flip={{ duration: 300 }}
						in:receive={{ key: stackedCard.id }}
						out:send={{ key: stackedCard.id }}
						class={[RESPONSIVE_CLASS.COMPLETED_CARD_SIZE]}
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
</div>
