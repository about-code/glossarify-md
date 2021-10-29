# [Known Issues: Lists in GitHub Repos](#known-issues-lists-in-github-repos)

Addendum to [Section *Lists* in README.md][1]

Assume we have generated a `list.md` file

> ## [My List](#my-list)
>
> *   [List item title][2]

from documents declaring

```md
... lot's of text here...
<cite id="mylist-foo">List item title</cite>
```

where `cite` is at the bottom of a larger file `page.md`.

After uploading `list.md` and `page.md` to a GitHub repository you may find that you can navigate within the repository using the list item link in `list.md` but the browser won't scroll to the item position `#mylist-foo` in `page.md`.

This is because [GitHub] *sanitizes* Markdown files before rendering them within the their own repository website. Their preview allows only a small set of HTML and strips elements like `<cite>` and other [Semantic HTML Tags][3]. Thus the browser won't find our element `id="#mylist-foo"` and can't scroll to it. If you care for navigability on GitHub previews use supported elements like `<span>` or `<a>`, only.

**This is a limitation of GitHub's preview renderer *only* !** It is not a bug in [glossarify-md][4]. For example, if you render `list.md` and `page.md` to HTML using a static website generator like [Jekyll] or [vuepress] things work just fine.

You can even try yourself with [GitHub Pages] which renders `.md` files in a repo to [https://yoursite.github.io][5] using [Jekyll].

[GitHub]: https://github.com

[GitHub Pages]: https://docs.github.com/en/github/working-with-github-pages

[Jekyll]: https://jekyllrb.com

[vuepress]: https://vuepress.vuejs.org

[1]: ../README.md#lists

[2]: <>

[3]: https://www.w3schools.com/html/html5_semantic_elements

[4]: #

[5]: https://yoursite.github.io
