<!-- src/components/ScoreDisplay.svelte -->
<script>
	export let score;
	export let moves;
	export let time;
</script>

<div class="score-display">
	<p class="text-gray-700">Score: {score}</p>
	<p class="text-gray-700">Moves: {moves}</p>
	<p class="text-gray-700">Time: {time} seconds</p>
</div>
