<!-- src/lib/components/PokerCard.svelte -->
<script lang="ts">
	import { CardSuit, calculateFontSize } from '../shared.svelte';
	import type { PokerCardProps } from '$lib/types';
	import { CARD_COLORS } from '$lib/constants';
	import PokerCardCover from './PokerCardCover.svelte';

	const {
		card,
		index,
		stackPosition,
		containerWidth,
		hideWhenPreview,
		isDragOver,
		onDragStart,
		onDragEnd,
		onTouchStart,
		class: className
	}: PokerCardProps = $props();
	const suitSymbol = CardSuit[card.suit].icon;

	const fontSize = $derived.by(() => calculateFontSize(containerWidth));
</script>

<div
	role="listitem"
	aria-grabbed={card.isBeingDragged ? true : false}
	class={[
		'flex aspect-7/13 w-full min-w-6 flex-col border border-gray-200 shadow-sm select-none',
		'rounded-md @xl:rounded-lg',
		isDragOver ? 'bg-amber-100' : 'bg-white',
		CARD_COLORS[CardSuit[card.suit].color],
		card.isDraggable && 'cursor-grab hover:-translate-y-1 hover:shadow-md',
		hideWhenPreview && card.isBeingDragged && 'opacity-0',
		'transition-all duration-300',
		!card.isOpen && 'rotate-y-180',
		className
	]}
	draggable={card.isDraggable}
	ondragstart={(event: DragEvent) => onDragStart?.(event, card, index, stackPosition)}
	ondragend={(event: DragEvent) => onDragEnd?.()}
	ontouchstart={(event: TouchEvent) => onTouchStart?.(event, card, index, stackPosition)}
>
	{#if card.isOpen}
		<div
			class={[
				'w-full',
				'rounded-t-md',
				'h-0.5 @3xl:h-1',
				card.isDraggable && 'border-t-2 border-t-teal-400'
			]}
			style="background: repeating-linear-gradient(90deg, #ff9999, #ff9999 3px, white 3px, white 6px);"
		></div>

		<div class="flex items-center justify-between px-0.5 font-bold @3xl:px-1">
			<div class="text-(length:--sp-text-size)" style={`--sp-text-size: ${fontSize}px`}>
				{card.value}
			</div>
			<div class="text-(length:--sp-text-size)" style={`--sp-text-size: ${fontSize * 0.8}px`}>
				{suitSymbol}
			</div>
		</div>
		{#if card.value === '2' || card.value === '3'}
			<div
				class={[
					'flex flex-1 flex-col items-center justify-between pb-1',
					'px-0.5 @3xl:px-1.5',
					'text-(length:--sp-text-size) leading-none'
				]}
				style={`--sp-text-size: ${fontSize * 0.75}px`}
			>
				<div>{suitSymbol}</div>
				{#if card.value === '3'}
					<div>{suitSymbol}</div>
				{/if}
				<div class="rotate-x-180">{suitSymbol}</div>
			</div>
		{:else if ['4', '5', '6', '7', '8', '9', '10'].includes(card.value)}
			<div
				class={[
					'items-between relative flex flex-1 flex-col justify-between pb-1',
					'px-0.5 @3xl:px-1.5',
					'text-(length:--sp-text-size) leading-none'
				]}
				style={`--sp-text-size: ${fontSize * 0.75}px`}
			>
				<div class={['flex justify-between']}>
					<div>{suitSymbol}</div>
					<div>{suitSymbol}</div>
				</div>
				{#if card.value === '5'}
					<div class={['flex justify-center']}>
						<div>{suitSymbol}</div>
					</div>
				{:else if ['6', '7', '8', '9', '10'].includes(card.value)}
					<div class={['flex justify-between']}>
						<div>{suitSymbol}</div>
						<div>{suitSymbol}</div>
					</div>
				{/if}
				<div class={['flex rotate-x-180 justify-between']}>
					<div>{suitSymbol}</div>
					<div>{suitSymbol}</div>
				</div>
				{#if ['9', '10'].includes(card.value)}
					<div class={['flex rotate-x-180 justify-between']}>
						<div>{suitSymbol}</div>
						<div>{suitSymbol}</div>
					</div>
				{/if}
				{#if ['7', '8', '9', '10'].includes(card.value)}
					<div class="absolute top-0 left-0 h-1/2 w-full">
						<div class={['flex h-full items-center justify-center']}>
							<div>{suitSymbol}</div>
						</div>
					</div>
					{#if ['8', '10'].includes(card.value)}
						<div class="absolute bottom-0 left-0 h-1/2 w-full">
							<div class={['flex h-full rotate-x-180 items-center justify-center']}>
								<div>{suitSymbol}</div>
							</div>
						</div>
					{/if}
				{/if}
			</div>
		{:else}
			<div
				class={[
					'flex flex-1 items-center justify-center',
					'text-(length:--sp-text-size) leading-none'
				]}
				style={`--sp-text-size: ${fontSize * 2.5}px`}
			>
				{suitSymbol}
			</div>
		{/if}
		<div
			class={['w-full', 'rounded-b-md', 'h-0.5 @3xl:h-1']}
			style="background: repeating-linear-gradient(90deg, #ff9999, #ff9999 3px, white 3px, white 6px);"
		></div>
	{:else}
		<PokerCardCover class={'rotate-y-180'} />
	{/if}
</div>
