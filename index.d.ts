import {ElementContent} from 'hast';

export default function (text: string, params?: Params): {html?: string, ast?: ElementContent[]}

export type Params = ConvertParams & {
	html?: boolean,
	ast?: boolean,
};

export type ConvertParams = {
	classPrefix?: string,
	modifiers?: boolean,
};
