<script lang="ts">
	import { CardSuit, CardColors } from './shared.svelte';
	import type { CardType, Position } from './shared.svelte';

	interface CardPreviewProps {
		id: string;
		cards: CardType[];
		dragPosition: Position;
		cardHeight: number;
		cardWidth: number;
	}
	const { id, cards, dragPosition, cardHeight, cardWidth }: CardPreviewProps = $props();
	//id="card-td-{touchDraggedIndex}"
</script>

<div
	{id}
	class="pointer-events-none fixed z-[9999] flex -translate-x-1/2 -translate-y-4 items-center"
	style={`left: ${dragPosition.x}px; top: ${dragPosition.y}px`}
>
	<div class="relative flex flex-col">
		{#each cards as card, draggedIndex (card.id)}
			{@const touchSuitSymbol = CardSuit[card.suit].icon}
			<div
				role="listitem"
				aria-grabbed="true"
				class={[
					'flex h-full w-full flex-col rounded-sm border border-gray-200 shadow-sm select-none',
					'rounded-sm @xl:rounded-lg',
					'bg-white',
					CardColors[CardSuit[card.suit].color],
					'-translate-y-[calc(var(--spacing)*var(--stackOffset)*8.8)]',
					'@xl:-translate-y-[calc(var(--spacing)*var(--stackOffset)*11.5)]',
					'@5xl:-translate-y-[calc(var(--spacing)*var(--stackOffset)*30)]'
				]}
				style={`z-index: 9999 - ${draggedIndex}; --stackOffset: ${draggedIndex};`}
				style:height={`${cardHeight}px`}
				style:width={`${cardWidth}px`}
			>
				<div
					class={[
						'w-full rounded-t-md',
						'h-0.5 @5xl:h-1.5',
						card.isDraggable && 'border-t-1 border-t-teal-400 @5xl:border-t-2'
					]}
					style="background: repeating-linear-gradient(90deg, #ff9999, #ff9999 3px, white 3px, white 6px);"
				></div>

				<div
					class={[
						'flex justify-between',
						'px-0.5 @xl:px-1 @5xl:px-2',
						'text-xs @xl:text-base @5xl:text-xl'
					]}
				>
					<div class=" font-bold">{card.value}</div>
					<div class=" font-bold">{touchSuitSymbol}</div>
				</div>
				<div class="flex grow items-center justify-center text-base @xl:text-4xl @5xl:text-7xl">
					{touchSuitSymbol}
				</div>
				<div
					class={['w-full rounded-t-md', 'h-0.5 @5xl:h-1.5']}
					style="background: repeating-linear-gradient(90deg, #ff9999, #ff9999 3px, white 3px, white 6px);"
				></div>
			</div>
		{/each}
	</div>
</div>
