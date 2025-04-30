<!-- src/lib/components/Card.svelte -->
<script lang="ts">
	import { fly } from 'svelte/transition';

	import { CardSuit, CardColors } from './shared.svelte';
	import type { CardProps } from './shared.svelte';

	// Modern Svelte 5 props
	let { card, index, isDragOver, stackPosition, onDragStart, onDragEnd }: CardProps = $props();

	// Local state using Svelte 5 reactivity
	let element;

	// Stack offset calculator using Svelte 5 derived values
	const stackOffset = $derived(stackPosition * 9);
	const suitSymbol = $derived(CardSuit[card.suit].icon);
	const cardEdgeColor = $derived(
		card.isDraggable
			? '#16d3c5, #16d3c5 3px, white 6px'
			: '#ff9999, #ff9999 3px, white 3px, white 6px'
	);

	function handleDragStart(event: DragEvent) {
		onDragStart(event);
	}

	function handleDragEnd() {
		onDragEnd();
	}
</script>

<div
	class="absolute top-[calc(var(--spacing)*var(--stackOffset))] h-full w-full p-2"
	style="--stackOffset: {stackOffset};"
>
	<div
		bind:this={element}
		role="listitem"
		aria-grabbed={card.isBeingDragged ? true : false}
		id="card-c-{index}-s-{stackPosition}"
		class={[
			'flex h-full flex-col rounded-lg border border-gray-200  shadow-sm transition-transform duration-200 ease-in-out select-none',
			card.isDraggable && 'cursor-grab hover:translate-y-[4px] hover:shadow-md',
			card.isBeingDragged && 'cursor-grabbing opacity-100',
			isDragOver ? 'bg-amber-100 ring-2 ring-amber-500' : 'bg-white',
			CardColors[CardSuit[card.suit].color]
		]}
		draggable={card.isDraggable}
		ondragstart={handleDragStart}
		ondragend={handleDragEnd}
	>
		<div
			class="h-[6px] w-full rounded-t-md"
			style={`background: repeating-linear-gradient(90deg, ${cardEdgeColor});`}
		></div>
		<div class="flex justify-between px-2 text-xl">
			<div class=" font-bold">{card.value}</div>
			<div class=" font-bold">{suitSymbol}</div>
		</div>
		<div class="flex grow items-center justify-center text-7xl">
			{suitSymbol}
		</div>
		<div
			class="h-[6px] w-full rounded-b-md"
			style={`background: repeating-linear-gradient(90deg, ${cardEdgeColor});`}
		></div>
		<!-- Regular Card Styling -->
	</div>
</div>
