# [URIs as Identifiers for *Definitions of Meaning*](#uris-as-identifiers-for-definitions-of-meaning)

[headingIdAlgorithm]: ../README.md#headingidalgorithm

[doc-import]: ../README.md#structured-export-and-import

[doc-skos]: ./skos-interop.md

Consider a [term][1] *skin*. In human medicine it's a term for a human organ while in computer science its often used to refer to a software's look and feel. These kinds of *ambiguities* demand *clarification* which is what glossaries are meant for, of course.

*A computer program* can't understand a natural language description of a [term][1]'s meaning. What it is good at is comparing and distingushing *symbols*. With unique IDs like

*   `https://example.com/glossary/medicine/#skin`
*   `https://example.com/glossary/computer-science/#skin`.

a computer can operate on symbols equivalent to *some meaning* without having to know the exact meaning. Such IDs can then be used, for example, to establish relationships between semantic concepts (like `xID not-equal yID`). Semantic modeling goes beyond glossaries. Assigning [glossary][2] terms unique IDs, though, enables using them in other technical implementations of knowledge organization systems such as thesauri, taxonomies or word nets.

**Since v6.0.0** [glossarify-md🌎][3] supports [exporting and importing][doc-import] glossaries (see also [Interoperability with SKOS and JSON-LD][doc-skos]).

## [Vocabulary URIs and Term URIs](#vocabulary-uris-and-term-uris)

`glossaries` entries can be augmented with a `uri` [config option][4] which assigns a [glossary][2] a so-called *[vocabulary][5] [URI][6]*. Then on [exporting][7] *[term][1] URIs* can be derived from the vocabulary URI and a term's *heading ID* by appending the heading ID to the vocabulary URI (see [headingIdAlgorithm] for how [glossarify-md🌎][3] generates heading IDs).

```json
{
  "glossaries": [{
      "uri": "http://my.org/vocabulary/#",
      "file": "./glossary.md",
      "export": {
        "file": "./exported.json"
      }
  }]
}
```

If you need more control about a [term][1]'s Term [URI][6], then there are two switches you can tweak:

*   providing a custom heading ID using pandoc-style `{#headingId}`
*   providing a `uri` [term][1] attribute

*Custom heading ID*

```md
# Glossary

## Term {#custom-heading-id}

Term with an individual URI.
```

*`uri` [term][1] attribute*:

```md
# Glossary

## Term
<!-- uri: http://my.org/special/12345 -->

Term with an individual URI.
```

# [Addendum: Properties of URIs](#addendum-properties-of-uris)

### [Resolvability](#resolvability)

URIs can be *just identifiers*. But URIs can also be used to *locate and retrieve* representations of what they identify over a network protocol like HTTPS. For example, a web browser and a [term][1]'s [URI][6] could be used to retrieve an HTML representation with a human readable definition of a term. A `glossaries` entry with `linkUris: true` will make [glossarify-md🌎][3] link term occurrences with a *book-external* authoritative definition on the web rather than with the book-internal [glossary][2]. On [imported][doc-import] glossaries `showUris: true` or `showUris: "${uri}"` will render URI links in the markdown glossary generated from imported terms.

### [Authority](#authority)

URIs for terms reveal the authoritative source for a particular definition, which in our example was `example.com`. While anyone could use any domain name in an [URI][6] and make it the identifier of something (like we did in our examples) only the legitimate domain name owner as registered in the Domain Name System (DNS) can claim authority in case of disputes over some definition.

So in this particular example we could *not* veto if the owners of domain `example.com` chose to use above URIs to identify something else. By using another domain name than our own we effectively accept that there could be conflicting definitions wiping out the purpose of an [URI][6]. So particularly when publishing a [vocabulary][5] it is usually not a good idea to use someone else's domain.

<!--
Uniform Resource Names (URNs) may be an alternative to URIs. They do not depend on the Domain Name System as a registry but on an IANA registry of *URN namespaces*:

*URN with the `isbn` namespace registered by the International ISBN Agency*
~~~
urn:isbn:978-951-0-18435-6
~~~

It is not as easy to register a URN namespace than it is to register a domain name. But there are a few namespaces representing *ID algorithms*. Particularly the UUID namespace represents elements identified by the open and standardized *Universally Unique Identifier* (RFC 4122). UUIDs can be produced by anyone and the `uuid` namespace can be used with any UUID in the world:

*URN with the `uuid` namespace*
~~~
urn:uuid:b3c38d70-3887-11ec-a63d-779a5e093fff
~~~
-->

[1]: ./glossary.md#term "Terms are headings in a markdown file which has been configured to be a glossary file."

[2]: https://github.com/about-code/glossarify-md/tree/master/doc/glossary.md

[3]: https://github.com/about-code/glossarify-md "This project."

[4]: https://github.com/about-code/glossarify-md/tree/master/conf/README.md

[5]: ./glossary.md#vocabulary "A collection of terms which is uniquely identifiable."

[6]: ./glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[7]: https://github.com/about-code/glossarify-md/tree/master/doc/export.md
