<!-- src/lib/components/WinCardSuitDeck.svelte -->
<script lang="ts">
	import { tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import { receive, send } from './transition';

	import { CardSuit, CardColors } from './shared.svelte';
	import { eventStore } from '$lib/eventStore.svelte';

	$effect.pre(() => {
		// reference `winCardStacks` array length so that this code re-runs whenever it changes
		eventStore.cards.completed.length;

		tick().then(() => {});
	});
</script>

<div class="absolute top-20 left-5 grid grid-cols-1 gap-2">
	{#each eventStore.cards.completed as stackedCards, index}
		<div class="grid grid-cols-subgrid grid-rows-subgrid">
			{#each stackedCards as stackedCard, stackPosition (stackedCard.id)}
				{@const suitSymbol = CardSuit[stackedCard.suit].icon}
				<div
					animate:flip={{ duration: 300 }}
					in:receive={{ key: stackedCard.id }}
					out:send={{ key: stackedCard.id }}
					class={[
						'h-22 w-14 flex-col rounded-lg border border-gray-200 bg-white shadow-sm select-none',
						CardColors[CardSuit[stackedCard.suit].color]
					]}
					style="z-index: {100 - stackPosition};"
				>
					<div
						role="listitem"
						id="w-card-c-{index}-s-{stackPosition}"
						class={['flex h-full flex-col rounded-lg border border-gray-200 shadow-sm select-none']}
					>
						<div
							class={['h-1.5 w-full rounded-t-md']}
							style="background: repeating-linear-gradient(90deg, #ff9999, #ff9999 3px, white 3px, white 6px);"
						></div>

						<div class="flex justify-between px-2 text-base">
							<div class=" font-bold">{stackedCard.value}</div>
							<div class=" font-bold">{suitSymbol}</div>
						</div>
						<div class="flex grow items-center justify-center text-4xl">
							{suitSymbol}
						</div>
						<div
							class="h-1.5 w-full rounded-b-md"
							style="background: repeating-linear-gradient(90deg, #ff9999, #ff9999 3px, white 3px, white 6px);"
						></div>
					</div>
				</div>
			{/each}
		</div>
	{/each}
</div>
