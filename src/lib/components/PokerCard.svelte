<!-- src/lib/components/PokerCard.svelte -->
<script lang="ts">
	import { CardSuit, CardColors } from './shared.svelte';
	import type { PokerCardProps } from '$lib/types';

	const {
		card,
		index,
		stackPosition,
		hideWhenPreview,
		isDragOver,
		onDragStart,
		onDragEnd,
		onTouchStart,
		class: className
	}: PokerCardProps = $props();
	const suitSymbol = CardSuit[card.suit].icon;
</script>

<div
	role="listitem"
	aria-grabbed={card.isBeingDragged ? true : false}
	class={[
		'flex h-full w-full flex-col border border-gray-200 shadow-sm select-none',
		'rounded-sm @xl:rounded-lg',
		isDragOver ? 'bg-amber-100 ring-2 ring-amber-500' : 'bg-white',
		CardColors[CardSuit[card.suit].color],
		card.isDraggable && 'cursor-grab hover:-translate-y-1 hover:shadow-md',
		hideWhenPreview && card.isBeingDragged && 'opacity-0',
		className
	]}
	draggable={card.isDraggable}
	ondragstart={(event: DragEvent) => onDragStart?.(event, card, index, stackPosition)}
	ondragend={(event: DragEvent) => onDragEnd?.()}
	ontouchstart={(event: TouchEvent) => onTouchStart?.(event, card, index, stackPosition)}
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
		<div class=" font-bold">{suitSymbol}</div>
	</div>
	<div class="flex grow items-center justify-center text-base @xl:text-4xl @5xl:text-7xl">
		{suitSymbol}
	</div>
	<div
		class={['w-full rounded-t-md', 'h-0.5 @5xl:h-1.5']}
		style="background: repeating-linear-gradient(90deg, #ff9999, #ff9999 3px, white 3px, white 6px);"
	></div>
</div>
