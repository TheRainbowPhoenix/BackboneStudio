import type lang from "../lang";

export type LangPackKey = string | keyof typeof lang; // TODO: prod, remove "string |"

export type FormatterArgument = string | number | Node | FormatterArgument[];
export type FormatterArguments = FormatterArgument[];

namespace I18n {
    export function i18n(key: LangPackKey, args?: FormatterArguments) {
    	console.debug(args)
    	return key;
		// return new IntlElement({key, args}).element;
	}

}

const i18n = I18n.i18n;
export {i18n};