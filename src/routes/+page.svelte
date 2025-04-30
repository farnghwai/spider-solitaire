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

	import Card from '$lib/components/Card.svelte';
	import CheckmarkButton from '$lib/components/CheckmarkButton.svelte';
	import StarButton from '$lib/components/StarButton.svelte';
	import DrawPile from '$lib/components/DrawPile.svelte';
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
			picked: set1,
			remaining: set2
		};
	}

	const randomSuits = getRandomDifferentColorSuits();

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

	let displayedCards: CardType[] = $state([]);
	let remainingCards: CardType[] = $state([]);
	const topN = 30; //10;
	const noOfStacks = topN / NO_OF_CARD_SLOT;

	onMount(() => {
		// Choose 10 random cards
		const pickResuts = pickCards(cardsData, topN);
		displayedCards = [...pickResuts.picked];
		remainingCards = [...pickResuts.remaining];
		cardStacks.forEach((card, index: number) => {
			for (let i = 0; i < noOfStacks; i++) {
				const cardIndex = index + i * NO_OF_CARD_SLOT;
				const dcard = displayedCards[cardIndex];
				if (i + 1 === noOfStacks) {
					dcard.isDraggable = true;
				}
				card.push(dcard);
			}
			// $inspect('current card', index, card, displayedCards[index]);
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
	// function handleDrawPileClick(event) {
	// 	const drawPile = event.currentTarget;
	// 	drawPile.style.transform = 'scale(0.95)';
	// 	setTimeout(() => {}, 100);
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

		<!-- Draw Pile -->
		<DrawPile handleDrawPileClick />

		<!-- Checkmark Button -->
		<!-- <CheckmarkButton /> -->

		<!-- Star Button -->
		<!-- <StarButton /> -->
	</div>

	<!-- Toolbar -->
	<Toolbar />
</div>
