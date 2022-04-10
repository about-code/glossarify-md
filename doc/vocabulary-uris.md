# [URIs as Identifiers for *Definitions of Meaning*](#uris-as-identifiers-for-definitions-of-meaning)

[headingIdAlgorithm]: ../README.md#headingidalgorithm

[doc-import]: ../README.md#structured-export-and-import

[doc-skos]: ./skos-interop.md

Consider bankers and IT professionals talking about *security*. Since the [term🟉][1] is used differently in the banking domain than it is being used in computer science its *ambiguity* can cause some confusion among these people. As a consequence the term demands *clarification* of its particular meaning when being used. Of course, that's what glossaries are meant for.

*For a computer* such kind of clarification can be achieved using *IDs* to *uniquely identify one particular definition of meaning*. Uniform Resource Identifiers (URIs) do fit well for that purpose. For example whenever a system processes an [URI🟉][2]

*   `https://example.com/glossary/banking/#security`

it is clear that it refers to a different meaning than some identifier

*   `https://example.com/glossary/it/#security`.

**Since v6.0.0** [glossarify-md…][3] supports [exporting and importing][doc-import] glossaries. Moreover it introduces an `uri` option for `glossaries` which assigns a glossary a *[vocabulary🟉][4] [URI🟉][2]*. Then *exported* [term🟉][1] URIs will be constructed from the vocabulary URI and a term's heading ID (see [headingIdAlgorithm]).

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

If you need more control about a [term🟉][1]'s [URI🟉][2] then explicit heading IDs can be assigned using pandoc-style `{#headingId}` or the `uri` *term attribute*:

*glossary.md*

```md
# Glossary

## Term
<!--{ "uri": "http://my.org/special/12345" }-->

Term with an individual URI.
```

## [Properties of URIs](#properties-of-uris)

### [Resolvability](#resolvability)

URIs can be *just identifiers*. But URIs can also be used to *locate and retrieve* representations of what they identify over a network protocol like HTTPS. For example, a web browser and a [term🟉][1]'s [URI🟉][2] could be used to retrieve an HTML representation with a human readable definition of a term. A `glossaries` entry with `linkUris: true` will make [glossarify-md…][3] link term occurrences with a *book-external* authoritative definition on the web rather than with the book-internal glossary. On [imported][doc-import] glossaries `showUris: true` or `showUris: "${uri}"` will render URI links in the markdown glossary generated from imported terms.

### [Authority](#authority)

URIs for terms reveal the authoritative source for a particular definition, which in our example was `example.com`. While anyone could use any domain name in an [URI🟉][2] and make it the identifier of something (like we did here) only the legitimate domain name owner as registered in the Domain Name System (DNS) can claim authority in case of disputes over some definition. So in this particular example we could *not* veto if the owners of domain `example.com` chose to use above URIs to identify something else. By using another domain name than our own we effectively accept that there could be conflicting definitions wiping out the purpose of an URI. So particularly when publishing a [vocabulary🟉][4] it is usually not a good idea to do so.

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

If you have a background in [Linked Data…][5] and Semantic Web technologies you might also be interested in reading about [SKOS Interoperability with JSON-LD][doc-skos].

[1]: ./glossary.md#term "A term is a heading in a markdown file which is passed to glossarify-md as a glossary."

[2]: ./glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator are both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[3]: https://github.com/about-code/glossarify-md "This project."

[4]: ./glossary.md#vocabulary "A collection of terms which is uniquely identifiable."

[5]: https://www.w3.org/standards/semanticweb/ontology "See Linked Data."
