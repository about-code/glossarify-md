# [Glossary](#glossary)

This is a glossary with terms to be processed by *glossarify-md* using this
[glossarify-md.conf.json][1] configuration in the root
of this repo. Some terms may be mentioned in other documents in the `./demo`
directory. Glossarified outputs will then be written to [`../doc/`][2].
Term links created from this glossary can be recognised by a *[term hint↴][3]*.

## [URI](#uri)

<!-- Aliases: URL -->

*Uniform Resource Identifier* and *Uniform Resource Locator* describe both the same thing, which is an ID with a syntax `scheme://host.tld/path/#fragment?query` like `https://my.org/foo/#bar?q=123`. The two acronyms are often used to distinguish between two use cases: using the ID to purely identify something or using *the same ID* to *also* locate and retrieve a represention of what it identifies.

For example there's no strict requirement that URIs must resolve to a web page. They are just IDs. However URIs *can* be used to *locate and retrieve* a textual representation *of what they identify* which is when they are often called [URL↴][4]. A *representation* can be a web page. But an [URI↴][4] could als identify a technical device and could be used as an [URL↴][4] to locate a representation of that device in form of a datasheet.

URIs continue to be IDs after a particular representation like the datasheet disappears. This sometimes leads to controversies on whether a certain [URL↴][4] which is also an [URI↴][4] can ever be "reused" to locate something different than what the [URI↴][4] identified.

Strictly spoken: it *should not* because URLs and URIs *are equivalent* and two sides of the same coin. A [URL↴][4] should be reserved to locate and serve a representation of what itself *being a [URI↴][4]* identifies. If it doesn't it no longer identifies *a single* thing but two different things and loses its purpose as *identifier*.

However, it is a matter of fact that URLs and the web page content they identify and locate change thousands of times every day world wide. Because often it simply doesn't matter *what exactly* an [URI↴][4]/[URL↴][4] identifies but just that it identifies and locates *something*. Therefore you may only really care about "durability" of an [URI↴][4]/[URL↴][4] if your audience cares or if you really want to identify a particular thing.

If you're afraid of making a long-term comittment on a particular [URI↴][4] because you "might want to reuse the [URL↴][4]", then there's a simple solution: just add additional elements like "time", "randomness" or "uniqueness" to the [URI↴][4]/[URL↴][4]'s `/path/...` or `#fragment` part to make it *unlikely* of being reused for something else.

In case of glossarify-md you could use one of the cryptographic heading ID algorithms like `md5` or `sha256` supported by [`headingIdAlgorithm`][headingIdAlgorithm].

[headingIdAlgorithm]: ../README.md#linkingheadingidalgorithm

## [unified](#unified)

[unified] is an umbrella project around *text file processing in general*.

[unified]: https://unifiedjs.com

## [remark](#remark)

[remark] is a parser and compiler project under the [unified↴][5] umbrella for *Markdown* text files in particular.

[remark]: https://github.com/remarkjs/remark

## [vuepress](#vuepress)

[vuepress] is a static website generator translating markdown files into a website powered by [vuejs].

[vuejs]: https://vuejs.org

[vuepress]: https://vuepress.vuejs.org

## [slug](#slug)

A [slug↴][6] by our definition is a URL-friendly identifier created from arbitrary text that can be used within [URL↴][4] fragments to address headings / sections on a page.

## [URL fragment](#url-fragment)

<!-- Aliases: URL fragments -->

URLs have a structure `scheme://domain.topleveldomain[/path][#fragment][?query[&query]]`. The fragment is the part follwing the `#` ([URL↴][4] hash).

## [Term Hint](#term-hint)

An optional (symbol-) character like for example `↴` decorating a term link to distinguish it from a regular link.
See glossarify-md configuration options for details.

## [Linkification](#linkification)

Process of searching for a term in *document A* matching a heading phrase in
*document B* and replacing the term in *document A* with a Markdown link pointing
onto the term definition in *document B*.

[1]: ../glossarify-md.conf.json

[2]: ../doc/

[3]: #term-hint "An optional (symbol-) character like for example ↴ decorating a term link to distinguish it from a regular link."

[4]: #uri "Uniform Resource Identifier and Uniform Resource Locator describe both the same thing, which is an ID with a syntax scheme://host.tld/path/#fragment?query like https://my.org/foo/#bar?q=123."

[5]: #unified "unified is an umbrella project around text file processing in general."

[6]: #slug "A slug by our definition is a URL-friendly identifier created from arbitrary text that can be used within URL fragments to address headings / sections on a page."
