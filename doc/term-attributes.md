# [Term Attributes](#term-attributes)

[Term Attributes][1] are passed in a comment following a [term★][2]'s heading. The comment text must adhere to YAML syntax.

**Since v6.3.0** [glossarify-md][3] supports YAML syntax. Its easy to learn and a natural fit with Markdown. For example, this will be all you need to understand and use [term attributes][1]:

*my-glossary.md*

```md
# Term Heading
<!--
  attr-key: This is an attribute's value
  list-attr-key:
  - This is a list attribute's list value 0
  - This is a list attribute's list value 1
  - etc.
-->
...
```

> **ⓘ Note:** YAML syntax is *case-sensitive* and  like Markdown it is *sensitive to tabs and whitespaces*. In general term attributes will be lowercase.

## [Attributes](#attributes)

### [`aliases`](#aliases)

Comma-separated string or a string array listing alternative spellings that should be linked with a [term★][2] definition when found in text. More see [README.md][4]

> **ⓘ Note:** You may find that an uppercase `Aliases: ` term attribute works as well. This is going to be the only attribute for which an uppercase name remains supported *for backwards compatibility*.

### [`uri`](#uri)

An identifier for the [term★][2]'s *meaning*. Can be used to link term occurrences to an authoritative definition on the web instead of linking term occurrences to a markdown book's [glossary][5]. Web linking requires setting `linkUris: true` for a `glossaries` item in a [glossarify-md][3] [configuration][6] file. More see page *[URIs as Identifiers for Definitions of Meaning][7]*

# [Addendum](#addendum)

There's going to be continued support for JSON [term★][2] attribute syntax, for backwards compatibility. However, it requires some strictness about quotation marks, commas and braces/brackets which makes it easier to run into syntax errors:

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

If you've been using JSON [term★][2] attribute syntax and want to switch to YAML syntax you might find these regular expressions helpful to use with your editor's Search/Replace assistant:

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

[1]: https://github.com/about-code/glossarify-md/tree/master/doc/term-attributes.md

[2]: ./glossary.md#term "A term is denoted by a heading in a markdown file which is told glossarify-md to be a glossary file."

[3]: https://github.com/about-code/glossarify-md "This project."

[4]: https://github.com/about-code/glossarify-md/tree/master/README.md

[5]: https://github.com/about-code/glossarify-md/tree/master/doc/glossary.md

[6]: https://github.com/about-code/glossarify-md/tree/master/conf/README.md

[7]: https://github.com/about-code/glossarify-md/tree/master/doc/vocabulary-uris.md
