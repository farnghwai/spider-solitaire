<!-- src/lib/components/DrawPileButton.svelte -->
<script>
	/**
	 * A button to draw from the pile.
	 */
	export let handleDrawPileClick;
</script>

<div
	class="absolute right-5 bottom-5 flex h-[100px] w-[70px] cursor-pointer items-center justify-center rounded-md bg-white shadow-md transition-transform duration-100 ease-in-out"
	on:click={handleDrawPileClick}
>
	<div class="bg-opacity-10 absolute inset-0 rounded-md bg-red-500"></div>
	<svg class="h-[60px] w-[60px]" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M50,15 C40,15 30,25 20,40 C30,55 40,65 50,65 C60,65 70,55 80,40 C70,25 60,15 50,15 M30,40 C30,35 35,30 40,30 C45,30 50,35 50,40 C50,45 45,50 40,50 C35,50 30,45 30,40 M70,40 C70,45 65,50 60,50 C55,50 50,45 50,40 C50,35 55,30 60,30 C65,30 70,35 70,40 M20,40 C10,55 10,65 30,85 C40,75 50,65 50,65 C50,65 60,75 70,85 C90,65 90,55 80,40 C70,55 60,65 50,65 C40,65 30,55 20,40"
			fill="black"
		/>
	</svg>
</div>
