import createDebugger from 'debug'
import type { CustomIconLoader, InlineCollection } from '.'

const debug = createDebugger('@iconify-loader:custom')

export async function getCustomIcon(
	custom: CustomIconLoader | InlineCollection,
	collection: string,
	icon: string,
	scale = 1
): Promise<string | undefined> {
	let result: string | undefined | null

	debug(`${collection}:${icon}`)

	if (typeof custom === 'function') {
		result = await custom(icon)
	}
	else {
		const inline = custom[icon]
		result = typeof inline === 'function'
			? await inline()
			: inline
	}

	if (result) {
		if (!result.startsWith('<svg '))
			console.warn(`Custom icon "${icon}" in "${collection}" is not a valid SVG`)
		return result.replace('<svg ', `<svg height="${scale}em" width="${scale}em" `)
	}
}
