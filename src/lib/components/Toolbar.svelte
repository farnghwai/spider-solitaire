<!-- src/lib/components/Toolbar.svelte -->
<script lang="ts">
	import SettingsButton from '$lib/components/SettingsButton.svelte';
	import GameNewButton from '$lib/components/GameNewButton.svelte';
	import UndoButton from '$lib/components/UndoButton.svelte';
	import GamePlayGuide from '$lib/components/GamePlayGuide.svelte';
	import { RESPONSIVE_CLASS } from '$lib/constants';

	let { handleConfirm } = $props();
	let showUndoButton = $state(true);
</script>

<div class={['flex items-center justify-center bg-black/30', RESPONSIVE_CLASS.GAP_SIZE]}>
	<!-- Settings Button -->
	<SettingsButton bind:showUndoButton />

	<!-- Game Play Illustration -->
	<GamePlayGuide />

	<!-- Game Button with Red Dot -->
	<GameNewButton {handleConfirm} />

	{#if showUndoButton}
		<!-- Undo Button -->
		<UndoButton />
	{/if}
</div>
