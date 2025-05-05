<!-- src/lib/components/UndoButton.svelte -->
<script lang="ts">
	import { undo } from '$lib/eventStore.svelte';

	function handleUndo() {
		undo();
	}
</script>

<button
	class="flex cursor-pointer items-center justify-center rounded bg-gray-800 px-4 py-2 hover:bg-gray-700"
	onclick={handleUndo}
>
	<svg class="mr-1.5 h-5 w-5 stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2">
		<path d="M9 14 l-5 -5 l5 -5 M20 20 v-7 a4 4 0 0 0 -4 -4 H4"></path>
	</svg>
	Undo
</button>
