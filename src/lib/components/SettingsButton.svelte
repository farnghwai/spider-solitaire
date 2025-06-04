<!-- src/lib/components/SettingsButton.svelte -->
<script lang="ts">
	import { version as APP_VERSION } from '$app/environment';
	import { PUBLIC_GITHUB_REPO_URL as GITHUB_REPO } from '$env/static/public';

	let showSettings = $state(false);

	let { showUndoButton = $bindable() } = $props();

	/**
	 * Opens the settings dialog.
	 */
	function openShowSettingsDialog() {
		showSettings = true;
	}

	/**
	 * Closes the settings dialog.
	 */
	function closeDialog() {
		showSettings = false;
	}

	/**
	 * Toggles the visibility of the undo button.
	 */
	function handleShowUndoButton() {
		showUndoButton = !showUndoButton;
	}
</script>

<div>
	<button
		class={[
			'flex cursor-pointer items-center justify-center rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 ',
			'text-sm md:text-lg xl:text-2xl',
			'gap-1 md:gap-0'
		]}
		onclick={openShowSettingsDialog}
	>
		<div>
			<svg
				class="mr-1 h-5 w-5 stroke-current md:mr-1.5"
				viewBox="0 0 24 24"
				fill="none"
				stroke-width="2"
			>
				<circle cx="12" cy="12" r="3"></circle>
				<path
					d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
				></path>
			</svg>
		</div>
		<div class="flex flex-col md:flex-row md:gap-2">
			<div>Settings</div>
			<div>設定</div>
		</div>
	</button>
	{#if showSettings}
		<div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
			<div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
			<div class="fixed inset-0 z-50 flex w-screen items-center justify-center overflow-y-auto">
				<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-xl font-bold">Settings</h2>
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
					<div class="mb-4">
						<label class="flex cursor-pointer items-center">
							<div class="relative">
								<input
									type="checkbox"
									class="sr-only"
									checked={showUndoButton}
									onchange={() => handleShowUndoButton()}
								/>
								<div
									class={`h-6 w-10 rounded-full transition ${showUndoButton ? 'bg-green-600' : 'bg-gray-300'}`}
								></div>
								<div
									class={`absolute top-1 left-1 h-4 w-4 transform rounded-full bg-white transition ${showUndoButton ? 'translate-x-4' : ''}`}
								></div>
							</div>
							<span class="ml-3 text-gray-700">Show "Undo / 回退" Button</span>
						</label>
					</div>

					<hr class="my-4" />

					<div class="mb-4">
						<h3 class="mb-2 text-lg font-semibold">About</h3>
						<p class="mb-2 text-sm text-gray-600">
							Version: {APP_VERSION}
						</p>
					</div>

					<div
						class="max-h-48 overflow-y-auto rounded border border-gray-200 p-2 text-xs text-gray-500"
						aria-label="Application Disclaimer"
					>
						<div class="mb-2">
							<strong>Disclaimer:</strong> This is a demonstration application provided free for use.
							All data from your interaction with this application is stored locally in your browser.
							While this application itself does not collect personal information, please note that GitHub
							Pages, which hosts this application, may collect certain data such as IP addresses and
							usage metrics as part of their standard operations.
						</div>

						<div class="mb-2">
							<strong>NO WARRANTY:</strong> This software is provided "as is" without warranties of any
							kind, either expressed or implied, including but not limited to warranties of merchantability,
							fitness for a particular purpose, or non-infringement.
						</div>

						<div class="mb-2">
							<strong>LIMITATION OF LIABILITY:</strong> In no event shall the copyright holders or contributors
							be liable for any direct, indirect, incidental, special, exemplary, or consequential damages
							(including, but not limited to, procurement of substitute goods or services; loss of use,
							data, or profits; or business interruption) however caused and on any theory of liability,
							whether in contract, strict liability, or tort (including negligence or otherwise) arising
							in any way out of the use of this software, even if advised of the possibility of such
							damage.
						</div>

						<div class="mt-3 border-t border-gray-200 pt-2">
							<a
								href={GITHUB_REPO}
								target="_blank"
								rel="noopener noreferrer"
								class="flex items-center text-blue-500 underline hover:text-blue-700"
							>
								<svg
									class="mr-1 h-3 w-3"
									fill="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
									/>
								</svg>
								Source code available under GPLv3 license
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
