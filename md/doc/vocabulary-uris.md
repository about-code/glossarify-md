# Vocabulary and Term URIs

[glossarify-md]: https://github.com/about-code/glossarify-md/
[headingidalgorithm]: ../README.md#headingidalgorithm

**Since v6.0.0** [glossarify-md] supports an `uri` option for glossaries (*vocabulary URI*):

~~~json
{
  "glossaries": [{
      "uri": "http://my.org/vocabulary/",
      "file": "./glossary.md"
  }]
}
~~~

With the `uri` option [glossarify-md] maps terms onto identifiers using the vocabulary URI as a base URI for appending a term's heading ID (see [headingidalgorithm]). Exceptions to this rule are possible with the `uri` term attribute:

*glossary.md*
~~~md
# Glossary

## Term
<!--{ "uri": "http://my.org/special/12345" }-->

Term with an individual URI.
~~~

If you are interested in the rationale behind URIs enjoy reading on.


## Identifiers for *Definitions of Meaning*

Consider bankers and IT professionals talking about *security*. Since the term is used differently in the banking domain than it is used in computer science its *ambiguity* can cause some confusion among these people. As a consequence the term demands *clarification* of its particular meaning when being used. That's what glossaries are meant for, of course. Technically such kind of clarification can be achieved using IDs to uniquely identify *one particular definition of meaning*.

Uniform Resource Identifiers (URIs) do fit very well for that purpose. For example whenever we use the URI `https://banking-example.com/vocab/#security` it is clear that we refer to the meaning defined by `banking-example.com` and when using `https://it-example.com/vocab/#security` we refer to the meaning defined by `it-example.com`.

While anyone could use any domain name in an URI and make it the identifier of something, only the legitimate domain name owner as registered by the domain name system can claim authority in case of disputes over some definition.

While not a requirement as a *publisher* you might enjoy that URIs could be used to *locate and retrieve* technical representations of a term definition over a network protocol like HTTP. For example a web browser could be used to locate and retrieve an HTML representation that can be rendered in the browser. Other possible representations (data formats) are possible, of course, e.g.

  - a plain text representation
  - a Markdown text representation
  - a structured JSON representation
  - and so forth...
