<!-- src/lib/components/Toolbar.svelte -->
<script>
	import SettingsButton from '$lib/components/SettingsButton.svelte';
	import GameAddButton from '$lib/components/GameAddButton.svelte';
	import GameRemoveButton from '$lib/components/GameRemoveButton.svelte';
	import HintButton from '$lib/components/HintButton.svelte';
	import UndoButton from '$lib/components/UndoButton.svelte';
</script>

<div class="flex justify-center gap-1 bg-black/30 p-1 md:gap-4 md:p-2.5">
	<!-- Settings Button -->
	<SettingsButton />

	<!-- Game Button with Red Dot -->
	<GameAddButton />

	<!-- Game Remove Button -->
	<GameRemoveButton />

	<!-- Hint Button -->
	<HintButton />

	<!-- Undo Button -->
	<UndoButton />
</div>
