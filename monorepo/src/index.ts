import { addLinksToWorkspace } from './add-links';
import { cleanWorkspace } from './clean';
import { installAllPackages } from './install';
import { removeLinksFromWorkspace } from './remove-links';
import { findWorkspaces } from './workspaces';

/**
 * Fix links
 */
export function fixLinks(): void {
	const workspaces = findWorkspaces();
	workspaces.forEach(addLinksToWorkspace);
}

/**
 * Remove links
 */
export function removeLinks(): void {
	const workspaces = findWorkspaces();
	workspaces.forEach(removeLinksFromWorkspace);
}

/**
 * Install all packages
 */
export { installAllPackages };

/**
 * Clean
 */
export function cleanWorkspaces(): void {
	const workspaces = findWorkspaces();
	workspaces.forEach(cleanWorkspace);
}
