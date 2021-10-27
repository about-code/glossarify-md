# Glossary

This is a glossary of terms helpful when working with glossarify-md or reading its docs. It also servers as an example and is processed by *glossarify-md* itself using the [glossarify-md.conf.json](../glossarify-md.conf.json) configuration at the root of this repo.

## JSON-LD

JSON-LD is a standardized JSON document format for mapping system-specific terms of a JSON-based data format to well-know terms from public vocabularies. With JSON-LD it's possible to write applications which are interoperable by mutual agreement on the same public vocabulary. SKOS is one such vocabulary supported by [glossarify-md]

## KOS (Knowledge Organization Systems)
<!--{ "aliases": "KOS, Knowledge Organization System" }-->
[SKOS]: http://w3.org/skos/
[LD]: https://www.w3.org/standards/semanticweb/ontology
[JSON-LD]: https://json-ld.org
[jsonld]: https://npmjs.com/package/jsonld
[vocabularies]: https://www.w3.org/standards/semanticweb/ontology
[glossarify-md]: https://github.com/about-code/glossarify-md
[OWL]: https://www.w3.org/TR/2012/REC-owl2-overview-20121211/

Glossaries are considered a kind of *Knowledge Organisation System (KOS)* which organizes knowledge as a list of terms and term definitions. There are other KOS like *Thesauri*, *Taxonomies* or *Word Nets* which add term relationships (hierarchically or as graphs capturing semantic or linguistic relationships). To model informal KOS the W3C has developed SKOS.

[Formal Ontologies][vocabularies] are graph-like KOS which focus on *logical formalism*. They are built from logical statements and tend to become harder to maintain as they grow due to a requirement of being *fully free of logical conflicts*. Ontologies require a (meta-) vocabulary known as the [*Web Ontology Language* OWL][OWL]. SKOS was built on top of OWL.

## Linkification

Process of searching for a term in *document A* matching a heading phrase in
*document B* and replacing the term in *document A* with a Markdown link pointing
onto the term definition in *document B*.

## remark

[remark] is a parser and compiler project under the unified umbrella for *Markdown* text files in particular.

[remark]: https://github.com/remarkjs/remark

## SKOS

With [SKOS](https://w3.org/skos) the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling *Simple Knowledge Organization Systems* such as Glossaries, Thesauri, Taxonomies or Word Nets.

## slug
<!--{ "aliases": "slugs" }-->

A slug by our definition is a URL-friendly identifier created from arbitrary text that can be used within URL fragments to address headings / sections on a page.

## Term Attributes
<!--{ "uri": "term attribute, term-attribute" }-->

Term Attributes are properties passed to glossarify-md using an HTML comment syntax `<!--{...}-->` which encodes a JSON string:

*glossary.md*
~~~md
# Term
<!--{ "term-attr": "This is a term attribute." }-->
...
~~~

## Term Hint
<!--{ "aliases": "term hint, term-hint" }-->

An optional (symbol-) character like for example `↴` decorating a term link to distinguish it from a regular link.
See glossarify-md configuration options for details.


## unified

[unified] is an umbrella project around *text file processing in general*. See also [Conceptual Layers of glossarify-md](./conceptual-layers.md)

[unified]: https://unifiedjs.com

## URL fragment
<!-- Aliases: URL fragments -->
The fragment is the part follwing the `#` in a URL.

## URI
<!--{ "aliases": "URL" }-->

*Uniform Resource Identifier* and *Uniform Resource Locator* describe both the same thing, which is an ID with a syntax `scheme://authority.tld/path/#fragment?query` like `https://my.org/foo/#bar?q=123`. Although both things are the same, the two acronyms are often used to emphasize whether using the ID to primarily *identify* something or using *the same ID* to *also* locate and retrieve a represention of what it identifies.
<!--
For example there's no strict requirement that URIs must resolve to a web page. They are just IDs. However URIs *can* be used to *locate and retrieve* a textual representation *of what they identify* which is when they are often called URL. A *representation* can be a web page. But an URI could als identify a technical device and could be used as an URL to locate a representation of that device in form of a datasheet.

URIs continue to be IDs after a particular representation like the datasheet disappears. This sometimes leads to controversies on whether a certain URL which is also an URI can ever be "reused" to locate something different than what the URI identified.

Strictly spoken: it *should not* because URLs and URIs *are equivalent* and two sides of the same coin. A URL should be reserved to locate and serve a representation of what itself *being a URI* identifies. If it doesn't it no longer identifies *a single* thing but two different things and loses its purpose as *identifier*.

However, it is a matter of fact that URLs and the web page content they identify and locate change thousands of times every day world wide. Because often it simply doesn't matter *what exactly* an URI/URL identifies but just that it identifies and locates *something*. Therefore you may only really care about "durability" of an URI/URL if your audience cares or if you really want to identify a particular thing.

If you're afraid of making a long-term comittment on a particular URI because you "might want to reuse the URL", then there's a simple solution: just add additional elements like "time", "randomness" or "uniqueness" to the URI/URL's `/path/...` or `#fragment` part to make it *unlikely* of being reused for something else.

In case of glossarify-md you could use one of the cryptographic heading ID algorithms like `md5` or `sha256` supported by [`headingIdAlgorithm`][headingIdAlgorithm].

[headingIdAlgorithm]: ../README.md#linkingheadingidalgorithm
-->

## vuepress

[vuepress] is a static website generator translating markdown files into a website powered by [vuejs].

[vuejs]: https://vuejs.org
[vuepress]: https://vuepress.vuejs.org
