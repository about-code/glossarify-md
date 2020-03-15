const api = {};

let _collator = function collator(s1, s2) {
    return s1.localeCompare(s2, "en");
};

api.init = function init(locale, localeCompare) {
    if (typeof Intl === "object") {
        _collator = new Intl.Collator(locale, localeCompare);
    } else {
        _collator = {
            compare(s1, s2) {
                return s1.localeCompare(s1, s2, locale, localeCompare);
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
