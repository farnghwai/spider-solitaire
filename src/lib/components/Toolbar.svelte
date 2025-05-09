<!-- src/lib/components/Toolbar.svelte -->
<script>
	import SettingsButton from '$lib/components/SettingsButton.svelte';
	import GameAddButton from '$lib/components/GameAddButton.svelte';
	import GameRemoveButton from '$lib/components/GameRemoveButton.svelte';
	import HintButton from '$lib/components/HintButton.svelte';
	import UndoButton from '$lib/components/UndoButton.svelte';
	import { RESPONSIVE_CLASS } from '$lib/constants';
</script>

<div
	class={[
		'flex justify-center bg-black/30',
		RESPONSIVE_CLASS.GAP_SIZE,
		RESPONSIVE_CLASS.PADDING_SIZE
	]}
>
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
