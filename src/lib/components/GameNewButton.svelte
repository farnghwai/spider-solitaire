<!-- src/lib/components/GameAddButton.svelte -->
<script lang="ts">
	let { handleConfirm } = $props();

	// State to track if dialog is open
	let isDialogOpen = $state(false);

	function openNewGameDialog() {
		isDialogOpen = true;
	}

	// Event handlers
	function handleConfirmNewGame() {
		handleConfirm().then(() => {
			closeDialog();
		});
	}

	function handleCancel() {
		closeDialog();
	}

	function closeDialog() {
		isDialogOpen = false;
	}
</script>

<div>
	<button
		class={[
			'flex cursor-pointer items-center justify-center rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700',
			'text-sm md:text-base',
			'gap-1 md:gap-0'
		]}
		onclick={openNewGameDialog}
	>
		<svg
			class="mr-1 h-5 w-5 stroke-current md:mr-1.5"
			viewBox="0 0 24 24"
			fill="none"
			stroke-width="2"
		>
			<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
			<path d="M3 3 h18 v18 h-18 v-18 M8 12 h8 M12 8 v8"></path>
		</svg>
		<div class="flex flex-col md:flex-row md:gap-2">
			<div>New Game</div>
			<div>新游戲</div>
		</div>
	</button>
	{#if isDialogOpen}
		<div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
			<div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
			<div class="fixed inset-0 z-50 flex w-screen items-center justify-center overflow-y-auto">
				<div class="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-xl font-bold">Confirmation? / 確定?</h2>
						<button
							type="button"
							class="cursor-pointer text-gray-500 hover:text-gray-700"
							onclick={closeDialog}
							aria-label="Close"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
					<div class="mb-4 px-4 pb-4">
						<div class="flex gap-2">
							<div
								class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10"
							>
								<svg
									class="size-6 text-green-600"
									viewBox="0 0 24 24"
									fill="none"
									stroke-width="1.5"
									stroke="currentColor"
									aria-hidden="true"
									data-slot="icon"
								>
									<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
									<path d="M3 3 h18 v18 h-18 v-18 M8 12 h8 M12 8 v8"></path>
								</svg>
							</div>
							<p class="text-left">
								Start a new Game? Any unsaved progress will be lost. <br />
								開始新遊戲？任何未儲存的進度將會遺失。
							</p>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button
							type="button"
							class="inline-flex w-full cursor-pointer justify-center rounded-md bg-green-700 px-3 py-2 text-base font-semibold text-white shadow-xs hover:bg-green-600 sm:ml-3 sm:w-auto"
							onclick={handleConfirmNewGame}>Start New Game / 開始新遊戲</button
						>
						<button
							type="button"
							class="mt-3 inline-flex w-full cursor-pointer justify-center rounded-md bg-white px-3 py-2 text-base font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
							onclick={handleCancel}>Cancel / 取消</button
						>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
