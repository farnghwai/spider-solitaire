<!-- src/lib/components/DrawPileButton.svelte -->
<script lang="ts">
	import { flip } from 'svelte/animate';
	import { send, receive } from './transition';
	import { NO_OF_CARD_SLOT } from './shared.svelte';
	import { eventStore, dispatch } from '$lib/eventStore.svelte';
	import { RESPONSIVE_CLASS } from '$lib/constants';

	import PokerCard from './PokerCard.svelte';

	// let { onClick }: DrawPileProps = $props();
	function handleDrawPileClick(event: MouseEvent) {
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

<div class={['flex', RESPONSIVE_CLASS.DRAW_PILE_CARD_SIZE, RESPONSIVE_CLASS.GAP_SIZE]}>
	{#if eventStore.cards.remaining.length > 0}
		<button
			aria-label="Draw Pile"
			class={[
				'flex aspect-7/11 cursor-pointer items-center justify-center bg-white shadow-md',
				'rounded-sm @xl:rounded-md',
				'hover:scale-105',
				'p-0.5 @3xl:p-1'
			]}
			onclick={handleDrawPileClick}
		>
			<div
				class={[
					'flex h-full w-full flex-col items-center justify-center bg-red-500',
					'rounded-xs @xl:rounded-md'
				]}
			>
				<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M50,15 C40,15 30,25 20,40 C30,55 40,65 50,65 C60,65 70,55 80,40 C70,25 60,15 50,15 M30,40 C30,35 35,30 40,30 C45,30 50,35 50,40 C50,45 45,50 40,50 C35,50 30,45 30,40 M70,40 C70,45 65,50 60,50 C55,50 50,45 50,40 C50,35 55,30 60,30 C65,30 70,35 70,40 M20,40 C10,55 10,65 30,85 C40,75 50,65 50,65 C50,65 60,75 70,85 C90,65 90,55 80,40 C70,55 60,65 50,65 C40,65 30,55 20,40"
						fill="black"
					/>
				</svg>
				<span class={['text-xs @xl:text-sm @5xl:text-base']}
					>{eventStore.cards.remaining.length}</span
				>
			</div>
		</button>
	{/if}
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
				hideWhenPreview={false}
				isDragOver={false}
			/>
		</div>
	{/each}
</div>
