# [Known Issues: Lists in GitHub Repos](#known-issues-lists-in-github-repos)

[2]: <>

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

On a GitHub repository, though, you'll find that you can navigate within the repository using the list item link in `list.md` but the browser *won't* scroll to the item position `#mylist-foo` in `page.md`. The reason for this is that GitHub sanitizes (see [GFM 🌎][3] Sect.1.1) Markdown files before rendering them within their own repository previews. They allow only a small subset of HTML and strip elements like `<cite>` and other [Semantic HTML Tags 🌎][4] including the element's `id="#mylist-foo"` which a browser needs to be able to scroll to that part of an HTML document. Therefore, if you care for navigability in GitHub repositories, just use supported elements like `<span>` or `<a>` instead.

**This is a limitation of GitHub's repository preview renderer *only*!** It is not a bug in [glossarify-md 🌎][5]. For example, if you were rendering `list.md` and `page.md` with a static website generator like [Jekyll 🌎][6] or [vuepress 🌎][7] things work just fine.

You can even try yourself with [GitHub Pages 🌎][8] which renders `.md` files in a repo to [https://yoursite.github.io][9] using [Jekyll 🌎][6].

[1]: #my-list

[3]: https://github.github.com/gfm/ "GitHub Flavoured Markdown"

[4]: https://www.w3schools.com/html/html5_semantic_elements

[5]: https://github.com/about-code/glossarify-md "This project."

[6]: https://jekyllrb.com "A static website renderer compiling an HTML website from Markdown files."

[7]: https://vuepress.vuejs.org "A static website generator translating markdown files into a website powered by [vuejs]."

[8]: https://pages.github.com/ "GitHub Pages is a static website rendering and publishing service by GitHub Inc."

[9]: https://yoursite.github.io
