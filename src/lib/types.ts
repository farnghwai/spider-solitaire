// types.ts

import type { CardType } from './components/shared.svelte';

export type CardStatus = { display: CardType[][]; remaining: CardType[] };

// Step 1: Define allowed action types
export type ActionType = 'drawPile' | 'move';

interface IAction {
	type: ActionType;
}

// Step 2: Define specific action interfaces
export interface DrawPileAction extends IAction {
	type: 'drawPile';
	payload: { remaingCount: number };
}

export interface MoveAction extends IAction {
	type: 'move';
	payload: { oldIndex: number; draggedStackPosition: number; newIndex: number };
}

// Step 3: Union of all action types
export type Action = DrawPileAction | MoveAction;

// Step 4: Extract-specific action by type
export type ActionMap = {
	[K in ActionType]: Extract<Action, { type: K }>;
};

// Step 5: Define application state structure
export interface AppState {
	items: CardType[][];
	remainingItems: CardType[];
	history: Action[];
	future: Action[];
}

export type HanderType = {
	[K in ActionType]: (
		state: CardType[][],
		remaining: CardType[],
		action: ActionMap[K]
	) => CardStatus;
};
