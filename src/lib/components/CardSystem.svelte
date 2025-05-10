<script lang="ts">
	import { mount, unmount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { send, receive } from './transition';

	import type { Position, CardType } from '$lib/types';
	import { eventStore, dispatch } from '$lib/eventStore.svelte';
	import { RESPONSIVE_CLASS } from '$lib/constants';
	import { checkIfIsCompleteSuitStack, checkIfIsWinning, checkIsValidDrop } from '$lib/gameRules';

	import CardPreview from './CardPreview.svelte';
	import PokerCard from './PokerCard.svelte';

	// Modern Svelte 5 props
	let draggedCards = $state<CardType[]>([]);
	let draggedIndex = $state(-1);
	let draggedStackPosition = $state(-1);
	let dragOverIndex = $state(-1);
	let isBeingDragged = $state(false);

	let dragPosition: Position = $state({ x: 0, y: 0 });
	let cardSystemElem = $state<HTMLDivElement | null>(null);

	const CARD_SLOT_ID_PREFIX = 'slot-';
	const CARD_PREVIEW_ID_PREFIX = 'preview-';

	// touch related setup
	let isTouchedStarted = $state(false);
	let cardHeight = $state(0);
	let cardWidth = $state(0);

	function generatePreviewId() {
		return `${CARD_PREVIEW_ID_PREFIX}${Date.now()}`;
	}

	function moveItems() {
		if (draggedCards.length > 0 && draggedIndex !== -1 && draggedStackPosition !== -1) {
			let newCardStack = eventStore.cards.display[dragOverIndex];
			let isValidToDrop = checkIsValidDrop(newCardStack, draggedCards);

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

					if (checkIfIsWinning(eventStore)) {
						dispatch({
							type: 'win',
							payload: null
						});
					}
				}
			}
		}
	}

	// Handle drag start
	function handleDragStart(event: DragEvent, card: CardType, index: number, stackPosition: number) {
		isBeingDragged = true;

		let selectedCardStack = eventStore.cards.display[index];
		draggedCards = selectedCardStack.slice(stackPosition);
		draggedCards.forEach((dcard) => {
			dcard.isBeingDragged = true;
		});
		draggedIndex = index;
		draggedStackPosition = stackPosition;

		// copy original card dimension (height x width)
		const htmlElem = event.currentTarget as HTMLDivElement;
		cardHeight = htmlElem.clientHeight;
		cardWidth = htmlElem.clientWidth;

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
			if (cardSystemElem) {
				const previewId = generatePreviewId();
				const dragPreviewElem = mount(CardPreview, {
					target: cardSystemElem,
					props: {
						id: previewId,
						cards: draggedCards,
						draggedIndex: draggedIndex,
						dragPosition,
						cardHeight: cardHeight,
						cardWidth: cardWidth
					}
				});
				const dragPreview = document.getElementById(previewId);
				if (dragPreview) {
					event.dataTransfer.setDragImage(dragPreview, 30, 15);
				}
				// Clean up after dragging
				setTimeout(() => {
					unmount(dragPreviewElem);
				}, 0);
			}

			event.dataTransfer.effectAllowed = 'move';
		}
	}

	// Handle drop
	function handleDrop(event: DragEvent) {
		event.preventDefault();

		moveItems();
	}

	function handleDragOver(event: DragEvent, index: number) {
		const newCardStack = eventStore.cards.display[index];
		let isValidToDrop = checkIsValidDrop(newCardStack, draggedCards);
		if (isValidToDrop) {
			event.preventDefault();
			if (event.dataTransfer) {
				event.dataTransfer.dropEffect = 'move';
			}
			dragOverIndex = index;
		}
	}

	function handleDragEnd() {
		// Reset drag state
		resetStatus();
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
		dragPosition.x = touch.clientX;
		dragPosition.y = touch.clientY;

		// copy original card dimension (height x width)
		cardHeight = (event.currentTarget as HTMLDivElement).clientHeight;
		cardWidth = (event.currentTarget as HTMLDivElement).clientWidth;
	};

	function resetStatus() {
		draggedCards.forEach((dcard) => {
			dcard.isBeingDragged = false;
		});
		draggedCards = [];

		cardHeight = 0;
		cardWidth = 0;

		draggedIndex = -1;
		draggedStackPosition = -1;

		dragOverIndex = -1;
		isBeingDragged = false;
	}

	// Find which slot is under the touch point at the end
	function findTouchSlot(currentDragPosition: Position) {
		const { x, y } = currentDragPosition;
		const elements = document.elementsFromPoint(x, y);
		// Find the first slot element under the touch point
		const slotElement =
			elements?.length > 0 ? elements[0].closest(`[id^=${CARD_SLOT_ID_PREFIX}]`) : null;

		if (slotElement) {
			const touchOverIndex = Number((slotElement as HTMLDivElement).dataset.index);
			return touchOverIndex;
		}
		return -1;
	}

	const handleTouchEnd = (event: TouchEvent) => {
		if (!isTouchedStarted) return;

		isTouchedStarted = false;

		const touchOverIndex = findTouchSlot(dragPosition);

		if (touchOverIndex !== -1) {
			dragOverIndex = touchOverIndex;
			moveItems();
		}

		// reset status
		resetStatus();
	};

	$effect(() => {
		const handleTouchMove = (event: TouchEvent) => {
			if (isTouchedStarted) {
				event.preventDefault();

				const touch = event.touches[0];
				dragPosition.x = touch.clientX;
				dragPosition.y = touch.clientY;

				const touchOverIndex = findTouchSlot(dragPosition);
				if (touchOverIndex !== -1) {
					const newCardStack = eventStore.cards.display[touchOverIndex];

					let isValidToDrop = checkIsValidDrop(newCardStack, draggedCards);
					if (isValidToDrop) {
						dragOverIndex = touchOverIndex;
					}
				} else {
					// reset if move out slot that is not valid for drop
					dragOverIndex = touchOverIndex;
				}
			}
		};

		// Add event listeners
		document.addEventListener('touchmove', handleTouchMove, { passive: false });
		// document.addEventListener('touchend', handleTouchEnd);

		// Clean up
		return () => {
			document.removeEventListener('touchmove', handleTouchMove);
			// document.removeEventListener('touchend', handleTouchEnd);
		};
	});

	/*
      h    x  w
 7xl: 176     112     11:7 (16)
 5xl: 132      84     11:7 (12)
 3xl: 110      70     11:7 (10)
  xl:  88      56     11:7  (8)
base:  56      32     11:7  (4)
*/
</script>

