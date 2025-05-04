// Cards data
export const CardColors = {
	red: 'text-red-500',
	black: 'text-black'
} as const;

type CardColorKeyType = keyof typeof CardColors;
export type CardSuitKeyType = 'heart' | 'spade' | 'diamond' | 'club';
type CardSuitRecordType = { icon: string; color: CardColorKeyType };

export const CardSuit: Record<CardSuitKeyType, CardSuitRecordType> = {
	spade: { icon: '♠', color: 'black' },
	heart: { icon: '♥', color: 'red' },
	club: { icon: '♣', color: 'black' },
	diamond: { icon: '♦', color: 'red' }
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
	const colors = Object.keys(colorGroups) as (keyof typeof CardColors)[]; //Explicitly cast to CardColors[]
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

export const CARD_VALUES = [
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

export const NO_OF_CARD_SLOT = 10;

export interface CardType {
	id: number;
	value: (typeof CARD_VALUES)[number];
	suit: CardSuitKeyType;
	valueIndex: number;
	isDraggable: boolean;
	isBeingDragged: boolean;
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
	// onCardClick: () => void;
	onDragStart: (event: DragEvent) => void;
	onDragEnd: () => void;
}

export interface Position {
	x: number;
	y: number;
}

export const cardStacks: CardType[][] = $state(
	Array(NO_OF_CARD_SLOT)
		.fill([])
		.map(() => [])
);

export const winCardStacks: CardType[][] = $state([[]]);
