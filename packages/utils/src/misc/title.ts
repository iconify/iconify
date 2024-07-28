/**
 * Sanitises title, removing any unwanted characters that might break XML.
 *
 * This is a very basic funciton, not full parser.
 */
export function sanitiseTitleAttribute(content: string): string {
	return content.replace(/[<>&]+/g, '');
}
