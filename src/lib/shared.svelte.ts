// Cards data

import type { CardType, CardSuitKeyType, CardSuitRecordType, CardColorKeyType } from './types';
import { CARD_COLORS, NO_OF_CARD_SLOT, CARD_VALUES } from '$lib/constants';
import {
	initCardStacks,
	eventStore,
	resetInitCardStacksAndEventStore,
	populateInitCardStacksTo
} from '$lib/eventStore.svelte';

export const CardSuit: Record<CardSuitKeyType, CardSuitRecordType> = {
	spade: { icon: '♠', color: 'BLACK' },
	heart: { icon: '♥', color: 'RED' },
	club: { icon: '♣', color: 'BLACK' },
	diamond: { icon: '♦', color: 'RED' }
} as const;

const groupSuitsByColor = () => {
	const colorGroups = {} as Record<CardColorKeyType, CardSuitKeyType[]>;

	for (const [suitKey, suit] of Object.entries(CardSuit) as [
		CardSuitKeyType,
		CardSuitRecordType
	][]) {
		const color = suit.color;

		if (!colorGroups[color]) {
			colorGroups[color] = [];
		}

		colorGroups[color].push(suitKey);
	}

	return colorGroups;
};

export const getRandomDifferentColorSuits = () => {
	const colorGroups = groupSuitsByColor();
	const colors = Object.keys(colorGroups) as (keyof typeof CARD_COLORS)[]; //Explicitly cast to CardColors[]
	if (colors.length < 2) {
		return []; // Not enough suits with different colors
	}

	const color1 = colors[Math.floor(Math.random() * colors.length)];
	const possibleColor2 = color1 === colors[0] ? colors[1] : colors[0];

	const suitKeys1 = colorGroups[color1];
	const suitKeys2 = colorGroups[possibleColor2];

	const suitKey1 = suitKeys1[Math.floor(Math.random() * suitKeys1.length)];
	const suitKey2 = suitKeys2[Math.floor(Math.random() * suitKeys2.length)];

	return [suitKey1, suitKey2];
};

// multiple of 10 (NO_OF_SLOT
export const GameSettings = {
	difficultyMode: {
		simple: { totalDeck: 6, noOfDrawRound: 5 }
	}
};

export const updateDraggableStatus = (currentStack: CardType[]) => {
	if (currentStack.length > 0) {
		const currentStackLastIndex = currentStack.length - 1;
		let currentStackLastCard = currentStack[currentStackLastIndex];
		currentStackLastCard.isDraggable = true;
		let isCardInOrder = true;
		for (let i = currentStackLastIndex - 1; i >= 0; i--) {
			const currentStackCard = currentStack[i];
			if (currentStackCard.isOpen) {
				if (isCardInOrder) {
					if (currentStackCard.valueIndex - 1 === currentStackLastCard.valueIndex) {
						if (!currentStackCard.isDraggable) {
							currentStackCard.isDraggable = true;
						}
					} else {
						isCardInOrder = false;
						if (currentStackCard.isDraggable) {
							currentStackCard.isDraggable = false;
						}
					}
				} else {
					currentStackCard.isDraggable = false;
				}
			}
			currentStackLastCard = { ...currentStackCard };
		}
	}
};

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
					isBeingDragged: false,
					isOpen: false
				});
				counter++;
			});
		}
	}
	return cardsData;
}

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

export function initNewGameSession() {
	resetInitCardStacksAndEventStore();

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
		currentStackLastCard.isOpen = true;
	});
	initCardStacks.remaining.push(...pickResuts.remaining);
	populateInitCardStacksTo(eventStore.cards);
	eventStore.totalDeck = totalDecks;
}

// Calculate current font size based on container width
export const calculateFontSize = (width: number) => {
	// Base font size is 10px at 300px width
	// Max font size is 16px at 1000px width or larger
	const minWidth = 320; // min-w-xs, min width size
	const maxWidth = 1280; // max-w-7xl, max width size
	const minFontSize = 10;
	const maxFontSize = 36;

	if (width <= minWidth) return minFontSize;
	if (width >= maxWidth) return maxFontSize;

	// Linear scaling between min and max
	const scale = (width - minWidth) / (maxWidth - minWidth);
	return minFontSize + scale * (maxFontSize - minFontSize);
};
