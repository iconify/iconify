<template>
	<div class="container mx-auto">
		<h1 class="text-4xl font-bold text-left mt-10">
			<span class="icon-[vscode-icons--file-type-tailwind]"></span>
			Tailwind CSS test file
		</h1>
		<section class="mt-2 mb-2">
			<h1 class="text-2xl">Dynamic selectors plugin</h1>
			<p>
				Monotone icons, arrow changes on hover:
				<span class="text-2xl demo">
					<span
						class="icon-[mdi-light--arrow-left] hover:icon-override-[mdi-light--arrow-right]"
					></span>
					<span class="icon-[mdi-light--forum]"></span>
				</span>
			</p>
			<p>
				Icons with hardcoded palette:
				<span class="text-3xl demo">
					<span class="icon-[vscode-icons--file-type-access]"></span>
					<span class="icon-[vscode-icons--file-type-vue]"></span>
				</span>
			</p>
		</section>
	</div>
</template>
