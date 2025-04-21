<!-- src/lib/components/Card.svelte -->
<script>
	export let card; // Ensure the card object is passed in
</script>

<div
	class="relative h-[100px] w-[70px] cursor-move cursor-pointer rounded-md bg-white shadow-md transition-transform duration-200 ease-in-out {card.suit ===
		'heart' || card.suit === 'diamond'
		? 'text-red-500'
		: 'text-black'}"
	on:click={() => {
		/* Implement your card click logic here */
	}}
	on:dragstart={(e) => e.dataTransfer.setData('text', JSON.stringify(card))}
	on:dragover={(e) => e.preventDefault()}
	on:drop={(e) => {
		e.preventDefault();
		const target = document.querySelector('.card-container');
		target.appendChild(
			e.dataTransfer
				.getData('text')
				.split(',')
				.map((item) => item.trim())
		);
	}}
>
	<!-- Red stripes at top -->
	<div
		class="absolute top-0 left-0 h-[15px] w-full rounded-t-md"
		style="background: repeating-linear-gradient(90deg, #ff9999, #ff9999 3px, white 3px, white 6px);"
	></div>

	<!-- Regular Card Styling -->
	<div class="absolute top-1.5 left-1.5 text-base font-bold">{card.value}</div>
	<div class="absolute top-6 left-1.5 text-xl">
		{#if card.suit === 'heart'}
			♥
		{:else if card.suit === 'spade'}
			♠
		{:else if card.suit === 'diamond'}
			♦
		{:else}
			♣
		{/if}
	</div>
</div>

<style>
	.card-container {
		position: relative;
		width: 100%;
		padding: 20px;
	}

	.card-move {
		opacity: 0.5;
	}
</style>
