## Generating Files: Book Index

*glossarify-md.conf.json*

```json
"generateFiles": {
    "indexFile": {
       "file": "./book-index.md",
       "title": "Book Index"
    }
}
```

This option will generate a single book index file `./book-index.md` with glossary terms and links to book sections in which they have been mentioned. By default items will be grouped *by section of occurrence* using the section heading as a group title. You can disable or affect granularity of section-based grouping using:

```json
"indexing": {
    "groupByHeadingDepth": 0
}
```

> **ⓘ Note**: The `groupByHeadingDepth` option also affects grouping of list items in [Lists](#lists).

Let's assume you have multiple glossaries and you want to create separate book indexes from terms of those glossaries. **Since v5.1.0** you can use `indexFiles` (plural) like this:

```json
"generateFiles": {
    "indexFiles": [{
      "title": "Book Index for Glossary 1",
      "file": "./book-index-1.md",
      "glossary": "./glossary-1.md"
    },{
      "title": "Book Index for Glossary 2",
      "file": "./book-index-2.md",
      "glossary": "./glossary-2.md"
    }]
}
```

> **ⓘ Note:** If you plan on translating markdown to HTML, e.g. with [vuepress](https://vuepress.vuejs.org), be aware that a file `index.md` will translate to `index.html` which is typically reserved for the default HTML file served under a domain. We recommend you choosing another name.
