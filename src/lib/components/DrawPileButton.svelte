<!-- src/lib/components/DrawPileButton.svelte -->
<script lang="ts">
	interface DrawPileProps {
		onClick: (event: MouseEvent) => void;
		remaingCount: number;
	}
	let { onClick, remaingCount }: DrawPileProps = $props();
</script>

<button
	aria-label="Draw Pile"
	class="absolute right-5 bottom-5 flex h-40 w-24 scale-90 cursor-pointer items-center justify-center rounded-md bg-white p-1 shadow-md transition-transform duration-100 ease-in-out hover:scale-100"
	onclick={onClick}
>
	<div class="flex h-full w-full flex-col items-center justify-center rounded-lg bg-red-500">
		<svg class="h-28 w-16" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M50,15 C40,15 30,25 20,40 C30,55 40,65 50,65 C60,65 70,55 80,40 C70,25 60,15 50,15 M30,40 C30,35 35,30 40,30 C45,30 50,35 50,40 C50,45 45,50 40,50 C35,50 30,45 30,40 M70,40 C70,45 65,50 60,50 C55,50 50,45 50,40 C50,35 55,30 60,30 C65,30 70,35 70,40 M20,40 C10,55 10,65 30,85 C40,75 50,65 50,65 C50,65 60,75 70,85 C90,65 90,55 80,40 C70,55 60,65 50,65 C40,65 30,55 20,40"
				fill="black"
			/>
		</svg>
		<span>{remaingCount}</span>
	</div>
</button>
