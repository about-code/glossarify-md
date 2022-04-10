# [Glossary](#glossary)

glossarify-md: [https://github.com/about-code/glossarify-md][1]

This is a glossary of terms helpful when working with glossarify-md or reading its docs. It also servers as an example and is processed by *glossarify-md* itself using the [glossarify-md.conf.json][2] configuration at the root of this repo.

## [Alias](#alias)

A sementically similar or equivalent alternative name for a [term🟉][3]. May also be used to link grammatical variants of a term with a term definition.

## [Term](#term)

A [term🟉][3] is a heading in a markdown file which is passed to glossarify-md as a glossary.

## [Term Attributes](#term-attributes)

<!--{ "uri": "term attribute, term-attribute" }-->

[Term🟉][3] Attributes are properties passed to glossarify-md using an HTML comment syntax `<!--{...}-->` which encodes a JSON string:

*glossary.md*

```md
# Term
<!--{ "term-attr": "This is a term attribute." }-->
...
```

## [Term Hint](#term-hint)

<!--{ "aliases": "term hint, term-hint" }-->

An optional (symbol-) character like for example `🟉` decorating a [term🟉][3] link to distinguish it from a regular link.
See glossarify-md configuration options for details.

## [Vocabulary](#vocabulary)

<!--{ "aliases": "vocabularies, Formal Ontologies" }-->

[vocabularies]: https://www.w3.org/standards/semanticweb/ontology

A collection of terms which is uniquely identifiable. See also [Semantic Web Vocabularies and Ontologies][vocabularies].

## [Linkification](#linkification)

Process of searching for a [term🟉][3] in *document A* matching a heading phrase in
*document B* and replacing the term in *document A* with a Markdown link pointing
onto the term definition in *document B*.

## [Slug](#slug)

<!--{ "aliases": "slug, slugs" }-->

A [slug🟉][4] is a URL-friendly identifier that can be used within [URL fragments🟉][5] to address headings / sections on a page.

## [URL fragment](#url-fragment)

<!-- Aliases: URL fragments -->

The fragment is the part follwing the `#` in a [URL🟉][6].

## [URI / URL](#uri--url)

<!--{ "aliases": "URI, URL" }-->

*Uniform Resource Identifier* and *Uniform Resource Locator* are both the same thing, which is an ID with a syntax `scheme://authority.tld/path/#fragment?query` like `https://my.org/foo/#bar?q=123`. Although both things are the same, the two acronyms are often used to emphasize whether using the ID to primarily *identify* something or using *the same ID* to *also* locate and retrieve a represention of what it identifies.

## [KOS - Knowledge Organization Systems](#kos---knowledge-organization-systems)

<!--{ "aliases": "KOS, Knowledge Organization System" }-->

Glossaries are considered a kind of *Knowledge Organisation System ([KOS🟉][7])* which organizes knowledge as a list of terms and [term🟉][3] definitions. There are other KOS like *Thesauri*, *Taxonomies* or *Word Nets* which add term relationships (hierarchically or as graphs capturing semantic or linguistic relationships). To model informal KOS the W3C has developed SKOS.

[Formal Ontologies🟉][8] are graph-like [KOS🟉][7] which focus on *logical formalism*. They are built from logical statements and tend to become harder to maintain as they grow due to a requirement of being *fully free of logical conflicts*. Ontologies require a (meta-) vocabulary known as the *Web Ontology Language* OWL. SKOS was built on top of OWL.

[1]: https://github.com/about-code/glossarify-md

[2]: ../glossarify-md.conf.json

[3]: #term "A term is a heading in a markdown file which is passed to glossarify-md as a glossary."

[4]: #slug "A slug is a URL-friendly identifier that can be used within URL fragments to address headings / sections on a page."

[5]: #url-fragment "The fragment is the part follwing the # in a URL."

[6]: #uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[7]: #kos---knowledge-organization-systems "Glossaries are considered a kind of Knowledge Organisation System (KOS) which organizes knowledge as a list of terms and term definitions."

[8]: #vocabulary "A collection of terms which is uniquely identifiable."
