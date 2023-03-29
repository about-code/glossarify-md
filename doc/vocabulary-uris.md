# [URIs as Identifiers for *Definitions of Meaning*](#uris-as-identifiers-for-definitions-of-meaning)

<!--
aliases: Vocabulary URIs
-->

Consider a term *skin*. In human medicine it's a term for a human organ while in computer science its often used to refer to a software's look and feel. These kinds of *ambiguities* demand *clarification* which is what glossaries are meant for, of course.

*A computer program* can't understand a natural language description of a term's meaning. What it is good at is comparing and distingushing *symbols*. With unique IDs like

*   `https://example.com/glossary/medicine/#skin`
*   `https://example.com/glossary/computer-science/#skin`.

a computer can operate on symbols equivalent to *some meaning* without having to know the exact meaning. Such IDs can then be used, for example, to establish relationships between semantic concepts (like `xID not-equal yID`). Semantic modeling goes beyond glossaries. Assigning glossary terms unique IDs, though, enables using them in other technical implementations of knowledge organization systems such as thesauri, taxonomies or word nets.

**Since v6.0.0** glossarify-md supports [exporting][1] and [importing][2] glossaries (see also Interoperability with [SKOS 🌎][3] and [JSON-LD 🌎][4]).

## [Vocabulary URIs and Term URIs](#vocabulary-uris-and-term-uris)

`glossaries` entries can be augmented with a `uri` [config option][5] which assigns a glossary a so-called *[vocabulary][6] [URI][7]*. Then on [exporting][1] *term URIs* can be derived from the vocabulary URI and a term's *heading ID* by appending the heading ID to the vocabulary URI (see config option `headingIdAlgorithm`) for how glossarify-md generates heading IDs).

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

If you need more control about a term's Term [URI][7], then there are two switches you can tweak:

*   providing a custom heading ID using pandoc-style `{#headingId}`
*   providing a `uri` [term attribute][8]

*Custom heading ID*

```md
# Glossary

## Term {#custom-heading-id}

Term with an individual URI.
```

*`uri` [term attribute][8]*:

```md
# Glossary

## Term
<!-- uri: http://my.org/special/12345 -->

Term with an individual URI.
```

# [Addendum: Properties of URIs](#addendum-properties-of-uris)

### [Resolvability](#resolvability)

URIs can be *just identifiers*. But URIs can also be used to *locate and retrieve* representations of what they identify over a network protocol like HTTPS. For example, a web browser and a term's [URI][7] could be used to retrieve an HTML representation with a human readable definition of a term. A `glossaries` entry with `linkUris: true` will make glossarify-md link term occurrences with a *book-external* authoritative definition on the web rather than with the book-internal glossary. On imported glossaries `showUris: true` or `showUris: "${uri}"` will render URI links in the markdown glossary generated from imported terms.

### [Authority](#authority)

URIs for terms reveal the authoritative source for a particular definition, which in our example was `example.com`. While anyone could use any domain name in an [URI][7] and make it the identifier of something (like we did in our examples) only the legitimate domain name owner as registered in the Domain Name System (DNS) can claim authority in case of disputes over some definition.

So in this particular example we could *not* veto if the owners of domain `example.com` chose to use above URIs to identify something else. By using another domain name than our own we effectively accept that there could be conflicting definitions wiping out the purpose of an [URI][7]. So particularly when publishing a [vocabulary][6] it is usually not a good idea to use someone else's domain.

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

[1]: https://github.com/about-code/glossarify-md/blob/master/doc/export.md#export "Since v6.0.0 Exporting makes glossarify-md generate and write a structured representation of a markdown glossary to the output directory."

[2]: https://github.com/about-code/glossarify-md/blob/master/doc/import.md#importing-terms "⚠ Important: glossarify-md is able to import terms and definitions from a remote location using https, when configured this way."

[3]: http://w3.org/skos/ "With the Simple Knowledge Organization System (SKOS) the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling Simple Knowledge Organization Systems such as Glossaries, Thesauri, Taxonomies or Word Nets."

[4]: https://json-ld.org "JSON-LD is a standardized JSON document format for mapping system-specific terms of a JSON-based data format to well-know terms from public vocabularies."

[5]: https://github.com/about-code/glossarify-md/blob/master/conf/README.md

[6]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#vocabulary "A collection of terms which is uniquely identifiable."

[7]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[8]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term-attribute "Term Attributes are passed in a comment following a term's heading."
