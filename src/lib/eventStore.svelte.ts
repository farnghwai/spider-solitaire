// eventStore.ts
import { updateDraggableStatus } from './shared.svelte';
import { NO_OF_CARD_SLOT, CARD_VALUES } from '$lib/constants';
import type { GameState, Action, CardStatus, HanderType, CardType } from './types';

export const initCardStacks = $state<CardStatus>({
	display: Array(NO_OF_CARD_SLOT)
		.fill([])
		.map(() => []),
	remaining: [],
	completed: [[]]
});

// Reactive app state using Svelte 5 `$state`
export const eventStore = $state<GameState>({
	cards: { display: [], remaining: [], completed: [] },
	history: [],
	future: [],
	totalDeck: 0,
	hasWin: false
});

export const resetInitCardStacksAndEventStore = () => {
	initCardStacks.display.forEach((card) => {
		card.length = 0;
	});
	initCardStacks.remaining.length = 0;
	initCardStacks.completed.length = 0;
	initCardStacks.completed.push([]);

	eventStore.cards.display.length = 0;
	eventStore.cards.remaining.length = 0;
	eventStore.cards.completed.length = 0;

	eventStore.history.length = 0;
	eventStore.future.length = 0;
	eventStore.totalDeck = 0;
	eventStore.hasWin = false;
};

export const populateInitCardStacksTo = (cardStatus: CardStatus) => {
	initCardStacks.display.forEach((currentCardStack) => {
		const newCardStack: CardType[] = [];
		currentCardStack.forEach((card) => {
			newCardStack.push({ ...card });
		});
		cardStatus.display.push(newCardStack);
	});

	const newRemainingCardStack: CardType[] = [];
	initCardStacks.remaining.forEach((card) => {
		newRemainingCardStack.push({ ...card });
	});
	cardStatus.remaining.push(...newRemainingCardStack);

	initCardStacks.completed.forEach((currentCardStack) => {
		const newCompletedCardStack: CardType[] = [];
		currentCardStack.forEach((card) => {
			newCompletedCardStack.push({ ...card });
		});
		cardStatus.completed.push(newCompletedCardStack);
	});
};

const cloneCardTypeState = (state: CardType[][]) => {
	const newState: CardType[][] = [];
	state.forEach((s) => {
		newState.push([...s]);
	});
	return newState;
};

// Handlers map with precise payload typing per action type
const handlers: HanderType = {
	drawPile: (state, action) => {
		const piles = state.remaining.splice(0, action.payload.remaingCount);
		const newDisplayState: CardType[][] = cloneCardTypeState(state.display);

		piles.forEach((pcard, index) => {
			pcard.isDraggable = true;
			pcard.isOpen = true;

			const currentStack = newDisplayState[index];
			currentStack.push(pcard);
		});
		return { ...state, display: newDisplayState };
	},

	move: (state, action) => {
		const newDisplayState: CardType[][] = cloneCardTypeState(state.display);

		const oldStack = newDisplayState[action.payload.oldIndex];

		const movedItem = oldStack.slice(action.payload.draggedStackPosition);
		oldStack.splice(action.payload.draggedStackPosition, movedItem.length);

		if (oldStack.length > 0) {
			const lastCard = oldStack[oldStack.length - 1];
			if (!lastCard.isOpen) {
				lastCard.isOpen = true;
			}
		}
		newDisplayState[action.payload.newIndex].push(...movedItem);

		return { ...state, display: newDisplayState };
	},

	deckCompleted: (state, action) => {
		const newDisplayState: CardType[][] = cloneCardTypeState(state.display);
		const newCompletdState: CardType[][] = cloneCardTypeState(state.completed);

		const dragOverCardStack = newDisplayState[action.payload.dragOverIndex];
		const cardValueCount = CARD_VALUES.length;
		const currentCompletedCardDeck = dragOverCardStack.splice(
			dragOverCardStack.length - cardValueCount,
			cardValueCount
		);

		let completedCardDeckLasIndex = newCompletdState.length - 1;

		// initialize if empty. Append one empty array for animaation.
		if (completedCardDeckLasIndex < 0) {
			completedCardDeckLasIndex = 0;
			newCompletdState.push([]);
		}

		currentCompletedCardDeck.forEach((card) => {
			card.isBeingDragged = false;
			card.isDraggable = false;
		});
		newCompletdState[completedCardDeckLasIndex].push(...currentCompletedCardDeck);
		newCompletdState.push([]);

		return { ...state, display: newDisplayState, completed: newCompletdState };
	},

	win: (state, action) => {
		eventStore.hasWin = true;
		return { ...state };
	}
};

// Rebuild state from action history (event replay)
function rebuildState(): CardStatus {
	let newState: CardStatus = { display: [], remaining: [], completed: [] };

	populateInitCardStacksTo(newState);

	for (const action of eventStore.history) {
		newState = handlers[action.type](newState, action as any); // safe due to rebuild from history
	}

	newState.display.forEach((currentCardStack) => {
		updateDraggableStatus(currentCardStack);
	});

	return newState;
}

// Dispatch new action and update state
export function dispatch(action: Action) {
	eventStore.history.push(action);
	eventStore.future.length = 0;
	eventStore.cards = rebuildState();
}

// Undo last action
export function undo() {
	const last = eventStore.history.pop();
	if (last) {
		eventStore.future.push(last);

		if (last.type === 'deckCompleted') {
			// reverse to previous move state
			const last2 = eventStore.history.pop();
			if (last2) {
				eventStore.future.push(last2);
			}
		}

		eventStore.cards = rebuildState();
	}
}

// Redo last undone action
export function redo() {
	const next = eventStore.future.pop();
	if (next) {
		eventStore.history.push(next);
		eventStore.cards = rebuildState();
	}
}
