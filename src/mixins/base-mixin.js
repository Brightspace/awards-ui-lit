import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin';

export const BaseMixin = superclass => class extends LocalizeMixin(superclass) {
	static async getLocalizeResources(langs) {
		for await (const lang of langs) {
			let translations;
			switch (lang) {
				case 'en':
					translations = await import('../../../locales/en.js');
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
};
