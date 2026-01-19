<script lang="ts">
	import { mount, unmount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { send, receive } from './transition';

	import type {
		Position,
		CardType,
		CardSystemProps,
		GhostCardType,
		CheckIsValidDropMode
	} from '$lib/types';
	import { eventStore, dispatch } from '$lib/eventStore.svelte';
	import { RESPONSIVE_CLASS } from '$lib/constants';
	import { checkIfIsCompleteSuitStack, checkIfIsWinning, checkIsValidDrop } from '$lib/gameRules';
	import { calculateFontSize } from '../shared.svelte';

	import CardPreview from './CardPreview.svelte';
	import PokerCard from './PokerCard.svelte';

	// Modern Svelte 5 props
	let { cardSystemWidth = $bindable() }: CardSystemProps = $props();

	let draggedCards = $state<CardType[]>([]);
	let draggedIndex = $state(-1);
	let draggedStackPosition = $state(-1);
	let dragOverIndex = $state(-1);

	let dragPosition = $state<Position>({ x: 0, y: 0 });
	let offsetPosition = $state<Position>({ x: 0, y: 0 });
	let cardSystemElem = $state<HTMLDivElement | null>(null);

	const CARD_SLOT_ID_PREFIX = 'slot-';
	const CARD_PREVIEW_ID_PREFIX = 'preview-';

	// touch related setup
	let isTouchedStarted = $state(false);
	let cardHeight = $state(0);
	let cardWidth = $state(0);

	const cardOffsetHeight = $derived.by(() => {
		const fontSize = calculateFontSize(cardSystemWidth);
		const lineHeight = fontSize * 1.0;
		const offsetHeight = 0 + lineHeight;
		const scale = 1; // card size is 90% of slot size
		return offsetHeight * scale;
	});

	/**
	 * Generates a unique ID for a card preview.
	 * @returns A unique ID for a card preview.
	 */
	function generatePreviewId() {
		return `${CARD_PREVIEW_ID_PREFIX}${Date.now()}`;
	}

	/**
	 * Moves the dragged cards to the drop target if the drop is valid.
	 */
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

	/**
	 * Attempts to move the card by stage.
	 * @param ghostCard - The ghost card object.
	 * @param checkMode - The check mode.
	 * @param index - The index of the card.
	 * @param stackPosition - The stack position of the card.
	 * @returns True if a drop occurred, false otherwise.
	 */
	function tryMoveCardByStage(
		ghostCard: GhostCardType,
		checkMode: CheckIsValidDropMode,
		index: number,
		stackPosition: number
	) {
		let hasDrop = false;
		ghostCard.current.init();
		while (!(ghostCard.state.Left.hasReachedBoundary && ghostCard.state.Right.hasReachedBoundary)) {
			let newCardStack = eventStore.cards.display[ghostCard.current.index];

			let isValidToDrop = checkIsValidDrop(newCardStack, draggedCards, checkMode);
			if (isValidToDrop) {
				draggedIndex = index;
				draggedStackPosition = stackPosition;
				dragOverIndex = ghostCard.current.index;
				moveItems();
				hasDrop = true;
				break;
			}

			ghostCard.state[ghostCard.current.direction].move();

			ghostCard.current.tryFlipDirection();
		}
		return hasDrop;
	}

	/**
	 * Handles the click event on a card.
	 * @param event - The click event.
	 * @param index - The index of the card.
	 * @param stackPosition - The stack position of the card.
	 */
	function handleClick(
		event: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		},
		index: number,
		stackPosition: number
	) {
		event.preventDefault();

		const selectedCardStack = eventStore.cards.display[index];
		draggedCards = selectedCardStack.slice(stackPosition);
		draggedCards.forEach((dcard) => {
			dcard.isBeingDragged = true;
		});

		const ghostCard: GhostCardType = {
			state: {
				Left: {
					boundary: 0,
					index: index - 1,
					move() {
						this.index--;
					},
					get hasReachedBoundary() {
						return this.index < this.boundary;
					}
				},
				Right: {
					boundary: eventStore.cards.display.length - 1,
					index: index + 1,
					move() {
						this.index++;
					},
					get hasReachedBoundary() {
						return this.index > this.boundary;
					}
				}
			},
			current: {
				index: -1,
				direction: 'Left',
				tryFlipDirection() {
					const newDirection = this.direction === 'Left' ? 'Right' : 'Left';

					if (!ghostCard.state[newDirection].hasReachedBoundary) {
						this.direction = newDirection;
					}
					this.index = ghostCard.state[this.direction].index;
				},
				init() {
					ghostCard.state.Left.index = index - 1;
					ghostCard.state.Right.index = index + 1;
					this.direction = 'Left';
					this.index = ghostCard.state[this.direction].index;

					if (ghostCard.state[this.direction].hasReachedBoundary) {
						this.tryFlipDirection();
					}
				}
			}
		};

		let i = 0;
		const stages: CheckIsValidDropMode[] = ['sameSuitOnly', 'emptySlotLast', undefined];
		for (i = 0; i < stages.length; i++) {
			const hasDrop = tryMoveCardByStage(ghostCard, stages[i], index, stackPosition);
			if (hasDrop) {
				break;
			}
		}

		resetStatus();
	}

	// Handle drag start
	/**
	 * Handles the drag start event.
	 * @param event - The drag event.
	 * @param card - The card being dragged.
	 * @param index - The index of the card.
	 * @param stackPosition - The stack position of the card.
	 */
	function handleDragStart(event: DragEvent, card: CardType, index: number, stackPosition: number) {
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

			// Set drag image and effects
			if (cardSystemElem) {
				const htmlElemRect = htmlElem.getBoundingClientRect();
				offsetPosition.x = event.clientX - htmlElemRect.left;
				offsetPosition.y = event.clientY - htmlElemRect.top;

				const previewId = generatePreviewId();

				const dragPreviewElem = mount(CardPreview, {
					target: cardSystemElem,
					props: {
						id: previewId,
						cards: draggedCards,
						draggedIndex: draggedIndex,
						dragPosition,
						containerWidth: cardSystemWidth,
						cardOffsetHeight: cardOffsetHeight,
						cardHeight: cardHeight,
						cardWidth: cardWidth
					}
				});
				const dragPreview = document.getElementById(previewId);
				if (dragPreview) {
					event.dataTransfer.setDragImage(dragPreview, offsetPosition.x, offsetPosition.y);
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
	/**
	 * Handles the drop event.
	 * @param event - The drop event.
	 */
	function handleDrop(event: DragEvent) {
		event.preventDefault();

		moveItems();
	}

	/**
	 * Handles the drag over event.
	 * @param event - The drag event.
	 * @param index - The index of the card.
	 */
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

	/**
	 * Handles the drag end event.
	 */
	function handleDragEnd() {
		// Reset drag state
		resetStatus();
	}

	/**
	 * Handles the drag leave event.
	 */
	function handleDragLeave() {
		dragOverIndex = -1;
	}

	// Touch event handlers for mobile/touch support
	/**
	 * Handles the touch start event.
	 * @param event - The touch event.
	 * @param card - The card being touched.
	 * @param index - The index of the card.
	 * @param stackPosition - The stack position of the card.
	 */
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

		const htmlElem = event.currentTarget as HTMLDivElement;
		const htmlElemRect = htmlElem.getBoundingClientRect();

		// Record the touch position
		const touch = event.touches[0];
		offsetPosition.x = touch.clientX - htmlElemRect.left;
		offsetPosition.y = touch.clientY - htmlElemRect.top;

		dragPosition.x = touch.clientX - offsetPosition.x;
		dragPosition.y = touch.clientY - offsetPosition.y;

		// copy original card dimension (height x width)
		cardHeight = htmlElem.clientHeight;
		cardWidth = htmlElem.clientWidth;
	};

	/**
	 * Resets the drag status.
	 */
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
	}

	// Find which slot is under the touch point at the end
	/**
	 * Finds the touch slot under the current drag position.
	 * @param currentDragPosition - The current drag position.
	 * @returns The index of the touch slot, or -1 if no slot is found.
	 */
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

	/**
	 * Handles the touch end event.
	 */
	const handleTouchEnd = () => {
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
				dragPosition.x = touch.clientX - offsetPosition.x;
				dragPosition.y = touch.clientY - offsetPosition.y;

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
</script>

<!-- <svelte:document onmousemove={handleDocumentMouseMove} onmouseup={handleDocumentMouseUp} /> -->
<div class="flex flex-1 flex-col">
	<div
		bind:offsetWidth={cardSystemWidth}
		class={['flex flex-1 justify-center', RESPONSIVE_CLASS.GAP_SIZE]}
	>
		{#each eventStore.cards.display as stackedCards, index (index)}
			{@const lastStackPosition = stackedCards.length - 1}
			<div class="min-w-6 flex-1">
				<div
					class={[
						'relative border-dashed border-gray-300',
						dragOverIndex === index ? 'border-blue-400' : '',
						'aspect-7/11 h-auto w-full transition-transform',
						'rounded-sm @xl:rounded-lg @5xl:rounded-xl',
						'border-1 @5xl:border-2'
					]}
					id="{CARD_SLOT_ID_PREFIX}{index}"
					data-index={index}
					role="list"
					ondragover={(event: DragEvent) => handleDragOver(event, index)}
					ondrop={handleDrop}
					ondragleave={handleDragLeave}
					ondragend={handleDragEnd}
					ontouchend={handleTouchEnd}
				>
					{#each stackedCards as stackedCard, stackPosition (stackedCard.id)}
						{@const isDragOver =
							dragOverIndex === index && stackedCards.length - 1 === stackPosition}
						{@const isLastStackPosition = lastStackPosition === stackPosition}
						<button
							class={['absolute', 'h-full w-full p-1', 'top-(--stackOffset)']}
							style={`--stackOffset: ${stackPosition * cardOffsetHeight}px;`}
							animate:flip={{ duration: 300 }}
							in:receive={{ key: stackedCard.id }}
							out:send={{ key: stackedCard.id }}
							id="card-c-{index}-s-{stackPosition}"
							onclick={(event) =>
								stackedCard.isOpen && stackedCard.isDraggable
									? handleClick(event, index, stackPosition)
									: ''}
						>
							<PokerCard
								{index}
								{stackPosition}
								card={stackedCard}
								containerWidth={cardSystemWidth}
								hideWhenPreview={stackedCard.isBeingDragged}
								{isDragOver}
								{isLastStackPosition}
								onDragStart={handleDragStart}
								onTouchStart={handleTouchStart}
							/>
						</button>
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
				containerWidth={cardSystemWidth}
				{cardOffsetHeight}
				{cardHeight}
				{cardWidth}
			/>
		{/if}
	</div>
</div>
