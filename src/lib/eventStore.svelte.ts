// eventStore.ts
import { NO_OF_CARD_SLOT, updateDraggableStatus } from './components/shared.svelte';
import type { CardType } from './components/shared.svelte';
import type { AppState, Action, ActionMap, ActionType, CardStatus, HanderType } from './types';

// Reactive app state using Svelte 5 `$state`
export const eventStore = $state<AppState>({
	items: [],
	remainingItems: [],
	history: [],
	future: []
});

export const initCardStacks = $state<CardStatus>({
	display: Array(NO_OF_CARD_SLOT)
		.fill([])
		.map(() => []),
	remaining: []
});

export const populateInitCardStacksTo = (cardStatus: CardStatus) => {
	initCardStacks.display.forEach((currentCardStack) => {
		cardStatus.display.push([...currentCardStack]);
	});
	cardStatus.remaining.push(...initCardStacks.remaining);
};

const cloneState = (state: CardType[][]) => {
	const newState: CardType[][] = [];
	state.forEach((s) => {
		newState.push([...s]);
	});
	return newState;
};

// Handlers map with precise payload typing per action type
const handlers: HanderType = {
	drawPile: (state, remaining, action) => {
		const piles = remaining.splice(0, action.payload.remaingCount);
		const newState: CardType[][] = cloneState(state);

		piles.forEach((pcard, index) => {
			const currentStack = newState[index];
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
		return { display: newState, remaining: remaining };
	},

	move: (state, remaining, action) => {
		const newState: CardType[][] = cloneState(state);

		const movedItem = newState[action.payload.oldIndex].slice(action.payload.draggedStackPosition);
		newState[action.payload.oldIndex].splice(action.payload.draggedStackPosition, movedItem.length);
		newState[action.payload.newIndex].push(...movedItem);
		return { display: newState, remaining: remaining };
	}
};

// Rebuild state from action history (event replay)
function rebuildState(): CardStatus {
	let newState: CardStatus = { display: [], remaining: [] };

	populateInitCardStacksTo({ display: newState.display, remaining: newState.remaining });
	for (const action of eventStore.history) {
		newState = handlers[action.type](newState.display, newState.remaining, action as any); // safe due to rebuild from history
	}
	return newState;
}

// Dispatch new action and update state
export function dispatch(action: Action) {
	eventStore.history.push(action);
	eventStore.future.length = 0;
	const newState = rebuildState();
	eventStore.items = newState.display;
	eventStore.remainingItems = newState.remaining;
}

// Undo last action
export function undo() {
	const last = eventStore.history.pop();
	if (last) {
		eventStore.future.push(last);
		const newState = rebuildState();
		eventStore.items = newState.display;
		eventStore.remainingItems = newState.remaining;

		eventStore.items.forEach((currentStack) => {
			updateDraggableStatus(currentStack);
		});
	}
}

// Redo last undone action
export function redo() {
	const next = eventStore.future.pop();
	if (next) {
		eventStore.history.push(next);
		const newState = rebuildState();
		eventStore.items = newState.display;
		eventStore.remainingItems = newState.remaining;
	}
}
