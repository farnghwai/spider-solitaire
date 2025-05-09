<!-- src/lib/components/Toolbar.svelte -->
<script lang="ts">
	import SettingsButton from '$lib/components/SettingsButton.svelte';
	import GameNewButton from '$lib/components/GameNewButton.svelte';
	import UndoButton from '$lib/components/UndoButton.svelte';
	import { RESPONSIVE_CLASS } from '$lib/constants';

	let { handleConfirm } = $props();
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
	<GameNewButton {handleConfirm} />

	<!-- Undo Button -->
	<UndoButton />
</div>
