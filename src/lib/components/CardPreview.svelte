<!-- src/lib/components/CardPreview.svelte -->
<script lang="ts">
	import type { CardPreviewProps } from '$lib/types';

	import PokerCard from './PokerCard.svelte';

	const { id, cards, draggedIndex, dragPosition, cardHeight, cardWidth }: CardPreviewProps =
		$props();
</script>

<div
	{id}
	class="pointer-events-none fixed z-[9999] flex -translate-x-1/2 -translate-y-4 items-center"
	style={`left: ${dragPosition.x}px; top: ${dragPosition.y}px`}
>
	<div class="relative flex flex-col">
		{#each cards as card, stackPosition (card.id)}
			<div
				class={[
					'aspect-7/11 h-auto w-full scale-90',
					'-translate-y-[calc(var(--spacing)*var(--stackOffset)*6.2)]',
					'@sm:-translate-y-[calc(var(--spacing)*var(--stackOffset)*8.8)]',
					'@xl:-translate-y-[calc(var(--spacing)*var(--stackOffset)*13.2)]',
					'@3xl:-translate-y-[calc(var(--spacing)*var(--stackOffset)*15.5)]',
					'@5xl:-translate-y-[calc(var(--spacing)*var(--stackOffset)*22.5)]',
					'@7xl:-translate-y-[calc(var(--spacing)*var(--stackOffset)*39.1)]'
				]}
				style={`z-index: 100 - ${stackPosition}; --stackOffset: ${stackPosition};`}
				style:height={`${cardHeight}px`}
				style:width={`${cardWidth}px`}
			>
				<PokerCard
					{card}
					index={draggedIndex}
					{stackPosition}
					hideWhenPreview={false}
					isDragOver={false}
				/>
			</div>
		{/each}
	</div>
</div>
