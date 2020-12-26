# [Using glossarify-md with vuepress](#using-glossarify-md-with-vuepress)

Below we assume a *sample* project structure like this:

    ${root}
       +- docs/
       |   +- .vuepress/
       |   |   |- public/
       |   |   '- config.js
       |   |
       |   +- images/
       |   |   '...
       |   +- section-1/
       |   |   |- page-1.md
       |   |   |- page-2.md
       |   |   '- page-3.md
       |   |
       |   '- glossary.md
       |
       +- docs-glossarified/           (Generated)
       +- node_modules/
       |- glossarify-md.conf.json
       |- package.json
       '- .gitignore

## [Install into your project](#install-into-your-project)

    npm i --save glossarify-md

## [Configure glossarify-md](#configure-glossarify-md)

*glossarify-md.conf.json*

```json
{
    "$schema": "./node_modules/glossarify-md/conf/v5/schema.json",
    "baseDir": "./docs",
    "outDir": "../docs-glossarified",
    "glossaries": [
        { "file": "./glossary.md", "termHint": "↴"},
    ]
}
```

> **Notes**
>
> ☛ All relative paths inside the config file are being interpreted
> relativ to `baseDir` except for `$schema` which is relative to the config file.

## [Configure vuepress](#configure-vuepress)

*.[vuepress∗][1]/config.js*

```js
const glossarify = require("glossarify-md");
module.exports = {
    /* ... */
    markdown: {
      slugify: glossarify.getSlugger()
    }
};
```

Details on why we have to change [vuepress∗][1]'s own [slug∗][2] algorithm can be found in [Appendix][3].

> **Notes**
>
> ⚠ Changing the slug algorithm could be a **breaking change** for published docs. URLs or URL fragments could change. Bookmarks of your readers may no longer work as expected. If this is important to you or your readers verify the outcome carefully before you publish your changes.
>
> ⚠ For headings with unicode characters, e.g. `# Äquator` vuepress generates HTML anchors with *ASCII* characters which you'd refer to by links `[Äquator](#aquator)`. [glossarify-md] allows unicode characters in fragments and requires you to refer to the same heading by `[Äquator](#äquator)` so by a fragment beginning with #**ä**.

## [Configure Build Scripts](#configure-build-scripts)

*package.json*

```json

"scripts": {
  "glossarify": "glossarify-md --config ./glossarify-md.conf.json",
  "start": "vuepress dev docs",
  "glossarified": "npm run glossarify && vuepress dev docs-glossarified",
  "build": "npm run glossarify && vuepress build docs-glossarified",
}
```

*   `npm start` builds and serves files with *live-reload* from `"baseDir": "./docs"`.

This is what you probably want while writing.

*   `npm run glossarified` builds and serves the glossarified version from `"outDir": "../docs-glossarified"`. There's no live-reload.

*   `npm run build` just builds the glossarified version without running a server.

More information see [README.md][4].

## [Appendix](#appendix)

### [Why glossarify-md requires changing vuepress's slugify algorithm:](#why-glossarify-md-requires-changing-vuepresss-slugify-algorithm)

[glossarify-md] requires a [slug∗][2] algorithm to create friendly URL fragments (#...) for section links. When [vuepress∗][1] translates *glossarified markdown* to HTML it does the same once again for the same purpose. If both tools use different [slug∗][2] algorithms then there's the risk of both generating different fragments which can break links in some situations ([#27][5]). So it's best to configure [vuepress∗][1] to use the same slugger as [glossarify-md].

> **☛ Note:** If you decide to drop [glossarify-md] later you might not want to have slugs change again. [glossarify-md] uses [github-slugger][6] internally. You can use it directly like so:
>
> *.vuepress/config.js*
>
> ```js
>  const GitHubSlugger = require("github-slugger");
>  module.exports = {
>      /* ... */
>      markdown: {
>        slugify: (value) => {
>          const slugifier = new GitHubSlugger();
>          return slugifier.slug(value);
>        }
>      }
>  };
> ```

[vuepress]: https://vuepress.vuejs.org

[glossarify-md]: https://github.com/about-code/glossarify-md

[1]: ./glossary.md#vuepress "vuepress is a static website generator translating markdown files into a [vuejs]-powered site."

[2]: ./glossary.md#slug "URLs have a structure scheme://domain.tld/path/#fragment?query&query."

[3]: #appendix

[4]: ../README.md

[5]: https://github.com/about-code/glossarify-md/issues/27

[6]: https://npmjs.com/package/github-slugger
