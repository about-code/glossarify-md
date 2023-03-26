# [URIs as Identifiers for *Definitions of Meaning*](#uris-as-identifiers-for-definitions-of-meaning)

<!--
aliases: Vocabulary URIs
-->

Consider a [term][1] *skin*. In human medicine it's a term for a human organ while in computer science its often used to refer to a software's look and feel. These kinds of *ambiguities* demand *clarification* which is what glossaries are meant for, of course.

*A computer program* can't understand a natural language description of a [term][1]'s meaning. What it is good at is comparing and distingushing *symbols*. With unique IDs like

*   `https://example.com/glossary/medicine/#skin`
*   `https://example.com/glossary/computer-science/#skin`.

a computer can operate on symbols equivalent to *some meaning* without having to know the exact meaning. Such IDs can then be used, for example, to establish relationships between semantic concepts (like `xID not-equal yID`). Semantic modeling goes beyond glossaries. Assigning glossary terms unique IDs, though, enables using them in other technical implementations of knowledge organization systems such as thesauri, taxonomies or word nets.

**Since v6.0.0** [glossarify-md][2] supports [exporting][3] and [importing][4] glossaries (see also Interoperability with [SKOS 🌎][5] and [JSON-LD 🌎][6]).

## [Vocabulary URIs and Term URIs](#vocabulary-uris-and-term-uris)

`glossaries` entries can be augmented with a `uri` [config option][7] which assigns a glossary a so-called *[vocabulary][8] [URI][9]*. Then on [exporting][3] *[term][1] URIs* can be derived from the vocabulary [URI][10] and a term's *heading ID* by appending the heading ID to the vocabulary URI (see config option `headingIdAlgorithm`) for how [glossarify-md][2] generates heading IDs).

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

If you need more control about a [term][1]'s Term [URI][9], then there are two switches you can tweak:

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

URIs can be *just identifiers*. But URIs can also be used to *locate and retrieve* representations of what they identify over a network protocol like HTTPS. For example, a web browser and a [term][1]'s [URI][9] could be used to retrieve an HTML representation with a human readable definition of a term. A `glossaries` entry with `linkUris: true` will make [glossarify-md][2] link term occurrences with a *book-external* authoritative definition on the web rather than with the book-internal glossary. On imported glossaries `showUris: true` or `showUris: "${uri}"` will render [URI][10] links in the markdown glossary generated from imported terms.

### [Authority](#authority)

URIs for terms reveal the authoritative source for a particular definition, which in our example was `example.com`. While anyone could use any domain name in an [URI][9] and make it the identifier of something (like we did in our examples) only the legitimate domain name owner as registered in the Domain Name System (DNS) can claim [authority][11] in case of disputes over some definition.

So in this particular example we could *not* veto if the owners of domain `example.com` chose to use above URIs to identify something else. By using another domain name than our own we effectively accept that there could be conflicting definitions wiping out the purpose of an [URI][9]. So particularly when publishing a [vocabulary][8] it is usually not a good idea to use someone else's domain.

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

[1]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term "Terms are headings in a markdown file which has been configured to be a glossary file."

[2]: https://github.com/about-code/glossarify-md

[3]: https://github.com/about-code/glossarify-md/blob/master/doc/export.md#export "Since v6.0.0 Exporting makes glossarify-md generate and write a structured representation of a markdown glossary to the output directory."

[4]: https://github.com/about-code/glossarify-md/blob/master/doc/import.md#importing-terms "⚠ Important: glossarify-md is able to import terms and definitions from a remote location using https."

[5]: http://w3.org/skos/ "With the Simple Knowledge Organization System (SKOS) the World Wide Web Consortium (W3C) has standardized a (meta-)vocabulary which is suited and intended for modeling Simple Knowledge Organization Systems such as Glossaries, Thesauri, Taxonomies or Word Nets."

[6]: https://json-ld.org "JSON-LD is a standardized JSON document format for mapping system-specific terms of a JSON-based data format to well-know terms from public vocabularies."

[7]: https://github.com/about-code/glossarify-md/blob/master/conf/README.md

[8]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#vocabulary "A collection of terms which is uniquely identifiable."

[9]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[10]: https://github.com/about-code/glossarify-md/blob/master/doc/term-attributes.md#uri "A unique identifier for the term and the definition of it's meaning."

[11]: https://github.com/about-code/glossarify-md/blob/master/doc/vocabulary-uris.md#authority "URIs for terms reveal the authoritative source for a particular definition, which in our example was example.com."
