# [Glossary of glossarify-md](#glossary-of-glossarify-md)

[glossarify-md]: https://github.com/about-code/glossarify-md

This is a glossary of terms helpful when working with glossarify-md or reading its docs. It also servers as an example and is processed by *glossarify-md* itself using the [glossarify-md.conf.json][1] configuration at the root of this repo.

## [Document](#document)

A markdown file not being declared a *glossary* by means of glossarify-md config option `glossaries`.

## [JSON-Document](#json-document)

A [JSON-Document🟉][2] is a file or resource containing JSON-serialized data object.

## [JSON-LD](#json-ld)

[JSON-LD]: https://json-ld.org

[jsonld]: https://npmjs.com/package/jsonld

[LD]: https://www.w3.org/standards/semanticweb/ontology

[JSON-LD] is a standardized JSON [document🟉][3] format for mapping system-specific terms of a JSON-based data format to well-know terms from public vocabularies. With [JSON-LD🟉][4] it's possible to write applications which are interoperable by mutual agreement on the same public vocabulary. [SKOS🟉][5] is one such vocabulary supported by [glossarify-md]

## [KOS (Knowledge Organization Systems)](#kos-knowledge-organization-systems)

<!--{ "aliases": "KOS, Knowledge Organization System" }-->

[vocabularies]: https://www.w3.org/standards/semanticweb/ontology

[OWL]: https://www.w3.org/TR/2012/REC-owl2-overview-20121211/

Glossaries are considered a kind of *Knowledge Organisation System ([KOS🟉][6])* which organizes knowledge as a list of terms and term definitions. There are other KOS like *Thesauri*, *Taxonomies* or *Word Nets* which add term relationships (hierarchically or as graphs capturing semantic or linguistic relationships). To model informal KOS the W3C has developed [SKOS🟉][5].

[Formal Ontologies][vocabularies] are graph-like [KOS🟉][6] which focus on *logical formalism*. They are built from logical statements and tend to become harder to maintain as they grow due to a requirement of being *fully free of logical conflicts*. Ontologies require a (meta-) vocabulary known as the [*Web Ontology Language* OWL][OWL]. [SKOS🟉][5] was built on top of OWL.

## [Linkification](#linkification)

Process of searching for a term in *[document🟉][3] A* matching a heading phrase in
*document B* and replacing the term in *document A* with a Markdown link pointing
onto the term definition in *document B*.

## [remark](#remark)

[remark]: https://github.com/remarkjs/remark

[remark] is a parser and compiler project under the [unified🟉][7] umbrella for *Markdown* text files in particular.

## [SKOS](#skos)

[SKOS]: http://w3.org/skos/

With [SKOS][8] the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling *Simple Knowledge Organization Systems* such as Glossaries, Thesauri, Taxonomies or Word Nets.

## [slug](#slug)

<!--{ "aliases": "slugs" }-->

A [slug🟉][9] by our definition is a URL-friendly identifier created from arbitrary text that can be used within [URL fragments🟉][10] to address headings / sections on a page.

## [Term Attributes](#term-attributes)

<!--{ "uri": "term attribute, term-attribute" }-->

[Term Attributes🟉][11] are properties passed to glossarify-md using an HTML comment syntax `<!--{...}-->` which encodes a JSON string:

*glossary.md*

```md
# Term
<!--{ "term-attr": "This is a term attribute." }-->
...
```

## [Term Hint](#term-hint)

<!--{ "aliases": "term hint, term-hint" }-->

An optional (symbol-) character like for example `🟉` decorating a term link to distinguish it from a regular link.
See glossarify-md configuration options for details.

## [unified](#unified)

[unified]: https://unifiedjs.com

[unified] is an umbrella project around *text file processing in general*. See also [Conceptual Layers of glossarify-md][12]

## [URL fragment](#url-fragment)

<!-- Aliases: URL fragments -->

The fragment is the part follwing the `#` in a [URL🟉][13].

## [URI / URL](#uri--url)

<!--{ "aliases": "URI, URL" }-->

*Uniform Resource Identifier* and *Uniform Resource Locator* are both the same thing, which is an ID with a syntax `scheme://authority.tld/path/#fragment?query` like `https://my.org/foo/#bar?q=123`. Although both things are the same, the two acronyms are often used to emphasize whether using the ID to primarily *identify* something or using *the same ID* to *also* locate and retrieve a represention of what it identifies.

<!--
For example there's no strict requirement that URIs must resolve to a web page. They are just IDs. However URIs *can* be used to *locate and retrieve* a textual representation *of what they identify* which is when they are often called URL. A *representation* can be a web page. But an URI could als identify a technical device and could be used as an URL to locate a representation of that device in form of a datasheet.

URIs continue to be IDs after a particular representation like the datasheet disappears. This sometimes leads to controversies on whether a certain URL which is also an URI can ever be "reused" to locate something different than what the URI identified.

Strictly spoken: it *should not* because URLs and URIs *are equivalent* and two sides of the same coin. A URL should be reserved to locate and serve a representation of what itself *being a URI* identifies. If it doesn't it no longer identifies *a single* thing but two different things and loses its purpose as *identifier*.

However, it is a matter of fact that URLs and the web page content they identify and locate change thousands of times every day world wide. Because often it simply doesn't matter *what exactly* an URI/URL identifies but just that it identifies and locates *something*. Therefore you may only really care about "durability" of an URI/URL if your audience cares or if you really want to identify a particular thing.

If you're afraid of making a long-term comittment on a particular URI because you "might want to reuse the URL", then there's a simple solution: just add additional elements like "time", "randomness" or "uniqueness" to the URI/URL's `/path/...` or `#fragment` part to make it *unlikely* of being reused for something else.

In case of glossarify-md you could use one of the cryptographic heading ID algorithms like `md5` or `sha256` supported by [`headingIdAlgorithm`][headingIdAlgorithm].

[headingIdAlgorithm]: ../README.md#linkingheadingidalgorithm
-->

## [vuepress](#vuepress)

[vuepress]: https://vuepress.vuejs.org

[vuejs]: https://vuejs.org

[vuepress] is a static website generator translating markdown files into a website powered by [vuejs].

[1]: ../glossarify-md.conf.json

[2]: #json-document "A JSON-Document is a file or resource containing JSON-serialized data object."

[3]: #document "A markdown file not being declared a glossary by means of glossarify-md config option glossaries."

[4]: #json-ld "JSON-LD is a standardized JSON document format for mapping system-specific terms of a JSON-based data format to well-know terms from public vocabularies."

[5]: #skos "With SKOS the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling Simple Knowledge Organization Systems such as Glossaries, Thesauri, Taxonomies or Word Nets."

[6]: #kos-knowledge-organization-systems "Glossaries are considered a kind of Knowledge Organisation System (KOS) which organizes knowledge as a list of terms and term definitions."

[7]: #unified "unified is an umbrella project around text file processing in general."

[8]: https://w3.org/skos

[9]: #slug "A slug by our definition is a URL-friendly identifier created from arbitrary text that can be used within URL fragments to address headings / sections on a page."

[10]: #url-fragment "The fragment is the part follwing the # in a URL."

[11]: #term-attributes "Term Attributes are properties passed to glossarify-md using an HTML comment syntax <!--{...}--> which encodes a JSON string: glossary.md"

[12]: ./conceptual-layers.md

[13]: #uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."
