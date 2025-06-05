<!-- src/lib/components/GamePlayGuide.svelte -->
<script lang="ts">
	let showGuide = $state(false);
	let selectedLanguage = $state('en'); // 'en' for English, 'zh' for Chinese

	/**
	 * Opens the guide dialog.
	 */
	function openShowGuideDialog() {
		showGuide = true;
	}

	/**
	 * Closes the guide dialog.
	 */
	function closeDialog() {
		showGuide = false;
	}

	/**
	 * Toggles between English and Chinese language versions.
	 */
	function toggleLanguage() {
		selectedLanguage = selectedLanguage === 'en' ? 'zh' : 'en';
	}
</script>

<div>
	<button
		class={[
			'flex cursor-pointer items-center justify-center rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700 ',
			'text-sm md:text-lg xl:text-2xl',
			'gap-1 md:gap-0'
		]}
		onclick={openShowGuideDialog}
	>
		<svg
			class="mr-1 h-5 w-5 stroke-current md:mr-1.5"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke-width="2" />
			<path d="M12 7h-4v6h4v4l4-4H16V9h2V7h-2z" fill="currentColor" />
		</svg>
		<div class="flex flex-col md:flex-row md:gap-2">
			<div title="Game Play Guide">Guide</div>
			<div title="遊戲玩法指南">指南</div>
		</div>
	</button>
	{#if showGuide}
		<div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
			<div class="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>
			<div class="fixed inset-0 z-50 flex w-screen items-center justify-center overflow-y-auto">
				<div class="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-xl font-bold">Game Play Guide / 遊戲玩法指南</h2>
						<div class="flex flex-col items-center gap-0.5 sm:flex-row">
							<div class="mr-2 text-center text-xs sm:text-base">Language / 语言</div>
							<button
								class={[
									'bg-gray-20 cursor-pointer rounded px-2 py-1 text-sm',
									selectedLanguage === 'en' ? 'hover:bg-green-800' : ' hover:bg-gray-300',
									selectedLanguage === 'en' && 'bg-green-600 text-white '
								]}
								onclick={toggleLanguage}
							>
								English
							</button>
							<button
								class={[
									'bg-gray-20 cursor-pointer rounded px-2 py-1 text-sm',
									selectedLanguage === 'zh' ? 'hover:bg-green-800' : ' hover:bg-gray-300',
									selectedLanguage === 'zh' && 'bg-green-600 text-white '
								]}
								onclick={toggleLanguage}
							>
								中文
							</button>
						</div>
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
					{#if selectedLanguage === 'en'}
						<h3 class="mb-2 text-lg font-semibold">Objective</h3>
						<p class="mb-4">
							Complete all suits by building sequences in descending order, same suit. Use the draw
							pile to replenish your cards.
						</p>

						<h3 class="mb-2 text-lg font-semibold">How to Play</h3>
						<ol class="mb-4 list-inside list-decimal space-y-1">
							<li>Click cards to drag them to target stacks or the foundation.</li>
							<li>Build sequences in descending order (e.g., 10♠ → 9♠ → 8♠).</li>
							<li>Move entire stacks when possible (e.g., moving a 3-card sequence).</li>
							<li>Use the draw pile to add new cards to your workspace.</li>
							<li>Reveal cards by moving them to the foundation or completing sequences.</li>
						</ol>

						<h3 class="mb-2 text-lg font-semibold">Tips</h3>
						<ul class="mb-4 list-inside list-disc space-y-1">
							<li>Use the draw pile strategically to uncover hidden cards.</li>
							<li>Look for opportunities to complete suits early to reduce difficulty.</li>
						</ul>
					{:else}
						<h3 class="mb-2 text-xl font-semibold">目標</h3>
						<p class="mb-4 text-lg">
							透過建立降序排列的同花色牌組，完成所有花色。使用抽牌堆來補充你的牌面。
						</p>

						<h3 class="mb-2 text-xl font-semibold">怎麼玩</h3>
						<ol class="mb-4 list-inside list-decimal space-y-1 text-lg">
							<li>點擊牌張以拖拽至目標堆疊或底牌。</li>
							<li>建立降序排列的同花色牌組（例如：10♠ → 9♠ → 8♠）。</li>
							<li>當可能時移動整組牌張（例如：移動三張牌組）。</li>
							<li>使用抽牌堆來補充你的牌面。</li>
							<li>透過移動至底牌或完成牌組來揭示牌張。</li>
						</ol>

						<h3 class="mb-2 text-xl font-semibold">技巧</h3>
						<ul class="mb-4 list-inside list-disc space-y-1 text-lg">
							<li>策略性使用抽牌堆來揭露隱藏的牌張。</li>
							<li>尋找機會早些完成花色以降低難度。</li>
						</ul>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
