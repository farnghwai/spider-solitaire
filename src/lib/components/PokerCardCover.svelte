<!-- src/lib/components/PokerCardCover.svelte -->
<script lang="ts">
	import type { PokerCardCoverProps } from '$lib/types';

	const { cardBalance = 0, class: className }: PokerCardCoverProps = $props();
</script>

<div
	class={[
		'flex aspect-7/13 w-full min-w-6 items-center justify-center bg-white shadow-md',
		'rounded-sm @xl:rounded-md ',
		'p-0.5 @2xl:p-1',
		className
	]}
>
	<div
		class={[
			'flex h-full w-full flex-col items-center justify-center',
			'bg-gradient-to-br from-red-500 to-red-700',
			'rounded-xs @xl:rounded-md',
			'px-0 pt-2 pb-1 @2xl:pt-4 @2xl:pb-2'
		]}
	>
		<svg viewBox="10 15 80 70" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M50,15 C40,15 30,25 20,40 C30,55 40,65 50,65 C60,65 70,55 80,40 C70,25 60,15 50,15 M30,40 C30,35 35,30 40,30 C45,30 50,35 50,40 C50,45 45,50 40,50 C35,50 30,45 30,40 M70,40 C70,45 65,50 60,50 C55,50 50,45 50,40 C50,35 55,30 60,30 C65,30 70,35 70,40 M20,40 C10,55 10,65 30,85 C40,75 50,65 50,65 C50,65 60,75 70,85 C90,65 90,55 80,40 C70,55 60,65 50,65 C40,65 30,55 20,40"
				fill="black"
			/>
		</svg>
		{#if cardBalance > 0}
			<span class={['text-xs transition-all @2xl:text-sm @5xl:text-base', 'text-white']}
				>{cardBalance}</span
			>
		{/if}
	</div>
</div>
