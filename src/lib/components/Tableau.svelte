<!-- src/components/Tableau.svelte -->
<script>
	export let cards;
</script>

<div class="tableau">
	{#each cards as card}
		<Card {card} />
	{/each}
</div>
