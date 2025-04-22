<script>
	// Modern Svelte 5 props

	let { displayedCards, onUpdate, onClick } = $props();

	// Svelte 5 reactive state
	let draggedCard = $state(null);
	let draggedIndex = $state(-1);
	let dragOverIndex = $state(-1);

	// Card stacks - keeps track of which cards are stacked in each slot
	let cardStacks = $state(
		Array(10)
			.fill()
			.map(() => [])
	);

	// Process displayed cards into stacks - using Svelte 5 effect
	$effect(() => {
		// Reset stacks
		cardStacks = Array(10)
			.fill()
			.map(() => []);

		// Process normalized cards (limited to 10 slots)
		const cards = displayedCards.slice(0, 10);
		cards.forEach((card, index) => {
			if (card) {
				cardStacks[index].push(card);
			}
		});
	});

	// Handle card click using the callback prop
	function handleCardClick(card) {
		if (card) {
			onClick(card);
		}
	}

	// Handle drag start
	function handleDragStart(card, index) {
		draggedCard = card;
		draggedIndex = index;
	}

	// Handle drop
	function handleDrop(index) {
		if (draggedCard && draggedIndex !== -1) {
			// Create copy of stacks
			const newStacks = JSON.parse(JSON.stringify(cardStacks));

			// Find the card in the original stack
			let cardToMove = null;
			let fromStackIndex = -1;

			// Search through all stacks to find the dragged card
			for (let i = 0; i < newStacks.length; i++) {
				const cardIndex = newStacks[i].findIndex((c) => c.id === draggedCard.id);
				if (cardIndex !== -1) {
					cardToMove = newStacks[i].splice(cardIndex, 1)[0];
					fromStackIndex = i;
					break;
				}
			}

			if (cardToMove) {
				// Add to new stack
				newStacks[index].push(cardToMove);

				// Update the stacks
				cardStacks = newStacks;

				// Flatten stacks to update displayedCards using callback prop
				const newCards = newStacks.flatMap((stack) => stack);
				onUpdate(newCards);
			}
		}

		// Reset drag state
		draggedCard = null;
		draggedIndex = -1;
		dragOverIndex = -1;
	}
</script>

<div class="mb-5 flex justify-center gap-2">
	{#each Array(10) as _, index}
		<div
			class="relative h-44 w-28 rounded-lg border-2 border-dashed border-gray-300 transition-all duration-200 ease-in-out hover:border-gray-400 {dragOverIndex ===
			index
				? 'border-blue-400'
				: ''}"
			data-index={index}
			on:dragover|preventDefault={() => (dragOverIndex = index)}
			on:dragleave={() => (dragOverIndex = -1)}
			on:drop|preventDefault={() => handleDrop(index)}
		>
			{#each cardStacks[index] as stackedCard, stackPosition}
				<Card
					card={stackedCard}
					{index}
					{stackPosition}
					isDragOver={dragOverIndex === index}
					onCardClick={() => handleCardClick(stackedCard)}
					onDragStart={() => handleDragStart(stackedCard, index)}
				/>
			{/each}
		</div>
	{/each}
</div>
