const api = {};
const hasIntl = typeof Intl === "object";

function createCollator(locale, opts) {
    if (hasIntl) {
        return new Intl.Collator(locale, opts);
    } else {
        return {
            compare(s1, s2) {
                return s1.localeCompare(s1, s2, locale, opts);
            }
        };
    }
}

const _defaultCollator = createCollator("en"); // default
let _collator = _defaultCollator;

api.init = function (i18nOpts) {
    _collator = createCollator(i18nOpts.locale, i18nOpts);
};

api.collator = {
    /**
     * Results of compare() are affected by a locale configuration provided to
     * `collator.init()`. So its results are not side-effect free but vary
     * depending on some configuration.
     */
    compare(s1, s2) {
        return _collator.compare(s1, s2);
    }
};
module.exports = api;
