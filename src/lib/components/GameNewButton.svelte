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

<button
	class={[
		'flex cursor-pointer items-center justify-center rounded bg-gray-800 px-4 py-2 hover:bg-gray-700',
		'text-sm @2xl:text-base'
	]}
	onclick={openNewGameDialog}
>
	<svg
		class="mr-1 h-2.5 w-2.5 stroke-current md:mr-1.5 md:h-5 md:w-5"
		viewBox="0 0 24 24"
		fill="none"
		stroke-width="2"
	>
		<rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
		<path d="M3 3 h18 v18 h-18 v-18 M8 12 h8 M12 8 v8"></path>
	</svg>
	New Game / 新游戲
</button>
{#if isDialogOpen}
	<div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

		<div class="fixed inset-0 z-50 w-screen overflow-y-auto">
			<div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
				<div
					class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
				>
					<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
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
							<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 class="text-base font-semibold text-gray-900" id="modal-title">
									Confirmation? / 確定?
								</h3>
								<div class="mt-2">
									<p class="text-sm text-gray-500">
										Start a new Game? Any unsaved progress will be lost. <br />
										開始新遊戲？任何未儲存的進度將會遺失。
									</p>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
						<button
							type="button"
							class="inline-flex w-full cursor-pointer justify-center rounded-md bg-green-600 px-3 py-2 text-base font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
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
	</div>
{/if}
