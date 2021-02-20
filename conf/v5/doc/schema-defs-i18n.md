# i18n Properties

| Property                                | Type      | Required | Nullable       | Defined by                                                                                                                                                                                                |
| :-------------------------------------- | :-------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [caseFirst](#casefirst)                 | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-casefirst.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/i18n/properties/caseFirst")                 |
| [ignorePunctuation](#ignorepunctuation) | `boolean` | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-ignorepunctuation.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/i18n/properties/ignorePunctuation") |
| [locale](#locale)                       | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-locale.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/i18n/properties/locale")                       |
| [localeMatcher](#localematcher)         | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-localematcher.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/i18n/properties/localeMatcher")         |
| [numeric](#numeric)                     | `boolean` | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-numeric.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/i18n/properties/numeric")                     |
| [sensitivity](#sensitivity)             | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-sensitivity.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/i18n/properties/sensitivity")             |
| [usage](#usage)                         | `string`  | Optional | cannot be null | [Configuration Schema](schema-defs-i18n-properties-usage.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/i18n/properties/usage")                         |

## caseFirst

Whether upper case or lower case should sort first. Default: 'false' (Use locale's default). See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`caseFirst`

*   is optional

*   Type: `string`

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

*   Type: `boolean`

## locale

The locale to use for operations such as sorting. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`locale`

*   is optional

*   Type: `string`

## localeMatcher

The locale matching algorithm to use. Default: 'best fit'. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`localeMatcher`

*   is optional

*   Type: `string`

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

*   Type: `boolean`

## sensitivity

Which differences in the strings should lead to non-zero result values. Default: 'variant' for sorts, locale dependent for searches. See <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator/Collator>

`sensitivity`

*   is optional

*   Type: `string`

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

*   Type: `string`

### usage Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value      | Explanation |
| :--------- | :---------- |
| `"sort"`   |             |
| `"search"` |             |
