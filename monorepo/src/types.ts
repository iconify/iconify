/**
 * List of directories
 */
export type PathList = string[];

/**
 * Package name
 */
export type PackageName = string;

/**
 * Package info
 */
export interface PackageInfo {
	name: PackageName;
	private: boolean;
	version: string;
	path: PathList;
}
