# Term Attributes

Term Attributes provide additional metadata for a term. They are passed in a comment following a term heading:

~~~md
# Term Heading
<!--
key1: value
key2:
- list value 0
- list value 1
-->

Term definition here.
~~~

**Since v6.3.0** term attributes use YAML syntax. The example shows two term attributes `key1` and `key2` where `key2` has multiple attribute values.

> **ⓘ Note:** YAML syntax is *case-sensitive* and *sensitive to tabs and whitespaces* (like Markdown). As a rule of thumb: our own term attributes will be all lowercase.


## Supported Term Attributes

### `aliases`

Expects a comma-separated string or a list of strings which provide synonyms or alternative spellings for a term that should be linked with a term definition when found in text. More see README.md

> **ⓘ Note:** Uppercase `Aliases` remains to be supported for backwards compatibility.

### `uri`

A unique identifier for the term and the definition of it's *meaning*. Use `linkUris: true` with a `glossaries` config in a glossarify-md configuration file to link term occurrences to an authoritative definition on the web using the term's `uri` term attribute. See also *URIs as Identifiers for Definitions of Meaning*.

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