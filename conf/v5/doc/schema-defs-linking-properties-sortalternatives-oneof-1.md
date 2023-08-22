## 1 Examples

```json
{
  "sortAlternatives": {
    "by": "glossary-ref-count",
    "perSectionDepth": 2
  }
}
```

# 1 Properties

| Property                            | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                                                                                                                    |
| :---------------------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [by](#by)                           | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-sortalternativesbyglossary-ref-count-properties-by.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/sortAlternatives.by.glossary-ref-count/properties/by")                           |
| [perSectionDepth](#persectiondepth) | `number` | Optional | cannot be null | [Configuration Schema](schema-defs-linking-properties-sortalternativesbyglossary-ref-count-properties-persectiondepth.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/linking/properties/sortAlternatives.by.glossary-ref-count/properties/perSectionDepth") |

## by



`by`

*   is optional

*   Type: `string`

### by Constraints

**constant**: the value of this property must be equal to:

```json
"glossary-ref-count"
```

## perSectionDepth

When there are ambiguous terms in a book one glossary term definition might be more appropriate in a section A while another definition for the same term may be more appropriate in a section B. glossary-ref-count' can prioritize term definitions separately per section by counting term usage individually per sections at level `perSectionDepth` but not for their subsections deeper than `perSectionDepth`.

`perSectionDepth`

*   is optional

*   Type: `number`

*   more: https://github.com/about-code/glossarify-md/blob/master/doc/ambiguities.md

### perSectionDepth Default Value

The default value is:

```json
2
```
