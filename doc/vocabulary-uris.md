# [Vocabulary and Term URIs](#vocabulary-and-term-uris)

[glossarify-md]: https://github.com/about-code/glossarify-md/

[headingidalgorithm]: ../README.md#headingidalgorithm

[iana-urns]: https://www.iana.org/assignments/urn-namespaces/urn-namespaces.xhtml

[doc-import]: ../README.md#structured-export-and-import

**Since v6.0.0** [glossarify-md] supports an `uri` option for glossaries (*vocabulary [URI🟉][1]*):

```json
{
  "glossaries": [{
      "uri": "http://my.org/vocabulary/",
      "file": "./glossary.md"
  }]
}
```

With the `uri` *config option* [glossarify-md] maps terms onto identifiers using the vocabulary [URI🟉][1] as a base URI for appending a term's heading ID (see [headingidalgorithm]). Exceptions to this rule are possible with the `uri` *term attribute*:

*glossary.md*

```md
# Glossary

## Term
<!--{ "uri": "http://my.org/special/12345" }-->

Term with an individual URI.
```

## [Identifiers for *Definitions of Meaning*](#identifiers-for-definitions-of-meaning)

Consider bankers and IT professionals talking about *security*. Since the term is used differently in the banking domain than it is used in computer science its *ambiguity* can cause some confusion among these people. As a consequence the term demands *clarification* of its particular meaning when being used. That's what glossaries are meant for, of course. Technically such kind of clarification can be achieved using IDs to uniquely identify *one particular definition of meaning*.

Uniform Resource Identifiers (URIs) do fit very well for that purpose. For example whenever we use the [URI🟉][1] `https://example.com/vocab/banking/#security` it is clear that we refer to a different meaning than some identifier `https://example.com/vocab/it/#security`.

While not a requirement as a *publisher* you might enjoy that URIs could be used to *locate and retrieve* technical representations of a term definition over a network protocol like HTTP. For example a web browser could be used to locate and retrieve an HTML representation that can be rendered in the browser. Other representations (data formats) are possible, of course, e.g.

*   a plain text representation
*   a Markdown text representation
*   a structured JSON representation
*   and so forth...

If you have a background in Linked Data and Semantic Web technologies you might also be interested in reading about [SKOS Interoperability with JSON-LD][2].

#### [Authority](#authority)

URIs also reveal the authoritative source for a particular definition, which in our example was `example.com`. While anyone could use any domain name in an [URI🟉][1] and make it the identifier of something (like we did here) only the legitimate domain name owner as registered in the Domain Name System (DNS) can claim authority in case of disputes over some definition. So in this particular example we could *not* veto if the owners of domain `example.com` chose to use above URIs to identify something else. By using another domain name than our own we effectively accept that there could be conflicting definitions wiping out the purpose of an URI. So particularly when publishing a vocabulary it is usually not a good idea to do so.

You can use `linkUris: true` config option of a `glossaries` entry to link term occurrences found in a glossarified markdown book with their *book-external* authoritative definition on the web. With `linkUris: false` (default) glossarify-md will link term occurrences internally within the book. On [imported][doc-import] glossaries you can set `showUris: true` or `showUris: "${uri}"` to render term URIs in the generated markdown glossary.

<!--
Uniform Resource Names (URNs) may be an alternative to URIs. They do not depend on the Domain Name System as a registry but on an [IANA registry of *URN namespaces*][iana-urns]:

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

[1]: ./glossary.md#uri--url "Uniform Resource Identifier and Uniform Resource Locator describe both the same thing, which is an ID with a syntax scheme://authority.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[2]: ./skos-interop.md
