import {ElementContent} from 'hast';

export default function (text: string, params?: Params): {html?: string, ast?: ElementContent[]}

export type Params = ClassNameParams & {
	html?: boolean,
	ast?: boolean,
};

export type ClassNameParams = {
	classPrefix?: string,
	modifiers?: boolean,
	classMap?: {[name: string]: string | string[]},
};
