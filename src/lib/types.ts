// types.ts

import type { ClassValue } from 'svelte/elements';
import type { CARD_COLORS, CARD_VALUES } from './constants';

export interface CardType {
	id: number;
	value: (typeof CARD_VALUES)[number];
	suit: CardSuitKeyType;
	valueIndex: number;
	isDraggable: boolean;
	isBeingDragged: boolean;
	isOpen: boolean;
}

export type CardColorKeyType = keyof typeof CARD_COLORS;
export type CardSuitKeyType = 'heart' | 'spade' | 'diamond' | 'club';
export type CardSuitRecordType = { icon: string; color: CardColorKeyType };

export type CardStatus = { display: CardType[][]; remaining: CardType[]; completed: CardType[][] };

// Step 1: Define allowed action types
export type ActionType = 'drawPile' | 'move' | 'deckCompleted' | 'win';

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

export interface WinAction extends IAction {
	type: 'win';
	payload: null;
}

// Step 3: Union of all action types
export type Action = DrawPileAction | MoveAction | DeckCompletedAction | WinAction;

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
	hasWin: boolean;
}

export type HanderType = {
	[K in ActionType]: (state: CardStatus, action: ActionMap[K]) => CardStatus;
};

export interface Position {
	x: number;
	y: number;
}

export interface CardSystemProps {
	cardSystemWidth: number;
}

export interface CardProps {
	card: CardType;
	index: number;
	isDragOver: boolean;
	stackPosition: number;
	// onCardClick: () => void;
	onDragStart: (event: DragEvent) => void;
	onDragEnd: () => void;
}

export interface PokerCardProps {
	card: CardType;
	index: number;
	stackPosition: number;
	containerWidth: number;
	hideWhenPreview: boolean;
	isDragOver: boolean;
	isLastStackPosition: boolean;
	onDragStart?: (event: DragEvent, card: CardType, index: number, stackPosition: number) => void;
	onDragEnd?: () => void;
	onTouchStart?: (event: TouchEvent, card: CardType, index: number, stackPosition: number) => void;
	class?: ClassValue;
}

export interface PokerCardCoverProps {
	cardBalance?: number;
	class?: ClassValue;
}

export interface CardPreviewProps {
	id: string;
	cards: CardType[];
	draggedIndex: number;
	dragPosition: Position;
	containerWidth: number;
	cardOffsetHeight: number;
	cardHeight: number;
	cardWidth: number;
}
