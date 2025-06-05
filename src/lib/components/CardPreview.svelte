<!-- src/lib/components/CardPreview.svelte -->
<script lang="ts">
	import type { CardPreviewProps } from '$lib/types';

	import PokerCard from './PokerCard.svelte';

	const {
		id,
		cards,
		draggedIndex,
		dragPosition,
		containerWidth,
		cardOffsetHeight,
		cardHeight,
		cardWidth
	}: CardPreviewProps = $props();
</script>

<div
	{id}
	class="pointer-events-none fixed z-50 flex items-center"
	style={`left: ${dragPosition.x}px; top: ${dragPosition.y}px`}
>
	<div class="relative flex aspect-7/11 flex-col">
		{#each cards as card, stackPosition (card.id)}
			<div
				class={['absolute', 'h-full w-full', 'top-(--stackOffset)']}
				style={`z-index: 100 - ${stackPosition}; --stackOffset: ${stackPosition * cardOffsetHeight}px;`}
				style:height={`${cardHeight}px`}
				style:width={`${cardWidth}px`}
			>
				<PokerCard
					{card}
					index={draggedIndex}
					{stackPosition}
					{containerWidth}
					hideWhenPreview={false}
					isDragOver={false}
					isLastStackPosition={false}
				/>
			</div>
		{/each}
	</div>
</div>
