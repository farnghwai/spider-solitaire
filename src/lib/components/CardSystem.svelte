<script lang="ts">
	import Card from './Card.svelte';
	import { cardStacks } from './shared.svelte';
	import type { CardType, CardSystemProps } from './shared.svelte';

	// Modern Svelte 5 props
	let { onUpdate, onClick }: CardSystemProps = $props();
	// $inspect('cardSystem', 'displayedCards', displayedCards.length, displayedCards);
	// Svelte 5 reactive state
	let draggedCard = $state(null);
	let draggedIndex = $state(-1);
	let dragOverIndex = $state(-1);
	let isBeingDragged = $state(false);

	$inspect('cardSystem after', 'cardStacks', cardStacks);
	// Process displayed cards into stacks - using Svelte 5 effect
	// $effect(() => {
	// 	// Reset stacks
	// 	cardStacks = Array(10)
	// 		.fill()
	// 		.map(() => []);

	// 	// Process normalized cards (limited to 10 slots)
	// 	const cards = displayedCards.slice(0, 10);
	// 	cards.forEach((card, index) => {
	// 		if (card) {
	// 			cardStacks[index].push(card);
	// 		}
	// 	});
	// });

	// Handle card click using the callback prop
	function handleCardClick(card) {
		if (card) {
			onClick(card);
		}
	}
	// $inspect(draggedCard).with(console.trace);
	// $inspect(draggedIndex).with(console.trace);

	// Handle drag start
	function handleDragStart(card: CardType, index: number) {
		draggedCard = card;
		// draggedIndex = index;
		const dc = $state.snapshot(draggedCard);
		const di = $state.snapshot(draggedIndex);
		console.log('handleDragStart', di, dc);
	}

	// Handle drop
	function handleDrop(event: DragEvent) {
		event.preventDefault();

		const data = event.dataTransfer?.getData('text/plain');

		const dc = $state.snapshot(draggedCard);
		const di = $state.snapshot(draggedIndex);
		console.log('handleDrop1', data, 'draggedCard', dc, 'draggedIndex', di);
		if (draggedCard && draggedIndex !== -1) {
			//cardStacks[di].push(dc);
			const oldStackFromIndex = JSON.parse(data)?.fromIndex;
			const oi = $state.snapshot(oldStackFromIndex);
			if (oi === draggedIndex) {
				draggedIndex = -1;
				return;
			}

			const newCardStack = cardStacks[draggedIndex];
			newCardStack.push(draggedCard);

			const oldCardStack = cardStacks[oldStackFromIndex];
			const oldCard = oldCardStack.pop();
			const dss = $state.snapshot(oldCard);
			console.log('oldcard2', dss);
			//cardStacks.splice(oldStackFromIndex, 1);
			draggedIndex = -1;
			//console.log('processign handleDrop', renderCardStacks, di, dc);
			// Create copy of stacks
			// // Find the card in the original stack
			// let cardToMove = null;
			// let fromStackIndex = -1;
			// // Search through all stacks to find the dragged card
			// for (let i = 0; i < newStacks.length; i++) {
			// 	const cardIndex = newStacks[i].findIndex((c) => c.id === draggedCard.id);
			// 	if (cardIndex !== -1) {
			// 		cardToMove = newStacks[i].splice(cardIndex, 1)[0];
			// 		fromStackIndex = i;
			// 		break;
			// 	}
			// }
			// if (cardToMove) {
			// 	// Add to new stack
			// 	newStacks[index].push(cardToMove);
			// 	// Update the stacks
			// 	cardStacks = newStacks;
			// 	// Flatten stacks to update displayedCards using callback prop
			// 	const newCards = newStacks.flatMap((stack) => stack);
			// 	onUpdate(newCards);
			// }
		}

		// Reset drag state
		draggedCard = null;
		draggedIndex = -1;
		dragOverIndex = -1;
	}

	function handleDragOver(event: DragEvent, index: number) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
		draggedIndex = index;
	}

	function handleDragEnd(stackedCard) {
		// console.log(stackedCard, index);
		console.log('handleDragEnd', stackedCard);
	}

	// $inspect('renderCardStacksA', renderCardStacks);
</script>

<div class="mb-5 flex justify-center gap-2">
	{#each cardStacks as stackedCards, index}
		<div
			class="relative h-44 w-28 rounded-lg border-2 border-dashed border-gray-300 transition-all duration-200 ease-in-out hover:border-gray-400 {dragOverIndex ===
			index
				? 'border-blue-400'
				: ''}"
			data-index={index}
			role="listitem"
			ondragover={(event: DragEvent) => handleDragOver(event, index)}
			ondrop={handleDrop}
		>
			{#each stackedCards as stackedCard, stackPosition}
				<Card
					card={stackedCard}
					{index}
					isDragOver={dragOverIndex === index}
					{stackPosition}
					onCardClick={() => handleCardClick(stackedCard)}
					onDragStart={() => handleDragStart(stackedCard, index)}
					onDragEnd={(event) => handleDragEnd(event)}
				/>
			{/each}
		</div>
	{/each}
</div>
