// types.ts

import type { CardType } from './components/shared.svelte';

export type CardStatus = { display: CardType[][]; remaining: CardType[]; completed: CardType[][] };

// Step 1: Define allowed action types
export type ActionType = 'drawPile' | 'move' | 'deckCompleted';

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

export interface DeckCompletedAction extends IAction {
	type: 'deckCompleted';
	payload: { dragOverIndex: number };
}

// Step 3: Union of all action types
export type Action = DrawPileAction | MoveAction | DeckCompletedAction;

// Step 4: Extract-specific action by type
export type ActionMap = {
	[K in ActionType]: Extract<Action, { type: K }>;
};

// Step 5: Define application state structure
export interface GameState {
	cards: CardStatus;
	history: Action[];
	future: Action[];
	totalDeck: number;
}

export type HanderType = {
	[K in ActionType]: (state: CardStatus, action: ActionMap[K]) => CardStatus;
};
