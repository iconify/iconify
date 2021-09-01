/**
 * API query parameters
 */
type APIQueryParamValue = number | string | boolean | undefined;
export type IconifyAPIMergeQueryParams = Record<string, APIQueryParamValue>;

/**
 * Type for mergeParams()
 */
export type MergeParams = (
	base: string,
	params: IconifyAPIMergeQueryParams
) => string;

/**
 * Add parameters to query
 */
export const mergeParams: MergeParams = (
	base: string,
	params: IconifyAPIMergeQueryParams
): string => {
	let result = base,
		hasParams = result.indexOf('?') !== -1;

	/**
	 * Convertion of parameters to string, only allows simple types used by Iconify API
	 */
	function paramToString(value: APIQueryParamValue): string {
		switch (typeof value) {
			case 'boolean':
				return value ? 'true' : 'false';

			case 'number':
				return encodeURIComponent(value);

			case 'string':
				return encodeURIComponent(value);

			default:
				throw new Error('Invalid parameter');
		}
	}

	Object.keys(params).forEach((key: string) => {
		let value;

		try {
			value = paramToString(params[key]);
		} catch (err) {
			return;
		}

		result +=
			(hasParams ? '&' : '?') + encodeURIComponent(key) + '=' + value;
		hasParams = true;
	});

	return result;
};
