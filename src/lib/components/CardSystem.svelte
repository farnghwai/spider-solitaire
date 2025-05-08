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
	let draggedCard = $state<CardType | null>(null);
	let draggedCards = $state<CardType[]>([]);
	let draggedIndex = $state(-1);
	let draggedStackPosition = $state(-1);
	let dragOverIndex = $state(-1);
	let isBeingDragged = $state(false);

	let dragPosition: Position = $state({ x: 0, y: 0 });
	let dragOffset: Position = $state({ x: 0, y: 0 });

	const CARD_SLOT_ID_PREFIX = 'slot-';

	// touch related setup
	let isTouchedStarted = $state(false);
	let touchPosition: Position = $state({ x: 0, y: 0 });
	let touchMessage = $state('');
	let touchCardHeight = $state(0);
	let touchCardWidth = $state(0);

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
						dispatch({
							type: 'win',
							payload: null
						});
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

	// Touch event handlers for mobile/touch support
	const handleTouchStart = (
		event: TouchEvent,
		card: CardType,
		index: number,
		stackPosition: number
	) => {
		// no action if the card is not draggable
		if (!card.isDraggable) {
			return;
		}

		event.stopPropagation();

		// If the item is already selected, use all selected items
		// const itemsToMove = selectedItemIds.includes(stackPosition) ? selectedItemIds : [stackPosition];
		let selectedCardStack = eventStore.cards.display[index];
		draggedCards = selectedCardStack.slice(stackPosition);

		isTouchedStarted = true;
		draggedCards.forEach((dcard) => {
			dcard.isBeingDragged = true;
		});
		draggedIndex = index;
		draggedStackPosition = stackPosition;

		// Record the touch position
		const touch = event.touches[0];
		touchPosition.x = touch.clientX;
		touchPosition.y = touch.clientY;

		// copy original card dimension (height x width)
		touchCardHeight = (event.currentTarget as HTMLDivElement).clientHeight;
		touchCardWidth = (event.currentTarget as HTMLDivElement).clientWidth;
	};

	const handleTouchEnd = (event: TouchEvent) => {
		if (!isTouchedStarted) return;
		isTouchedStarted = false;

		// Find which slot is under the touch point at the end
		const { x, y } = touchPosition;
		const elements = document.elementsFromPoint(x, y);
		// Find the first slot element under the touch point
		const slotElement =
			elements?.length > 0 ? elements[0].closest(`[id^=${CARD_SLOT_ID_PREFIX}]`) : null;

		if (slotElement) {
			const dragOverIndex = Number((slotElement as HTMLDivElement).dataset.index);

			if (draggedCards.length > 0 && draggedIndex !== -1 && draggedStackPosition !== -1) {
				let newCardStack = eventStore.cards.display[dragOverIndex];
				let isValidToDrop = false;
				if (newCardStack.length === 0) {
					isValidToDrop = true;
				} else {
					const newCardStackLastPosition = newCardStack.length - 1;
					const newLastCard = newCardStack[newCardStackLastPosition];

					if (newLastCard.valueIndex - 1 === draggedCards[0].valueIndex) {
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
							dispatch({
								type: 'win',
								payload: null
							});
						}
					}
				}
			}
		}

		// reset status
		draggedCards.forEach((dcard) => {
			dcard.isBeingDragged = false;
		});
		draggedCards = [];

		touchCardHeight = 0;
		touchCardWidth = 0;
	};

	$effect(() => {
		const handleTouchMove = (e: TouchEvent) => {
			if (isTouchedStarted) {
				e.preventDefault(); // Prevent scrolling while dragging

				const touch = e.touches[0];
				touchPosition.x = touch.clientX;
				touchPosition.y = touch.clientY;
			}
		};

		// const handleTouchEnd = (e: TouchEvent) => {
		// 	if (isDragging && touchPosition && draggingItemId && draggingFromSlotId) {
		// 		// Find which slot we're over
		// 		const elementsAtPoint = document.elementsFromPoint(touchPosition.x, touchPosition.y);

		// 		let targetSlot: HTMLElement | null = null;

		// 		// Find a slot element among the elements at the touch point
		// 		for (const el of elementsAtPoint) {
		// 			if (el.classList.contains('slot-container')) {
		// 				targetSlot = el as HTMLElement;
		// 				break;
		// 			}
		// 		}

		// 		// If we found a target slot
		// 		if (targetSlot) {
		// 			const targetSlotId = targetSlot.dataset.slotId;
		// 			if (targetSlotId) {
		// 				moveItem(draggingFromSlotId, targetSlotId, draggingItemId);
		// 			}
		// 		}

		// 		// Reset the dragged element styles
		// 		if (draggedElement) {
		// 			draggedElement.style.position = '';
		// 			draggedElement.style.left = '';
		// 			draggedElement.style.top = '';
		// 			draggedElement.style.zIndex = '';
		// 			draggedElement.style.opacity = '';
		// 			draggedElement.style.pointerEvents = '';
		// 		}

		// 		// Clear drag state
		// 		setIsDragging(false);
		// 		setDraggedElement(null);
		// 		setDraggingItemId(null);
		// 		setDraggingFromSlotId(null);
		// 		setTouchPosition(null);
		// 	}
		// };

		// Add event listeners
		document.addEventListener('touchmove', handleTouchMove, { passive: false });
		// document.addEventListener('touchend', handleTouchEnd);

		// Clean up
		return () => {
			document.removeEventListener('touchmove', handleTouchMove);
			// document.removeEventListener('touchend', handleTouchEnd);
		};
	});
