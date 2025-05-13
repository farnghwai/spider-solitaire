<!-- src/lib/components/PokerCard.svelte -->
<script lang="ts">
	import { CardSuit, calculateFontSize } from '../shared.svelte';
	import type { PokerCardProps } from '$lib/types';
	import { CARD_COLORS } from '$lib/constants';

	const {
		card,
		index,
		stackPosition,
		containerWidth,
		hideWhenPreview,
		isDragOver,
		onDragStart,
		onDragEnd,
		onTouchStart,
		class: className
	}: PokerCardProps = $props();
	const suitSymbol = CardSuit[card.suit].icon;

	const fontSize = $derived.by(() => calculateFontSize(containerWidth));
</script>

<div
	role="listitem"
	aria-grabbed={card.isBeingDragged ? true : false}
	class={[
		'flex aspect-7/11 h-auto w-full min-w-6 flex-col border border-gray-200 shadow-sm select-none',
		'rounded-md @xl:rounded-lg',
		isDragOver ? 'bg-amber-100' : 'bg-white',
		CARD_COLORS[CardSuit[card.suit].color],
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
		class={['w-full', 'rounded-t-md', 'h-1.5', card.isDraggable && 'border-t-2 border-t-teal-400']}
		style="background: repeating-linear-gradient(90deg, #ff9999, #ff9999 3px, white 3px, white 6px);"
	></div>

	<div
		class={['flex justify-between px-0.5 @3xl:px-1', 'text-(length:--sp-text-size)']}
		style={`--sp-text-size: ${fontSize}px`}
	>
		<div class="font-bold">{card.value}</div>
		<div class="font-bold">{suitSymbol}</div>
	</div>
	<div
		class={['flex flex-1 items-center justify-center', 'text-(length:--sp-text-size)']}
		style={`--sp-text-size: ${fontSize * 2.5}px`}
	>
		{suitSymbol}
	</div>
	<div
		class={['w-full', 'rounded-b-md', 'h-1.5']}
		style="background: repeating-linear-gradient(90deg, #ff9999, #ff9999 3px, white 3px, white 6px);"
	></div>
</div>
