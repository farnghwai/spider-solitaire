<script lang="ts">
	import Card from './Card.svelte';
	import { cardStacks } from './shared.svelte';
	import type { CardType, CardSystemProps, Position } from './shared.svelte';

	// Modern Svelte 5 props
	// let { onUpdate, onClick }: CardSystemProps = $props();
	// $inspect('cardSystem', 'displayedCards', displayedCards.length, displayedCards);
	// Svelte 5 reactive state
	let draggedCard: CardType | null = $state(null);
	let draggedIndex = $state(-1);
	let draggedStackPosition = $state(-1);
	let dragOverIndex = $state(-1);
	let isBeingDragged = $state(false);

	let dragPosition: Position = $state({ x: 0, y: 0 });
	let dragOffset: Position = $state({ x: 0, y: 0 });

	// Handle drag start
	function handleDragStart(event: DragEvent, card: CardType, index: number, stackPosition: number) {
		isBeingDragged = true;

		draggedCard = card;
		draggedCard.isBeingDragged = true;
		draggedIndex = index;
		draggedStackPosition = stackPosition;

		// Set data to identify the card during drag
		if (event.dataTransfer) {
			event.dataTransfer.clearData();
			// event.dataTransfer.setData(
			// 	'text/plain',
			// 	JSON.stringify({
			// 		// cardId: card.id,
			// 		fromIndex: index
			// 	})
			// );
			// Set drag image and effects
			event.dataTransfer.effectAllowed = 'move';
		}
	}

	// Handle drop
	function handleDrop(event: DragEvent) {
		event.preventDefault();

		if (draggedCard && draggedIndex !== -1 && draggedStackPosition !== -1) {
			let newCardStack = cardStacks[dragOverIndex];
			const oldCardStack = cardStacks[draggedIndex];
			const cardsToMove = oldCardStack.slice(draggedStackPosition);
			let isValidToDrop = false;
			if (newCardStack.length === 0) {
				isValidToDrop = true;
			} else {
				const newCardStackLastPosition = newCardStack.length - 1;
				const newLastCard = newCardStack[newCardStackLastPosition];

				if (newLastCard.valueIndex - 1 === draggedCard.valueIndex) {
					isValidToDrop = true;
				}
			}

			if (isValidToDrop) {
				cardStacks[dragOverIndex] = [...newCardStack, ...cardsToMove];
				oldCardStack.splice(draggedStackPosition, cardsToMove.length);

				if (oldCardStack.length > 0) {
					const oldCardStackLastPosition = oldCardStack.length - 1;

					const oldLastCard = oldCardStack[oldCardStackLastPosition];
					oldLastCard.isDraggable = true;
				}
			}
		}
	}

	function handleDragOver(event: DragEvent, index: number) {
		const newCardStack = cardStacks[index];
		if (draggedCard && newCardStack.length > 0) {
			const newCardStackLastPosition = newCardStack.length - 1;
			const newLastCard = newCardStack[newCardStackLastPosition];

			if (newLastCard.valueIndex - 1 !== draggedCard.valueIndex) {
				return;
			}
		}

		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
		dragOverIndex = index;
	}

	function handleDragEnd() {
		// Reset drag state
		if (draggedCard) {
			draggedCard.isBeingDragged = false;
		}

		draggedCard = null;
		draggedIndex = -1;
		draggedStackPosition = -1;
		dragOverIndex = -1;
		isBeingDragged = false;
	}

	function handleDragLeave() {
		dragOverIndex = -1;
	}

	const handleDocumentMouseMove = (event: MouseEvent) => {
		if (isBeingDragged) {
			event.preventDefault();
			dragPosition = { x: event.clientX, y: event.clientY };
		}
	};

	const handleDocumentMouseUp = (event: MouseEvent) => {
		// Find the target slot by position
		if (!isBeingDragged) return;

		// const targetSlotId = findSlotByPosition(e.clientX, e.clientY);
		// if (targetSlotId && sourceSlotId && draggedItemIds.length > 0) {
		// 	// Move the items from source to target
		// 	moveItems(draggedItemIds, targetSlotId);
		// 	console.log('mouse up to slot');
		// } else {
		// 	console.log('mouse up only');
		// }
		// // Reset drag state
		// // isDraggingRef.current = false;
		// console.log($state.snapshot(draggedItemIds));
		// isDragging = false;
		// draggedItemIds = [];
		// sourceSlotId = null;
	};
</script>

<svelte:document onmousemove={handleDocumentMouseMove} onmouseup={handleDocumentMouseUp} />

<div class="mb-5 flex justify-center gap-2">
	{#each cardStacks as stackedCards, index}
		<div
			class={[
				'relative h-44 w-28 rounded-lg border-2 border-dashed border-gray-300 transition-all duration-200 ease-in-out  ',
				dragOverIndex === index ? 'border-blue-400' : ''
			]}
			data-index={index}
			role="listitem"
			ondragover={(event: DragEvent) => handleDragOver(event, index)}
			ondrop={handleDrop}
			ondragleave={handleDragLeave}
		>
			{#each stackedCards as stackedCard, stackPosition}
				<Card
					card={stackedCard}
					{index}
					isDragOver={dragOverIndex === index && stackedCards.length - 1 === stackPosition}
					{stackPosition}
					onDragStart={(event: DragEvent) =>
						handleDragStart(event, stackedCard, index, stackPosition)}
					onDragEnd={() => handleDragEnd()}
				/>
			{/each}
		</div>
	{/each}
	<div
		class="pointer-events-none fixed"
		style={`
          left: ${dragPosition.x - dragOffset.x}px;
          top: ${dragPosition.y - dragOffset.y}px;
          z-index: 9999;
          width: 3rem;
          height: 3rem;
        `}
	>
		<div class="relative h-full w-full">
			<div
				class={`
               absolute
				h-12 w-12 rounded-md border border-white bg-gray-300 opacity-100 shadow-lg
              `}
				style={`
                z-index: ${9999};
                left: 10px;
                top: 10px;
              `}
			></div>
		</div>
	</div>
</div>