<!-- <svelte:document onmousemove={handleDocumentMouseMove} onmouseup={handleDocumentMouseUp} /> -->
<div class="flex flex-1 flex-col">
	<div class={['flex flex-1 justify-center', RESPONSIVE_CLASS.GAP_SIZE]}>
		{#each eventStore.cards.display as stackedCards, index}
			<div class={[RESPONSIVE_CLASS.CARD_SIZE]}>
				<div
					class={[
						'relative border-dashed border-gray-300',
						dragOverIndex === index ? 'border-blue-400' : '',
						'aspect-7/11 h-auto w-full',
						'rounded-sm @xl:rounded-lg @5xl:rounded-xl',
						'border-1 @5xl:border-2'
					]}
					id="{CARD_SLOT_ID_PREFIX}{index}"
					data-index={index}
					role="listitem"
					ondragover={(event: DragEvent) => handleDragOver(event, index)}
					ondrop={handleDrop}
					ondragleave={handleDragLeave}
					ondragend={handleDragEnd}
					ontouchend={handleTouchEnd}
				>
					{#each stackedCards as stackedCard, stackPosition (stackedCard.id)}
						{@const isDragOver =
							dragOverIndex === index && stackedCards.length - 1 === stackPosition}
						<div
							class={[
								'absolute',
								'aspect-7/11 h-auto w-full scale-95 @xl:scale-90',
								'top-[calc(var(--spacing)*var(--stackOffset)*5)]',
								'@xl:top-[calc(var(--spacing)*var(--stackOffset)*7.5)]',
								'@3xl:top-[calc(var(--spacing)*var(--stackOffset)*8)]',
								'@5xl:top-[calc(var(--spacing)*var(--stackOffset)*8.5)]',
								'@7xl:top-[calc(var(--spacing)*var(--stackOffset)*9)]'
							]}
							style="--stackOffset: {stackPosition};"
							animate:flip={{ duration: 300 }}
							in:receive={{ key: stackedCard.id }}
							out:send={{ key: stackedCard.id }}
							id="card-c-{index}-s-{stackPosition}"
						>
							<PokerCard
								{index}
								{stackPosition}
								card={stackedCard}
								hideWhenPreview={stackedCard.isBeingDragged}
								{isDragOver}
								onDragStart={handleDragStart}
								onTouchStart={handleTouchStart}
							/>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
	<div bind:this={cardSystemElem} class={{ 'opacity-0': !isTouchedStarted }}>
		{#if isTouchedStarted}
			<CardPreview
				id={generatePreviewId()}
				cards={draggedCards}
				{draggedIndex}
				{dragPosition}
				{cardHeight}
				{cardWidth}
			/>
		{/if}
	</div>
</div>
