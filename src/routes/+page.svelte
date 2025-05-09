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
	import { RESPONSIVE_CLASS } from '$lib/constants';

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
</script>

<div class="@container flex min-h-screen min-w-xs flex-col bg-green-800 text-white">
	<div class="hidden noscript:block">Please enable JavaScript to use this app.</div>

	<!-- Timer -->
	<!-- <div class="absolute top-2.5 left-2.5 text-sm">{timer}</div> -->
	<div
		class={[
			'flex flex-1 flex-col @2xl:flex-row',
			RESPONSIVE_CLASS.GAP_SIZE,
			'p-0.5 @2xl:p-1 @5xl:p-2 @7xl:p-4'
		]}
	>
		<!-- CardSystem -->
		<CardSystem />

		<div
			class={[
				'flex justify-between',
				'm-2 @2xl:m-0',
				'flex-row @2xl:flex-col',
				'order-first @2xl:order-last',
				RESPONSIVE_CLASS.PADDING_SIZE
			]}
		>
			<!-- CompletedDeck Pile -->
			<CompletedDeck />

			<!-- Draw Pile -->
			<DrawPileButton />
		</div>
	</div>

	<!-- Toolbar -->
	<Toolbar />

	<WinningOverlay />
</div>
