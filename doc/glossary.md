# [Glossary](#glossary)

[glossarify-md]: https://github.com/about-code/glossarify-md

This is a glossary of terms helpful when working with [glossarify-md] or reading its docs. It also serves as an example and is processed by *[glossarify-md][1]* itself using the [glossarify-md.conf.json][2] configuration at the root of this repo.

## [Alias](#alias)

An alternative [term★][3] or spelling for a term.

## [Term](#term)

A [term★][3] is denoted by a heading in a markdown file which is told [glossarify-md][1] to be a *glossary file*.

## [Term Attribute](#term-attribute)

<!-- aliases: term attributes, term-attribute -->

[Term★][3] Attributes are passed in a comment following a term's heading. The comment must adhere to YAML syntax.

## [Term Hint](#term-hint)

<!-- aliases: term hint, term-hint -->

An optional (symbol-) character like for example `↴` decorating a [term★][3] link to distinguish it from a regular link.
See [glossarify-md][1] configuration options for details.

## [Vocabulary](#vocabulary)

<!-- aliases: vocabularies, Formal Ontologies -->

[vocabularies]: https://www.w3.org/standards/semanticweb/ontology

A collection of terms which is uniquely identifiable. See also [Semantic Web Vocabularies and Ontologies][vocabularies].

## [Linkification](#linkification)

Process of searching for a [term★][3] in *document A* matching a heading phrase in
*document B* and replacing the term in *document A* with a Markdown link pointing
onto the term definition in *document B*.

## [Slug](#slug)

<!-- aliases: slug, slugs -->

A [slug★][4] is a URL-friendly identifier that can be used within [URL fragments★][5] to address headings / sections on a page.

## [URL fragment](#url-fragment)

<!-- aliases: URL fragments -->

The fragment is the part follwing the `#` in a [URL★][6].

## [URI / URL](#uri--url)

<!-- aliases: URI, URL -->

*Uniform Resource Identifier* and *Uniform Resource Locator* are both the same thing, which is an ID with a syntax `scheme://authority.tld/path/#fragment?query` like `https://my.org/foo/#bar?q=123`. Although both things are the same, the two acronyms are often used to emphasize whether using the ID to primarily *identify* something or using *the same ID* to *also* locate and retrieve a represention of what it identifies.

## [KOS - Knowledge Organization Systems](#kos---knowledge-organization-systems)

<!-- aliases: KOS, Knowledge Organization System -->

Glossaries are considered a kind of *Knowledge Organisation System ([KOS★][7])* which organizes knowledge as a list of terms and [term★][3] definitions. There are other KOS like *Thesauri*, *Taxonomies* or *Word Nets* which add term relationships (hierarchically or as graphs capturing semantic or linguistic relationships). To model informal KOS the W3C has developed [SKOS][8].

[Formal Ontologies★][9] are graph-like [KOS★][7] which focus on *logical formalism*. They are built from logical statements and tend to become harder to maintain as they grow due to a requirement of being *fully free of logical conflicts*. Ontologies require a (meta-) vocabulary known as the *Web Ontology Language* [OWL][10]. [SKOS][8] was built on top of OWL.

[1]: https://github.com/about-code/glossarify-md "This project."

[2]: ../glossarify-md.conf.json

[3]: #term "A term is denoted by a heading in a markdown file which is told glossarify-md to be a glossary file."

[4]: #slug "A slug is a URL-friendly identifier that can be used within URL fragments to address headings / sections on a page."

[5]: #url-fragment "The fragment is the part follwing the # in a URL."

[6]: #uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[7]: #kos---knowledge-organization-systems "Glossaries are considered a kind of Knowledge Organisation System (KOS) which organizes knowledge as a list of terms and term definitions."

[8]: http://w3.org/skos/ "With the Simple Knowledge Organization System (SKOS) the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling Simple Knowledge Organization Systems such as Glossaries, Thesauri, Taxonomies or Word Nets."

[9]: #vocabulary "A collection of terms which is uniquely identifiable."

[10]: https://www.w3.org/TR/2012/REC-owl2-overview-20121211/ "Web Ontology Language."
