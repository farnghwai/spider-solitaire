import type { CardType, GameState, CheckIsValidDropMode } from '$lib/types';
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

export function checkIsValidDrop(
	newCardStack: CardType[],
	draggedCards: CardType[],
	checkMode?: CheckIsValidDropMode
) {
	let isValidToDrop = false;
	if (draggedCards.length === 0) {
		return isValidToDrop;
	}

	if (newCardStack.length === 0) {
		isValidToDrop = ['sameSuitOnly', 'emptySlotLast'].includes(checkMode || '') ? false : true;
		return isValidToDrop;
	}

	const newCardStackLastPosition = newCardStack.length - 1;
	const newLastCard = newCardStack[newCardStackLastPosition];

	const dragedfirstCard = draggedCards[0];
	const matchExpectedValue = newLastCard.valueIndex - 1 === dragedfirstCard.valueIndex;
	if (!matchExpectedValue) {
		return isValidToDrop;
	}

	switch (checkMode) {
		case 'sameSuitOnly':
			const matchedSuit = newLastCard.suit === dragedfirstCard.suit;
			if (matchedSuit) {
				isValidToDrop = true;
			}
			break;
		default: {
			isValidToDrop = true;
		}
	}

	return isValidToDrop;
}
