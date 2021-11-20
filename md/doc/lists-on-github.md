# Known Issues: Lists in GitHub Repos

[doc-readme-lists]: ../README.md#lists
[glossarify-md]: https://github.com/about-code/glossarify-md
[gfm-sanitize]: https://github.github.com/gfm/#what-is-github-flavored-markdown-
[gh-pages]: https://pages.github.com/
[html-sem-tags]: https://www.w3schools.com/html/html5_semantic_elements
[Jekyll]: https://jekyllrb.com
[vuepress]: https://vuepress.vuejs.org
[2]: <>

Addendum to [Section *Lists* in README.md][doc-readme-lists]

We assume you have generated a `list.md` file using a `listOf` config:

> ## [My List](#my-list)
>
> *   [List item title][2]

The list item was generated from a document with an element

```md
... lot's of text here...
<cite id="mylist-foo">List item title</cite>
```

where `cite` is at the bottom of a larger file `page.md` and, initially, *out of the visible viewport* of a browser.
Normally, when converting such markdown to HTML using a Markdown-to-HTML static page renderer you would expect the list item link to be a link which targets the document *but also* make the browser scroll to make the targeted section part of the visible viewport.

On a GitHub repository, though, you'll find that you can navigate within the repository using the list item link in `list.md` but the browser *won't* scroll to the item position `#mylist-foo` in `page.md`. The reason for this is that GitHub *[sanitizes][gfm-sanitize]* Markdown files before rendering them within their own repository previews. They allow only a small subset of HTML and strip elements like `<cite>` and other [Semantic HTML Tags][html-sem-tags] including the element's `id="#mylist-foo"` which a browser needs to be able to scroll to that part of an HTML document. Therefore, if you care for navigability in GitHub repositories, just use supported elements like `<span>` or `<a>` instead.

**This is a limitation of GitHub's repository preview renderer *only*!** It is not a bug in [glossarify-md]. For example, if you were rendering `list.md` and `page.md` with a static website generator like [Jekyll] or [vuepress] things work just fine.

You can even try yourself with [GitHub Pages][gh-pages] which renders `.md` files in a repo to https://yoursite.github.io using [Jekyll].
