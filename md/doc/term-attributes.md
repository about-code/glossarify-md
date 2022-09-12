# Term Attributes

[doc-aliases]: ../README.md#aliases-and-synonyms
[doc-vocabularies]: ./vocabulary-uris.md

Term Attributes are passed in a comment following a term's heading. The comment text must adhere to YAML syntax.

**Since v6.3.0** glossarify-md supports YAML syntax. Its easy to learn and a natural fit with Markdown. For example, this will be all you need to understand and use term attributes:

*my-glossary.md*
~~~md
# Term Heading
<!-- 
  attr-key: This is an attribute's value
  list-attr-key:
  - This is a list attribute's list value 0
  - This is a list attribute's list value 1
  - etc.
-->
...
~~~

> **ⓘ Note:** YAML syntax is *case-sensitive* and  like Markdown it is *sensitive to tabs and whitespaces*. In general term attributes will be lowercase.


## Attributes

### `aliases`

Comma-separated string or a string array listing alternative spellings that should be linked with a term definition when found in text. More see [README.md][doc-aliases]

> **ⓘ Note:** You may find that an uppercase `Aliases: ` term attribute works as well. This is going to be the only attribute for which an uppercase name remains supported *for backwards compatibility*. 

### `uri`

An identifier for the term's *meaning*. Can be used to link term occurrences to an authoritative definition on the web instead of linking term occurrences to a markdown book's glossary. Web linking requires setting `linkUris: true` for a `glossaries` item in a glossarify-md configuration file. More see *[URIs as Identifiers for Definitions of Meaning][doc-vocabularies]* 

# Addendum

There's going to be continued support for JSON term attribute syntax, for backwards compatibility. However, it requires some strictness about quotation marks, commas and braces/brackets which makes it easier to run into syntax errors:

~~~md
# Term Heading
<!--{ 
  "attr-key": "This is a simple attribute's value",
  "list-attr-key": [
    This is a list attribute's list value 0,
    This is a list attribute's list value 1,
    etc.
  ]
}-->
~~~

If you've been using JSON term attribute syntax and want to switch to YAML syntax you might find these regular expressions helpful to use with your editor's Search/Replace assistant:

### Example (Single term attribute)

*Input (JSON)*
~~~md
# Term
<!--{ "aliases": "alias 1, alias2" }-->
~~~

*Regular Expressions*
~~~
Search :  <!--\{\s?"(.*)"\s?:\s?"(.*)"\s?\}-->
Replace:  <!-- $1: $2 -->
~~~

*Output (YAML):*

~~~md
# Term
<!-- aliases: alias 1, alias2 -->
~~~

### Example (Two term attributes):

*Input (JSON)*
~~~md
# Term
<!--{ 
  "aliases": "alias 1, alias2",
  "uri": "https://foo.bar.org"
}-->
~~~

*Regular Expressions*
~~~
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
~~~

*Output (YAML)*

~~~md
# Term
<!-- 
  aliases: alias 1, alias2
  uri: https://foo.bar.org
-->
~~~