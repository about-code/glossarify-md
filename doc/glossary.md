# [Glossary (Terms and Concepts of glossarify-md)](#glossary-terms-and-concepts-of-glossarify-md)

This is a glossary of terms helpful when working with glossarify-md or reading its docs. It also serves as an example and is processed by glossarify-md itself using the [glossarify-md.conf.json][1] [configuration][2] at the root of this repo.

## [Alias](#alias)

An alternative term or spelling for a term.

<!--
## Term

Terms are headings in a markdown file which has been configured to be a *glossary file*.
-->

## [Term Attribute](#term-attribute)

<!-- aliases: term attributes, term-attribute -->

[Term Attributes][3] are passed in a comment following a term's heading. The comment must adhere to YAML syntax.

## [Term Definition](#term-definition)

A [term definition][4] is, technically, the phrase of a heading in a Markdown file which was configured to be a glossary file. For a term definition to be useful the heading is expected to be followed by a paragraph describing the meaning of the heading's phrase. See also [Term Occurrence][5].

## [Term Hint](#term-hint)

<!-- aliases: term hint, term-hint -->

An optional (symbol-) character like for example `↴` decorating a term link to distinguish it from a regular link. See glossarify-md [configuration][2] options for details.

## [Term Occurrence](#term-occurrence)

<!-- aliases: term occurrence, term occurrences -->

A phrase in a Markdown file A which matches the phrase of a heading in a Markdown file B where B was configured to be a glossary file. As a user of glossarify-md you want the tool to find [term occurrences][5] in your Markdown documents and simplify/automate linking them with corresponding term definitions in a glossary.

## [Vocabulary](#vocabulary)

<!-- aliases: vocabularies, Formal Ontologies -->

[vocabularies]: https://www.w3.org/standards/semanticweb/ontology

A collection of terms which is uniquely identifiable. See also [Semantic Web Vocabularies and Ontologies][vocabularies].

## [Linkification](#linkification)

Process of searching for a term in *document A* matching a heading phrase in
*document B* and replacing the term in *document A* with a Markdown link pointing
onto the [term definition][4] in *document B*.

## [Slug](#slug)

<!-- aliases: slug, slugs -->

A [slug][6] is a URL-friendly identifier that can be used within [URL fragments][7] to address headings / sections on a page.

## [URL fragment](#url-fragment)

<!-- aliases: URL fragments -->

The fragment is the part follwing the `#` in a [URL][8].

## [URI / URL](#uri--url)

<!-- aliases: URI, URL -->

*Uniform Resource Identifier* and *Uniform Resource Locator* are both the same thing, which is an ID with a syntax `scheme://authority.tld/path/#fragment?query` like `https://my.org/foo/#bar?q=123`. Although both things are the same, the two acronyms are often used to emphasize whether using the ID to primarily *identify* something or using *the same ID* to *also* locate and retrieve a represention of what it identifies.

## [KOS - Knowledge Organization Systems](#kos---knowledge-organization-systems)

<!-- aliases: KOS, Knowledge Organization System -->

Glossaries are considered a kind of *Knowledge Organisation System ([KOS][9])* which organizes knowledge as a list of terms and term definitions. There are other KOS like *Thesauri*, *Taxonomies* or *Word Nets* which add term relationships (hierarchically or as graphs capturing semantic or linguistic relationships). To model informal KOS the W3C has developed [SKOS 🌎][10].

[Formal Ontologies][11] are graph-like [KOS][9] which focus on *logical formalism*. They are built from logical statements and tend to become harder to maintain as they grow due to a requirement of being *fully free of logical conflicts*. Ontologies require a (meta-) vocabulary known as the *Web Ontology Language* [OWL 🌎][12]. [SKOS 🌎][10] was built on top of OWL.

[1]: ../glossarify-md.conf.json

[2]: https://github.com/about-code/glossarify-md/blob/master/conf/README.md

[3]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term-attribute "Term Attributes are passed in a comment following a term's heading."

[4]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term-definition "A term definition is, technically, the phrase of a heading in a Markdown file which was configured to be a glossary file."

[5]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term-occurrence "A phrase in a Markdown file A which matches the phrase of a heading in a Markdown file B where B was configured to be a glossary file."

[6]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#slug "A slug is a URL-friendly identifier that can be used within URL fragments to address headings / sections on a page."

[7]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#url-fragment "The fragment is the part follwing the # in a URL."

[8]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[9]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#kos---knowledge-organization-systems "Glossaries are considered a kind of Knowledge Organisation System (KOS) which organizes knowledge as a list of terms and term definitions."

[10]: http://w3.org/skos/ "With the Simple Knowledge Organization System (SKOS) the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling Simple Knowledge Organization Systems such as Glossaries, Thesauri, Taxonomies or Word Nets."

[11]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#vocabulary "A collection of terms which is uniquely identifiable."

[12]: https://www.w3.org/TR/2012/REC-owl2-overview-20121211/ "Web Ontology Language."
