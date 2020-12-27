# Glossary

This is a glossary with terms to be processed by *glossarify-md* using this
[glossarify-md.conf.json](../glossarify-md.conf.json) configuration in the root
of this repo. Some terms may be mentioned in other documents in the `./demo`
directory. Glossarified outputs will then be written to [`../doc/`](../doc/).
Term links created from this glossary can be recognised by a *term hint*.

## unified

[unified] is an umbrella project around *text file processing in general*.

[unified]: https://unifiedjs.com

## remark

[remark] is a parser and compiler project under the unified umbrella for *Markdown* text files in particular.

[remark]: https://github.com/remarkjs/remark

## vuepress

[vuepress] is a static website generator translating markdown files into a website powered by [vuejs].

[vuejs]: https://vuejs.org
[vuepress]: https://vuepress.vuejs.org

## slug

URLs have a structure `scheme://domain.tld/path/#fragment?query&query`.
A slug - by this definition - is a URL-friendly identifier that can be used within URL fragments to address content in a web page, e.g sections.

## Term Hint

An optional (symbol-) character like for example `↴` decorating a term link to distinguish it from a regular link.
See glossarify-md configuration options for details.

## Linkification

Process of searching for a term in *document A* matching a heading phrase in
*document B* and replacing the term in *document A* with a Markdown link pointing
onto the term definition in *document B*.
