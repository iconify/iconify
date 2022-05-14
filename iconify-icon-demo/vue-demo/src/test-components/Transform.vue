<template>
	<section>
		<h1>Transformations (components/Transform.vue)</h1>
		<div>
			Default icon:
			<iconify-icon icon="demo" />
		</div>
		<div>
			Flip horizontally:
			<iconify-icon icon="demo" flip="horizontal" />
		</div>
		<div>
			Flip vertically:
			<iconify-icon icon="demo" flip="vertical" />
		</div>
		<div>
			Flip horizontally and vertically:
			<iconify-icon icon="demo" flip="horizontal,vertical" />
		</div>
		<div>
			90&deg; rotation:
			<iconify-icon icon="demo" rotate="1" />
			<iconify-icon icon="demo" rotate="90deg" />
			<iconify-icon icon="demo" rotate="25%" />
		</div>
		<div>
			180&deg; rotation:
			<iconify-icon icon="demo" rotate="2" />
			<iconify-icon icon="demo" rotate="180deg" />
			<iconify-icon icon="demo" rotate="50%" />
		</div>
		<div>
			270&deg; rotation:
			<iconify-icon icon="demo" rotate="3" />
			<iconify-icon icon="demo" rotate="270deg" />
			<iconify-icon icon="demo" rotate="-25%" />
		</div>
	</section>
</template>

<style scoped>
iconify-icon {
	font-size: 20px;
	line-height: 1em;
}
</style>
