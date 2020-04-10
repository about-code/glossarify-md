const api = {};

let _collator = function collator(s1, s2) {
    return s1.localeCompare(s2, "en");
};

api.init = function init(i18nOpts) {
    if (typeof Intl === "object") {
        _collator = new Intl.Collator(i18nOpts.locale, i18nOpts);
    } else {
        _collator = {
            compare(s1, s2) {
                return s1.localeCompare(s1, s2, i18nOpts.locale, i18nOpts);
            }
        };
    }
};

api.collator = {
    compare(s1, s2) {
        return _collator.compare(s1, s2);
    }
};
module.exports = api;
