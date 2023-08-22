# [Term Attributes](#term-attributes)

[Term Attributes][1] provide additional metadata for a term. They are passed in a comment following a term heading:

```md
# Term Heading
<!--
key1: value
key2:
- list value 0
- list value 1
-->

Term definition here.
```

**Since v6.3.0** [term attributes][1] use YAML syntax. The example shows two [term attributes][2] `key1` and `key2` where `key2` has multiple attribute values.

> **ⓘ Note:** YAML syntax is *case-sensitive* and *sensitive to tabs and whitespaces* (like Markdown). As a rule of thumb: our own term attributes will be all lowercase.

## [Supported Term Attributes](#supported-term-attributes)

### [<x>`aliases`</x>](#xaliasesx)

A comma-separated string or a list of strings which provide synonyms or alternative spellings for a term that should be linked with a [term definition][3] when found in text. More see [README.md][4]

> **ⓘ Note:** Uppercase `Aliases` remains to be supported for backwards compatibility.

### [`uri`](#uri)

A unique identifier for the term and the definition of it's *meaning*. Use `linkUris: true` with a `glossaries` config in a glossarify-md [configuration][5] file to link [term occurrences][6] to an authoritative definition on the web using the term's `uri` [term attribute][1]. See also *[URIs as Identifiers for Definitions of Meaning][7]*.

# [Addendum](#addendum)

There's going to be continued support for JSON [term attribute][1] syntax, for backwards compatibility. However, it requires some strictness about quotation marks, commas and braces/brackets which makes it easier to run into syntax errors:

```md
# Term Heading
<!--{
  "attr-key": "This is a simple attribute's value",
  "list-attr-key": [
    This is a list attribute's list value 0,
    This is a list attribute's list value 1,
    etc.
  ]
}-->
```

If you've been using JSON [term attribute][1] syntax and want to switch to YAML syntax you might find these regular expressions helpful to use with your editor's Search/Replace assistant:

### [Example (Single term attribute)](#example-single-term-attribute)

*Input (JSON)*

```md
# Term
<!--{ "aliases": "alias 1, alias2" }-->
```

*Regular Expressions*

    Search :  <!--\{\s?"(.*)"\s?:\s?"(.*)"\s?\}-->
    Replace:  <!-- $1: $2 -->

*Output (YAML):*

```md
# Term
<!-- aliases: alias 1, alias2 -->
```

### [Example (Two term attributes):](#example-two-term-attributes)

*Input (JSON)*

```md
# Term
<!--{
  "aliases": "alias 1, alias2",
  "uri": "https://foo.bar.org"
}-->
```

*Regular Expressions*

    Search:
    <!--\{.*
    .*"(.*)"\s?:\s?"(.*)",+
    .*"(.*)"\s?:\s?"(.*)"
    \}-->

    Replace:
    <!--
      $1: $2
      $3: $4
    -->

*Output (YAML)*

```md
# Term
<!--
  aliases: alias 1, alias2
  uri: https://foo.bar.org
-->
```

[1]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term-attribute "Term Attributes are passed in a comment following a term's heading."

[2]: https://github.com/about-code/glossarify-md/blob/master/doc/term-attributes.md#term-attributes "Term Attributes provide additional metadata for a term."

[3]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term-definition "A term definition is, technically, the phrase of a heading in a Markdown file which was configured to be a glossary file."

[4]: https://github.com/about-code/glossarify-md/blob/master/README.md

[5]: https://github.com/about-code/glossarify-md/blob/master/conf/README.md

[6]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term-occurrence "A phrase in a Markdown file A which matches the phrase of a heading in a Markdown file B where B was configured to be a glossary file."

[7]: https://github.com/about-code/glossarify-md/blob/master/doc/vocabulary-uris.md#uris-as-identifiers-for-definitions-of-meaning "Consider a term skin."
