<script lang="ts">
	import { onMount } from 'svelte';
	import CardSystem from '$lib/components/CardSystem.svelte';
	import {
		cardStacks,
		CARD_VALUES,
		NO_OF_CARD_SLOT,
		getRandomDifferentColorSuits
	} from '$lib/components/shared.svelte';
	import type { CardType } from '$lib/components/shared.svelte';

	import CheckmarkButton from '$lib/components/CheckmarkButton.svelte';
	import StarButton from '$lib/components/StarButton.svelte';
	import WinCardSuitDeck from '$lib/components/WinCardSuitDeck.svelte';
	import DrawPileButton from '$lib/components/DrawPileButton.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';

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

	function pickCards<T>(array: Array<T>, noOfCards: number) {
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

	const randomSuits = getRandomDifferentColorSuits();

	function initCards() {
		const cardsData: CardType[] = [];

		// generate total 6 set of cards based on 2 suits
		let counter = 1;
		for (let i = 0; i < 3; i++) {
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

	let displayedCards: CardType[] = $state([]);
	let remainingCards: CardType[] = $state([]);

	const topN = 50; //10;
	const noOfStacks = topN / NO_OF_CARD_SLOT;

	onMount(() => {
		const cardsData = initCards();

		// Choose 10 random cards
		const pickResuts = pickCards(cardsData, topN);
		displayedCards = [...pickResuts.picked];
		remainingCards = [...pickResuts.remaining];

		displayedCards.forEach((dcard, index) => {
			const slotIndex = index % NO_OF_CARD_SLOT;
			cardStacks[slotIndex].push(dcard);
		});

		cardStacks.forEach((currentStack) => {
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
	function handleDrawPileClick(event: MouseEvent) {
		const remaingCount =
			remainingCards.length < NO_OF_CARD_SLOT ? remainingCards.length : NO_OF_CARD_SLOT;
		const piles = remainingCards.splice(0, remaingCount);

		piles.forEach((pcard, index) => {
			const currentStack = cardStacks[index];
			const currentStackCount = currentStack.length;

			pcard.isDraggable = true;
			currentStack.push(pcard);

			if (currentStackCount > 0) {
				let currentStackLastCard = pcard;
				let currentStackCard = currentStack[currentStackCount - 1];
				if (
					currentStackCard.isDraggable &&
					currentStackCard.valueIndex - 1 !== currentStackLastCard.valueIndex
				) {
					currentStackCard.isDraggable = false;
				}
				if (!currentStackCard.isDraggable) {
					for (let i = currentStackCount - 2; i >= 0; i--) {
						currentStackCard = currentStack[i];
						if (currentStackCard.isDraggable) {
							currentStackCard.isDraggable = false;
						}
					}
				}
			}
		});
	}

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
		<WinCardSuitDeck />

		<!-- Draw Pile -->
		<DrawPileButton onClick={handleDrawPileClick} {remainingCards} />
		<!-- Checkmark Button -->
		<!-- <CheckmarkButton /> -->

		<!-- Star Button -->
		<!-- <StarButton /> -->
	</div>

	<!-- Toolbar -->
	<Toolbar />
</div>
