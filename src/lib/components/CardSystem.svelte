<script lang="ts">
	import { flip } from 'svelte/animate';
	import { send, receive } from './transition';

	import { CardSuit, CardColors, CARD_VALUES } from './shared.svelte';
	import type { CardType, CardSystemProps, Position } from './shared.svelte';
	import { eventStore, dispatch } from '$lib/eventStore.svelte';

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

	function checkIfIsCompleteSuitStack(currentCardStack: CardType[]) {
		if (currentCardStack.length === 0 || currentCardStack.length < CARD_VALUES.length) {
			return false;
		}

		let isValid = true;
		let currentCardStackLastIndex = currentCardStack.length - 1;
		const lastSuit = currentCardStack[currentCardStackLastIndex].suit;
		for (let i = 0, j = currentCardStackLastIndex; i < CARD_VALUES.length && j >= 0; i++, j--) {
			if (CARD_VALUES[i] !== currentCardStack[j].value || lastSuit !== currentCardStack[j].suit) {
				isValid = false;
				break;
			}
		}

		return isValid;
	}

	function checkIfIsWinning() {
		const completedCount = eventStore.cards.completed.length - 1; // exclude empty slot for animation used.

		if (eventStore.totalDeck === completedCount) {
			return true;
		}

		return false;
	}

	// Handle drop
	function handleDrop(event: DragEvent) {
		event.preventDefault();

		if (draggedCard && draggedIndex !== -1 && draggedStackPosition !== -1) {
			let newCardStack = eventStore.cards.display[dragOverIndex];
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
				dispatch({
					type: 'move',
					payload: {
						oldIndex: draggedIndex,
						draggedStackPosition: draggedStackPosition,
						newIndex: dragOverIndex
					}
				});

				const dragOverCardStack = eventStore.cards.display[dragOverIndex];
				if (checkIfIsCompleteSuitStack(dragOverCardStack)) {
					dispatch({
						type: 'deckCompleted',
						payload: {
							dragOverIndex: dragOverIndex
						}
					});

					if (checkIfIsWinning()) {
						console.log('win');
					}
				}
			}
		}
	}

	function handleDragOver(event: DragEvent, index: number) {
		const newCardStack = eventStore.cards.display[index];
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
	{#each eventStore.cards.display as stackedCards, index}
		<div
			class={[
				'relative h-44 w-28 rounded-lg border-2 border-dashed border-gray-300   ',
				dragOverIndex === index ? 'border-blue-400' : ''
			]}
			data-index={index}
			role="listitem"
			ondragover={(event: DragEvent) => handleDragOver(event, index)}
			ondrop={handleDrop}
			ondragleave={handleDragLeave}
		>
			{#each stackedCards as stackedCard, stackPosition (stackedCard.id)}
				{@const stackOffset = stackPosition * 9}
				{@const suitSymbol = CardSuit[stackedCard.suit].icon}
				{@const isDragOver = dragOverIndex === index && stackedCards.length - 1 === stackPosition}

				<div
					class="absolute top-[calc(var(--spacing)*var(--stackOffset))] h-full w-full p-2"
					style="--stackOffset: {stackOffset};"
					animate:flip={{ duration: 300 }}
					in:receive={{ key: stackedCard.id }}
					out:send={{ key: stackedCard.id }}
				>
					<div
						role="listitem"
						aria-grabbed={stackedCard.isBeingDragged ? true : false}
						id="card-c-{index}-s-{stackPosition}"
						class={[
							'flex h-full flex-col rounded-lg border border-gray-200  shadow-sm  select-none',
							stackedCard.isDraggable && 'cursor-grab hover:-translate-y-1 hover:shadow-md',
							stackedCard.isBeingDragged && 'cursor-grabbing opacity-100',
							isDragOver ? 'bg-amber-100 ring-2 ring-amber-500' : 'bg-white',
							CardColors[CardSuit[stackedCard.suit].color]
						]}
						draggable={stackedCard.isDraggable}
						ondragstart={(event: DragEvent) =>
							handleDragStart(event, stackedCard, index, stackPosition)}
						ondragend={handleDragEnd}
					>
						<div
							class={[
								'h-1.5 w-full rounded-t-md',
								stackedCard.isDraggable && 'border-t-2 border-t-teal-400'
							]}
							style="background: repeating-linear-gradient(90deg, #ff9999, #ff9999 3px, white 3px, white 6px);"
						></div>

						<div class="flex justify-between px-2 text-xl">
							<div class=" font-bold">{stackedCard.value}</div>
							<div class=" font-bold">{suitSymbol}</div>
						</div>
						<div class="flex grow items-center justify-center text-7xl">
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
	<!-- <div
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
	</div> -->
</div>
