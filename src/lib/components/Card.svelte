<!-- src/lib/components/Card.svelte -->
<script lang="ts">
	import { fly } from 'svelte/transition';

	import { CartSuit } from './shared.svelte';
	import type { CardProps } from './shared.svelte';

	// Modern Svelte 5 props
	let { card, index, isDragOver, stackPosition, onCardClick, onDragStart, onDragEnd }: CardProps =
		$props();

	// Local state using Svelte 5 reactivity
	let isBeingDragged = $state(false);
	let element;

	// Stack offset calculator using Svelte 5 derived values
	const stackOffset = $derived(stackPosition * 9);

	let suitSymbol = card.suit in CartSuit ? CartSuit[card.suit] : CartSuit.club;
	// Lifecycle hook using Svelte 5 effect
	// $effect(() => {
	// 	if (element) {
	// 		element.addEventListener('dragstart', handleDragStart);
	// 		element.addEventListener('dragend', handleDragEnd);

	// 		return () => {
	// 			element.removeEventListener('dragstart', handleDragStart);
	// 			element.removeEventListener('dragend', handleDragEnd);
	// 		};
	// 	}
	// });

	function handleDragStart(event: DragEvent) {
		isBeingDragged = true;
		// Set data to identify the card during drag
		if (event.dataTransfer) {
			event.dataTransfer.setData(
				'text/plain',
				JSON.stringify({
					// cardId: card.id,
					fromIndex: index
				})
			);

			// Set drag image and effects
			event.dataTransfer.effectAllowed = 'move';
		}

		onDragStart();
	}

	function handleDragEnd() {
		isBeingDragged = false;
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
		aria-grabbed="false"
		id="card-c-{index}-s-{stackPosition}"
		class=" flex h-full cursor-grab flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-transform duration-200 ease-in-out select-none hover:translate-y-[4px] hover:shadow-md {isBeingDragged
			? 'cursor-grabbing opacity-70'
			: ''} {isDragOver ? 'ring-2 ring-blue-500' : ''} {card.suit === 'heart' ||
		card.suit === 'diamond'
			? 'text-red-500'
			: 'text-black'}"
		draggable="true"
		ondragstart={handleDragStart}
		ondragend={handleDragEnd}
	>
		<div
			class="h-[6px] w-full rounded-t-md"
			style="background: repeating-linear-gradient(90deg, #ff9999, #ff9999 3px, white 3px, white 6px);"
		></div>
		<div class="flex justify-between px-2 text-xl">
			<div class=" font-bold">{card.value}</div>
			<div class=" font-bold">{suitSymbol}</div>
		</div>
		<div class="flex grow items-center justify-center text-7xl">
			{suitSymbol}
		</div>
		<div
			class="h-[6px] w-full rounded-t-md"
			style="background: repeating-linear-gradient(90deg, #ff9999, #ff9999 3px, white 3px, white 6px);"
		></div>
		<!-- Regular Card Styling -->
	</div>
</div>
