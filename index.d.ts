import {ElementContent} from 'hast';

export default function (text: string, params?: Params): Result

export function init(params?: InitParams): Promise<void>

export type Params = ClassNameParams & {
	html?: boolean,
	ast?: boolean,
};

export type InitParams = {
	locateTreeSitterWasm?: (file: string, dir: string) => string,
	locateFamilyMarkupWasm?: (file: string) => string,
};

export type ClassNameParams = {
	classPrefix?: string,
	modifiers?: boolean,
	classMap?: {[name: string]: string | string[]},
};

export type HighlightParams = Params & {
	parser: import('tree-sitter'),
	query: import('tree-sitter').Query,
};

export type Result = {html?: string, ast?: ElementContent[]};
