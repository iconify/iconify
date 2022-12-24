import { emojiComponents, EmojiComponentType } from '../data';
import type {
	SimilarEmojiTestData,
	CombinedEmojiTestDataItem,
} from './similar';

/**
 * List of components
 */
type ComponentsCount = Required<Record<EmojiComponentType, number>>;

/**
 * Extended tree item
 */
interface TreeSplitEmojiTestDataItem extends CombinedEmojiTestDataItem {
	// Components
	components: ComponentsCount;

	// Components, stringified
	componentsKey: string;
}

/**
 * Tree item
 */
export interface EmojiComponentsTreeItem {
	// Item
	item: TreeSplitEmojiTestDataItem;

	// Child element(s)
	children?: Record<EmojiComponentType, EmojiComponentsTreeItem>;
}

export type EmojiComponentsTree = Record<string, EmojiComponentsTreeItem>;

/**
 * Merge types for unique key
 */
function mergeComponentTypes(value: EmojiComponentType[]) {
	return '[' + value.join(',') + ']';
}

/**
 * Merge count for unique key
 */
function mergeComponentsCount(value: ComponentsCount): string {
	const keys: EmojiComponentType[] = [];
	for (const key in emojiComponents) {
		const type = key as EmojiComponentType;
		for (let i = 0; i < value[type]; i++) {
			keys.push(type);
		}
	}
	return keys.length ? mergeComponentTypes(keys) : '';
}

/**
 * Group data
 */
interface GroupItem {
	item: TreeSplitEmojiTestDataItem;
	parsed?: true;
}
type GroupItems = Record<string, GroupItem>;

/**
 * Get item from group
 */
function getGroupItem(
	items: GroupItems,
	components: ComponentsCount
): TreeSplitEmojiTestDataItem | undefined {
	const key = mergeComponentsCount(components);
	const item = items[key];
	if (item) {
		item.parsed = true;
		return item.item;
	}
}

/**
 * Convert test data to dependencies tree, based on components
 */
export function getEmojiTestDataTree(
	data: SimilarEmojiTestData
): EmojiComponentsTree {
	// Group items by base name
	const groups = Object.create(null) as Record<string, GroupItems>;
	for (const key in data) {
		const item = data[key];
		const text = item.name.key;
		const parent = groups[text] || (groups[text] = {} as GroupItems);

		// Generate key
		const components: ComponentsCount = {
			'hair-style': 0,
			'skin-tone': 0,
		};
		item.sequence.forEach((value) => {
			if (typeof value !== 'number') {
				components[value]++;
			}
		});
		const componentsKey = mergeComponentsCount(components);
		if (parent[componentsKey]) {
			throw new Error(`Duplicate components tree item for "${text}"`);
		}
		parent[componentsKey] = {
			item: {
				...item,
				components,
				componentsKey,
			},
		};
	}

	// Sort items
	const results = Object.create(null) as EmojiComponentsTree;
	for (const key in groups) {
		const items = groups[key];

		const check = (
			parent: EmojiComponentsTreeItem,
			parentComponents: EmojiComponentType[],
			type: EmojiComponentType
		): true | undefined => {
			const item = parse(parentComponents, [type]);
			if (item) {
				const children =
					parent.children ||
					(parent.children =
						{} as Required<EmojiComponentsTreeItem>['children']);
				children[type] = item;
				return true;
			}
		};

		const parse = (
			parentComponents: EmojiComponentType[],
			newComponents: EmojiComponentType[]
		): EmojiComponentsTreeItem | undefined => {
			// Merge parameters
			const components: ComponentsCount = {
				'hair-style': 0,
				'skin-tone': 0,
			};
			const componentsList = parentComponents.concat(newComponents);
			componentsList.forEach((type) => {
				components[type]++;
			});

			// Get item
			let item = getGroupItem(items, components);
			if (
				!item &&
				newComponents.length === 1 &&
				newComponents[0] === 'skin-tone'
			) {
				// Attempt double skin tone
				const doubleComponents = {
					...components,
				};
				doubleComponents['skin-tone']++;
				item = getGroupItem(items, doubleComponents);
			}
			if (item) {
				// Check child items
				const result: EmojiComponentsTreeItem = {
					item,
				};

				// Try adding children
				for (const key in emojiComponents) {
					check(result, componentsList, key as EmojiComponentType);
				}
				return result;
			}
		};

		const root = parse([], []);
		if (!root) {
			throw new Error(`Cannot find parent item for "${key}"`);
		}

		// Make sure all child items are checked
		for (const itemsKey in items) {
			if (!items[itemsKey].parsed) {
				throw new Error(`Error generating tree for "${key}"`);
			}
		}

		// Make sure root is not empty
		if (root.children) {
			results[key] = root;
		}
	}

	return results;
}
