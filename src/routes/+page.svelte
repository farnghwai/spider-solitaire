<script lang="ts">
	import { onMount } from 'svelte';
	import CardSystem from '$lib/components/CardSystem.svelte';
	import {
		CARD_VALUES,
		NO_OF_CARD_SLOT,
		GameSettings,
		getRandomDifferentColorSuits
	} from '$lib/components/shared.svelte';
	import type { CardType } from '$lib/components/shared.svelte';
	import { initCardStacks, eventStore, populateInitCardStacksTo } from '$lib/eventStore.svelte';

	import CheckmarkButton from '$lib/components/CheckmarkButton.svelte';
	import StarButton from '$lib/components/StarButton.svelte';
	import CompletedDeck from '$lib/components/CompletedDeck.svelte';
	import DrawPileButton from '$lib/components/DrawPileButton.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import WinningOverlay from '$lib/components/WinningOverlay.svelte';

	// reference: https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
	// suggest by ChatGPT GPT-4o
	// Shuffle the array using Fisher-Yates algorithm
	function shuffleArray<T>(array: Array<T>) {
		const arr = [...array];
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	function keepNoOfCardsForDraw<T>(array: Array<T>, noOfCards: number) {
		//ratio = 0.6) {
		const shuffled = shuffleArray(array);
		// const splitIndex = Math.floor(shuffled.length * ratio);
		const set1 = shuffled.slice(0, noOfCards);
		const set2 = shuffled.slice(noOfCards);
		return {
			picked: set2,
			remaining: set1
		};
	}

	function generateCardSuites(totalDecks: number) {
		const cardsData: CardType[] = [];

		// generate total 6 set of cards based on 2 suits
		const randomSuits = getRandomDifferentColorSuits();
		const nofOfLoop = randomSuits.length > 0 ? totalDecks / randomSuits.length : 0;

		let counter = 1;

		for (let i = 0; i < nofOfLoop; i++) {
			for (const suit of randomSuits) {
				CARD_VALUES.forEach((value, index) => {
					cardsData.push({
						id: counter,
						value,
						suit,
						valueIndex: index,
						isDraggable: false,
						isBeingDragged: false
					});
					counter++;
				});
			}
		}
		return cardsData;
	}

	function initCards() {
		// no action if cardStacks already have card
		if (!initCardStacks.display.every((cardSlot) => cardSlot.length === 0)) {
			return;
		}

		const totalDecks = GameSettings.difficultyMode.simple.totalDeck;
		const cardsData = generateCardSuites(totalDecks);

		// Choose 10 random cards
		const pickResuts = keepNoOfCardsForDraw(
			cardsData,
			GameSettings.difficultyMode.simple.noOfDrawRound * NO_OF_CARD_SLOT
		);

		pickResuts.picked.forEach((dcard, index) => {
			const slotIndex = index % NO_OF_CARD_SLOT;
			initCardStacks.display[slotIndex].push(dcard);
		});

		initCardStacks.display.forEach((currentStack) => {
			const currentStackCount = currentStack.length;
			let currentStackLastCard = currentStack[currentStackCount - 1];
			currentStackLastCard.isDraggable = true;
			for (let i = currentStackCount - 1; i >= 0; i--) {
				const currentStackCard = currentStack[i];
				if (
					!currentStackCard.isDraggable &&
					currentStackCard.valueIndex - 1 === currentStackLastCard.valueIndex
				) {
					currentStackCard.isDraggable = true;
				}
				currentStackLastCard = { ...currentStackCard };
			}
		});
		initCardStacks.remaining.push(...pickResuts.remaining);
		populateInitCardStacksTo(eventStore.cards);
		eventStore.totalDeck = totalDecks;
	}

	onMount(() => {
		initCards();
	});

	// Timer state
	let timer = '00:23';

	// Function to handle card click
	// function handleCardClick(event) {
	// 	const card = event.currentTarget;
	// 	card.style.transform = 'translateY(-10px)';
	// 	setTimeout(() => {
	// 		card.style.transform = 'translateY(0)';
	// 	}, 200);
	// }

	// // Function to handle draw pile click
	// function handleDrawPileClick(event: MouseEvent) {
	// 	const remaingCount =
	// 		remainingCards.length < NO_OF_CARD_SLOT ? remainingCards.length : NO_OF_CARD_SLOT;
	// 	if (remaingCount > 0) {
	// 		dispatch({
	// 			type: 'drawPile',
	// 			payload: {
	// 				remaingCount: remaingCount
	// 			}
	// 		});
	// 	}
	// }

	// function handleCardUpdate(newCards) {
	// 	displayedCards = newCards;
	// }
</script>

<div class="flex min-h-screen flex-col bg-green-800 text-white select-none">
	<div class="relative flex flex-1 flex-col p-5">
		<!-- Timer -->
		<div class="absolute top-2.5 left-2.5 text-sm">{timer}</div>

		<!-- Top Row Cards -->
		<!-- <div class="mb-5 flex justify-center gap-2">
			{#each displayedCards as card}
				<Card {card} on:click={handleCardClick} />
			{/each}
		</div> -->
		<CardSystem />

		<!-- WinCardSuitDeck Pile -->
		<CompletedDeck />

		<!-- Draw Pile -->
		<DrawPileButton />
		<!-- Checkmark Button -->
		<!-- <CheckmarkButton /> -->

		<!-- Star Button -->
		<!-- <StarButton /> -->
	</div>

	<!-- Toolbar -->
	<Toolbar />

	<WinningOverlay />
</div>
