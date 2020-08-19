import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';

export const BaseMixin = superclass => class extends RtlMixin(LocalizeMixin(superclass)) {
	static deepCopy(original) {
		if (!original || !(original instanceof Object))
			return original;

		const copy = {};
		Object.keys(original).forEach(key =>
			copy[key] = this.deepCopy(original[key])
		);
		return copy;
	}

	static async getLocalizeResources(langs) {
		for await (const lang of langs) {
			let translations;
			switch (lang) {
				case 'en':
					translations = await import('../../locales/en.js');
					break;
				default:
					translations = await import('../../locales/en.js');
					break;
			}

			if (translations && translations.val) {
				return {
					language: lang,
					resources: translations.val
				};
			}
		}

		return null;
	}

	localize(key, params) {
		return super.localize(key, params) || `{language term '${key}' not found}`;
	}
};
