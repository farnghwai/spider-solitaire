<!-- src/lib/components/Card.svelte -->
<script>
	// Modern Svelte 5 props
	let {
		displayedCards: card,
		index,
		isDragOver,
		stackPosition,
		onCardClick,
		onDragStart,
		onDragEnd
	} = $props();

	// Local state using Svelte 5 reactivity
	let isBeingDragged = $state(false);
	let element;

	// Stack offset calculator using Svelte 5 derived values
	const stackOffset = $derived(stackPosition * 10);

	// Lifecycle hook using Svelte 5 effect
	$effect(() => {
		if (element) {
			element.addEventListener('dragstart', handleDragStart);
			element.addEventListener('dragend', handleDragEnd);

			return () => {
				element.removeEventListener('dragstart', handleDragStart);
				element.removeEventListener('dragend', handleDragEnd);
			};
		}
	});

	function handleDragStart(event) {
		isBeingDragged = true;
		// Set data to identify the card during drag
		event.dataTransfer.setData(
			'text/plain',
			JSON.stringify({
				cardId: card.id,
				fromIndex: index
			})
		);

		// Set drag image and effects
		event.dataTransfer.effectAllowed = 'move';

		onDragStart();
	}

	function handleDragEnd() {
		isBeingDragged = false;
		onDragEnd();
	}
</script>

<div
	bind:this={element}
	class="absolute h-[90%] w-full cursor-grab rounded-lg border border-gray-200 bg-white shadow-sm transition-transform duration-200 ease-in-out select-none hover:translate-y-[-4px] hover:shadow-md {isBeingDragged
		? 'cursor-grabbing opacity-70'
		: ''} {isDragOver ? 'ring-2 ring-blue-500' : ''}"
	draggable="true"
	on:click={onCardClick}
	style="top: {stackOffset}%; z-index: {100 + stackPosition};"
	in:fly={{ y: 20, duration: 300 }}
>
	<div class="h-full overflow-hidden p-3">
		<!-- Display card content -->
		<div class="mb-2 text-base font-bold">{card.title || 'Card'}</div>
		{#if card.description}
			<div class="text-sm text-gray-600">{card.description}</div>
		{/if}
	</div>
</div>
