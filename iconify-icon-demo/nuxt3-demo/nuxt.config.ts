// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	vue: {
		compilerOptions: {
			isCustomElement: (tag) => tag === 'iconify-icon',
		},
	},
	future: {
		compatibilityVersion: 4,
	},
	compatibilityDate: '2024-07-16',
});
