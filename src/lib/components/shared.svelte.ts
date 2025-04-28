// Cards data
export const CartSuit = {
	heart: '♥',
	spade: '♠',
	diamond: '♦',
	club: '♣'
} as const;

export type CartSuitType = typeof CartSuit;
export type CartSuitKeyType = keyof typeof CartSuit;

export const getCartSuitKeys = (): string[] => {
	return Object.keys(CartSuit);
};

export const CardValues = [
	'A',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'J',
	'Q',
	'K'
] as const;

export interface CardType {
	value: (typeof CardValues)[number];
	suit: CartSuitKeyType;
}

export interface CardSystemProps {
	//displayedCards: CardType[]; // Adjust the type as needed
	onUpdate: (newState: any) => void; // Adjust the type as needed
	onClick: (cardId: string) => void; // Adjust the type as needed
}

export interface CardProps {
	card: CardType;
	index: number;
	isDragOver: boolean;
	stackPosition: number;
	onCardClick: () => void;
	onDragStart: () => void;
	onDragEnd: () => void;
}

export const cardStacks: CardType[][] = $state(
	Array(10)
		.fill([])
		.map(() => [])
);
