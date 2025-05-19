<script lang="ts">
	import { base } from '$app/paths';

	import { onMount, tick } from 'svelte';
	import { initNewGameSession } from '$lib/shared.svelte';
	import { initCardStacks } from '$lib/eventStore.svelte';

	import CardSystem from '$lib/components/CardSystem.svelte';
	import CompletedDeck from '$lib/components/CompletedDeck.svelte';
	import DrawPileButton from '$lib/components/DrawPileButton.svelte';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import WinningOverlay from '$lib/components/WinningOverlay.svelte';

	let isLoading = $state(false);
	let cardSystemWidth = $state(0);

	function initCards() {
		// no action if cardStacks already have card
		if (!initCardStacks.display.every((cardSlot) => cardSlot.length === 0)) {
			return;
		}

		initNewGameSession();
	}

	function handleConfirm() {
		isLoading = true;
		initNewGameSession();

		return tick().then(() => {
			isLoading = false;
		});
	}

	onMount(() => {
		initCards();
	});
	const title = 'Spider Solitaire';
</script>

<svelte:head>
	<title>{`${title} - A Simple & Classic Card Game`}</title>
	<link rel="manifest" href="{base}/manifest.webmanifest" />
	<meta
		name="description"
		content="Experience the classic Spider Solitaire card game with a simple design. Play for free online as a demo application—perfect for casual gamers seeking a relaxing, single-player mind challenge."
	/>
	<meta
		name="keywords"
		content="free spider solitaire, online card game, simple solitaire demo, relaxing game, single-player challenge, demo application, browser-based solitaire, classic card game"
	/>
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-title" content={title} />
</svelte:head>

<div class="@container flex min-h-dvh min-w-xs flex-col overflow-y-hidden">
	<div class="hidden items-center justify-center text-white noscript:flex noscript:flex-1">
		Please enable JavaScript to use this app.
	</div>

	{#if !isLoading}
		<div
			class={[
				'flex flex-1 flex-col @2xl:flex-row',
				'p-0.5 @2xl:p-2 @7xl:p-4',
				'mx-auto w-full max-w-7xl gap-4 @5xl:gap-12 @7xl:gap-16'
			]}
		>
			<!-- CardSystem -->
			<CardSystem bind:cardSystemWidth />

			<div
				class={[
					'flex items-center justify-between',
					'flex-row @2xl:flex-col',
					'order-first @2xl:order-last',
					'p-1'
				]}
			>
				<!-- CompletedDeck Pile -->
				<CompletedDeck {cardSystemWidth} />

				<!-- Draw Pile -->
				<DrawPileButton {cardSystemWidth} />
			</div>
		</div>
	{/if}
	<!-- Toolbar -->
	<Toolbar {handleConfirm} />

	<WinningOverlay {handleConfirm} />
</div>
