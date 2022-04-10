# Glossary

glossarify-md: https://github.com/about-code/glossarify-md

This is a glossary of terms helpful when working with glossarify-md or reading its docs. It also servers as an example and is processed by *glossarify-md* itself using the [glossarify-md.conf.json](../glossarify-md.conf.json) configuration at the root of this repo.

## Alias

A sementically similar or equivalent alternative name for a term. May also be used to link grammatical variants of a term with a term definition.

## Term

A term is a heading in a markdown file which is passed to glossarify-md as a glossary.

## Term Attributes
<!--{ "aliases": "term attribute, term-attribute" }-->

Term Attributes are properties passed to glossarify-md using an HTML comment syntax `<!--{...}-->` which encodes a JSON string:

*glossary.md*
~~~md
# Term
<!--{ "term-attr": "This is a term attribute." }-->
...
~~~

## Term Hint
<!--{ "aliases": "term hint, term-hint" }-->

An optional (symbol-) character like for example `🟉` decorating a term link to distinguish it from a regular link.
See glossarify-md configuration options for details.

## Vocabulary
<!--{ "aliases": "vocabularies, Formal Ontologies" }-->
[vocabularies]: https://www.w3.org/standards/semanticweb/ontology

A collection of terms which is uniquely identifiable. See also [Semantic Web Vocabularies and Ontologies][vocabularies].

## Linkification

Process of searching for a term in *document A* matching a heading phrase in
*document B* and replacing the term in *document A* with a Markdown link pointing
onto the term definition in *document B*.

## Slug
<!--{ "aliases": "slug, slugs" }-->

A slug is a URL-friendly identifier that can be used within URL fragments to address headings / sections on a page.

## URL fragment
<!-- Aliases: URL fragments -->
The fragment is the part follwing the `#` in a URL.

## URI / URL
<!--{ "aliases": "URI, URL" }-->

*Uniform Resource Identifier* and *Uniform Resource Locator* are both the same thing, which is an ID with a syntax `scheme://authority.tld/path/#fragment?query` like `https://my.org/foo/#bar?q=123`. Although both things are the same, the two acronyms are often used to emphasize whether using the ID to primarily *identify* something or using *the same ID* to *also* locate and retrieve a represention of what it identifies.

## KOS - Knowledge Organization Systems
<!--{ "aliases": "KOS, Knowledge Organization System" }-->

Glossaries are considered a kind of *Knowledge Organisation System (KOS)* which organizes knowledge as a list of terms and term definitions. There are other KOS like *Thesauri*, *Taxonomies* or *Word Nets* which add term relationships (hierarchically or as graphs capturing semantic or linguistic relationships). To model informal KOS the W3C has developed SKOS.

Formal Ontologies are graph-like KOS which focus on *logical formalism*. They are built from logical statements and tend to become harder to maintain as they grow due to a requirement of being *fully free of logical conflicts*. Ontologies require a (meta-) vocabulary known as the *Web Ontology Language* OWL. SKOS was built on top of OWL.
