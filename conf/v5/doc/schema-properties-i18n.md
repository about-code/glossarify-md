## i18n Default Value

The default value is:

```json
{
  "locale": "en"
}
```

# i18n Properties

| Property                                | Type      | Required | Nullable       | Defined by                                                                                                                                                                                                                          |
| :-------------------------------------- | :-------- | :------- | :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [caseFirst](#casefirst)                 | `string`  | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-i18n-properties-casefirst.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/caseFirst")                 |
| [ignorePunctuation](#ignorepunctuation) | `boolean` | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-i18n-properties-ignorepunctuation.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/ignorePunctuation") |
| [locale](#locale)                       | `string`  | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-i18n-properties-locale.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/locale")                       |
| [localeMatcher](#localematcher)         | `string`  | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-i18n-properties-localematcher.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/localeMatcher")         |
| [numeric](#numeric)                     | `boolean` | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-i18n-properties-numeric.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/numeric")                     |
| [sensitivity](#sensitivity)             | `string`  | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-i18n-properties-sensitivity.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/sensitivity")             |
| [usage](#usage)                         | `string`  | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-i18n-properties-usage.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/usage")                         |

## caseFirst

Whether upper case or lower case should sort first. Default: 'false' (Use locale's default). See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`caseFirst`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-i18n-properties-casefirst.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/caseFirst")

### caseFirst Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value     | Explanation |
| :-------- | :---------- |
| `"upper"` |             |
| `"lower"` |             |
| `"false"` |             |

## ignorePunctuation

Whether punctuation should be ignored. Default: false. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`ignorePunctuation`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-i18n-properties-ignorepunctuation.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/ignorePunctuation")

## locale

The locale to use for operations such as sorting. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`locale`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-i18n-properties-locale.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/locale")

## localeMatcher

The locale matching algorithm to use. Default: 'best fit'. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`localeMatcher`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-i18n-properties-localematcher.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/localeMatcher")

### localeMatcher Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value        | Explanation |
| :----------- | :---------- |
| `"best fit"` |             |
| `"lookup"`   |             |

## numeric

Whether to use numeric collation. Default: false. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`numeric`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-i18n-properties-numeric.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/numeric")

## sensitivity

Which differences in the strings should lead to non-zero result values. Default: 'variant' for sorts, locale dependent for searches. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`sensitivity`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-i18n-properties-sensitivity.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/sensitivity")

### sensitivity Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value       | Explanation |
| :---------- | :---------- |
| `"base"`    |             |
| `"accent"`  |             |
| `"case"`    |             |
| `"variant"` |             |

## usage

Whether the comparison is for sorting or for searching for matching strings. Default: 'sort'. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`usage`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-i18n-properties-usage.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Internationalization/properties/usage")

### usage Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value      | Explanation |
| :--------- | :---------- |
| `"sort"`   |             |
| `"search"` |             |