</script>

<svelte:document onmousemove={handleDocumentMouseMove} onmouseup={handleDocumentMouseUp} />

<div class="mb-5 flex justify-center gap-0.5 @xl:gap-2">
	{#each eventStore.cards.display as stackedCards, index}
		<div
			class={[
				'relative border-dashed border-gray-300 ',
				dragOverIndex === index ? 'border-blue-400' : '',
				'h-16 w-10 @xl:h-22 @xl:w-14 @5xl:h-44 @5xl:w-28',
				'rounded-lg @5xl:rounded-xl',
				'border-1 @xl:border-2'
			]}
			id="{CARD_SLOT_ID_PREFIX}{index}"
			data-index={index}
			role="listitem"
			ondragover={(event: DragEvent) => handleDragOver(event, index)}
			ondrop={handleDrop}
			ondragleave={handleDragLeave}
			ontouchend={handleTouchEnd}
		>
			{#each stackedCards as stackedCard, stackPosition (stackedCard.id)}
				{@const suitSymbol = CardSuit[stackedCard.suit].icon}
				{@const isDragOver = dragOverIndex === index && stackedCards.length - 1 === stackPosition}

				<div
					class={[
						'absolute',
						'top-[calc(var(--spacing)*var(--stackOffset)*5)]',
						'@xl:top-[calc(var(--spacing)*var(--stackOffset)*7)]',
						'@5xl:top-[calc(var(--spacing)*var(--stackOffset)*9)]',
						'h-full w-full',
						'p-0.5 @xl:p-1 @5xl:p-2'
					]}
					style="--stackOffset: {stackPosition};"
					animate:flip={{ duration: 300 }}
					in:receive={{ key: stackedCard.id }}
					out:send={{ key: stackedCard.id }}
					id="card-c-{index}-s-{stackPosition}"
				>
					<div
						role="listitem"
						aria-grabbed={stackedCard.isBeingDragged ? true : false}
						class={[
							'flex h-full w-full flex-col border border-gray-200 shadow-sm select-none',
							'rounded-sm @xl:rounded-lg',
							stackedCard.isDraggable && 'cursor-grab hover:-translate-y-1 hover:shadow-md',
							stackedCard.isBeingDragged && 'cursor-grabbing opacity-0',
							isDragOver ? 'bg-amber-100 ring-2 ring-amber-500' : 'bg-white',
							CardColors[CardSuit[stackedCard.suit].color]
						]}
						draggable={stackedCard.isDraggable}
						ondragstart={(event: DragEvent) =>
							handleDragStart(event, stackedCard, index, stackPosition)}
						ondragend={handleDragEnd}
						ontouchstart={(event: TouchEvent) =>
							handleTouchStart(event, stackedCard, index, stackPosition)}
					>
						<div
							class={[
								'w-full rounded-t-md',
								'h-0.5 @5xl:h-1.5',
								stackedCard.isDraggable && 'border-t-1 border-t-teal-400 @5xl:border-t-2'
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
							<div class=" font-bold">{stackedCard.value}</div>
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
				</div>
			{/each}
		</div>
	{/each}
</div>
{#if isTouchedStarted}
	<div
		class="pointer-events-none fixed z-[9999] flex -translate-x-1/2 -translate-y-4 items-center"
		style={`left: ${touchPosition.x}px; top: ${touchPosition.y}px`}
	>
		<div class="relative flex flex-col">
			{#each draggedCards as touchDraggedCard, touchDraggedIndex (touchDraggedCard.id)}
				{@const touchSuitSymbol = CardSuit[touchDraggedCard.suit].icon}
				<div
					role="listitem"
					aria-grabbed="true"
					id="card-td-{touchDraggedIndex}"
					class={[
						'flex h-full w-full flex-col rounded-sm border border-gray-200 shadow-sm select-none',
						'rounded-sm @xl:rounded-lg',
						'bg-white',
						CardColors[CardSuit[touchDraggedCard.suit].color],
						'-translate-y-[calc(var(--spacing)*var(--stackOffset)*8.8)]',
						'@xl:-translate-y-[calc(var(--spacing)*var(--stackOffset)*11.5)]',
						'@5xl:-translate-y-[calc(var(--spacing)*var(--stackOffset)*30)]'
					]}
					style={`z-index: 9999 - ${touchDraggedIndex}; --stackOffset: ${touchDraggedIndex};`}
					style:height={`${touchCardHeight}px`}
					style:width={`${touchCardWidth}px`}
				>
					<div
						class={[
							'w-full rounded-t-md',
							'h-0.5 @5xl:h-1.5',
							touchDraggedCard.isDraggable && 'border-t-1 border-t-teal-400 @5xl:border-t-2'
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
						<div class=" font-bold">{touchDraggedCard.value}</div>
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
{/if}
