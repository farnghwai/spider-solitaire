<script lang="ts">
	import { onMount } from 'svelte';
	import CardSystem from '$lib/components/CardSystem.svelte';
	import { cardStacks, CardValues, getCartSuitKeys } from '$lib/components/shared.svelte';
	import type { CardType, CartSuitKeyType } from '$lib/components/shared.svelte';

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

	const randomSuits = shuffleArray(getCartSuitKeys()).slice(0, 2) as CartSuitKeyType[];

	const cardsData: CardType[] = [];
	// generate total 6 set of cards based on 2 suits
	for (let i = 0; i < 3; i++) {
		for (const suit of randomSuits) {
			for (const value of CardValues) {
				cardsData.push({ value, suit });
			}
		}
	}

	const emptyCardType: CardType[] = [];
	let displayedCards: CardType[] = $state([...emptyCardType]);
	let remainingCards = $state([...emptyCardType]);
	const topN = 10;

	onMount(() => {
		// Choose 10 random cards
		const pickResuts = pickCards(cardsData, topN);
		displayedCards = [...pickResuts.picked];
		remainingCards = [...pickResuts.remaining];

		cardStacks.forEach((card, index: number) => {
			const dcard = displayedCards[index];
			// const nextIndex = index === displayedCards.length - 1 ? 0 : index + 1;
			// const dcard2 = { ...dcard, value: displayedCards[nextIndex].value };
			// newcardStacks.push([...card, dcard, dcard2]);
			//newcardStacks.push([...card, dcard]);
			card.push(dcard);
			// $inspect('current card', index, card, displayedCards[index]);
		});
	});

	// Timer state
	let timer = '00:23';

	// Function to handle card click
	function handleCardClick(event) {
		const card = event.currentTarget;
		card.style.transform = 'translateY(-10px)';
		setTimeout(() => {
			card.style.transform = 'translateY(0)';
		}, 200);
	}

	// Function to handle draw pile click
	function handleDrawPileClick(event) {
		const drawPile = event.currentTarget;
		drawPile.style.transform = 'scale(0.95)';
		setTimeout(() => {}, 100);
	}

	function handleCardUpdate(newCards) {
		displayedCards = newCards;
	}
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
		<CardSystem onUpdate={handleCardUpdate} onClick={handleCardClick} />

		<!-- Draw Pile -->
		<DrawPile handleDrawPileClick />

		<!-- Checkmark Button -->
		<CheckmarkButton />

		<!-- Star Button -->
		<StarButton />
	</div>

	<!-- Toolbar -->
	<Toolbar />
</div>
