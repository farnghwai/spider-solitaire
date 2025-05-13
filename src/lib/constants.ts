export const RESPONSIVE_CLASS = {
	CARD_SIZE:
		'h-11 w-7 @sm:h-16.5 @sm:w-9.5 @xl:h-22 @xl:w-14 @3xl:h-24.75 @3xl:w-15.75 @5xl:h-33 @5xl:w-21 @7xl:h-44 @7xl:w-32',
	DRAW_PILE_CARD_COL_SIZE: 'w-7 @xl:w-9.5 @2xl:w-14 @3xl:w-15.75 @5xl:w-21 @7xl:w-32',
	COMPLETED_CARD_SIZE:
		'h-11 w-7 @xl:h-16.5 @xl:w-9.5 @3xl:h-22 @3xl:w-14 @5xl:h-24.75 @5xl:w-15.75 @7xl:h-33 @7xl:w-21',
	GAP_SIZE: 'gap-0.5 @xl:gap-1 @3xl:gap-1.5 @5xl:gap-2',
	// PADDING_SIZE: 'p-0.5 @xl:p-1 @3xl:p-1.5 @5xl:p-2'
	PADDING_SIZE: 'p-0.5 @2xl:p-1 @7x:p-2'
} as const;

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

export const CARD_COLORS = {
	RED: 'text-red-500',
	BLACK: 'text-black'
} as const;
