import type { CardType, GameState } from '$lib/types';
import { CARD_VALUES } from '$lib/constants';

export function checkIfIsCompleteSuitStack(currentCardStack: CardType[]) {
	if (currentCardStack.length === 0 || currentCardStack.length < CARD_VALUES.length) {
		return false;
	}

	let isValid = true;
	let currentCardStackLastIndex = currentCardStack.length - 1;
	const lastSuit = currentCardStack[currentCardStackLastIndex].suit;
	for (let i = 0, j = currentCardStackLastIndex; i < CARD_VALUES.length && j >= 0; i++, j--) {
		if (CARD_VALUES[i] !== currentCardStack[j].value || lastSuit !== currentCardStack[j].suit) {
			isValid = false;
			break;
		}
	}

	return isValid;
}

export function checkIfIsWinning(store: GameState) {
	const completedCount = store.cards.completed.length - 1; // exclude empty slot for animation used.

	if (store.totalDeck === completedCount) {
		return true;
	}

	return false;
}

export function checkIsValidDrop(newCardStack: CardType[], draggedCards: CardType[]) {
	let isValidToDrop = false;

	if (newCardStack.length === 0) {
		isValidToDrop = true;
	} else {
		const newCardStackLastPosition = newCardStack.length - 1;
		const newLastCard = newCardStack[newCardStackLastPosition];

		if (draggedCards.length > 0 && newLastCard.valueIndex - 1 === draggedCards[0].valueIndex) {
			isValidToDrop = true;
		}
	}
	return isValidToDrop;
}
