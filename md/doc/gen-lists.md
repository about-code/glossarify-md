### Generating Files: Lists

[CommonMark]: https://commonmark.org
[GFM]: https://github.github.com/gfm/

You can generate **arbitrary lists from HTML elements with an `id` attribute** and an element *classifier* to compile similar elements into the same list.

<a id="video-tutorial-part-one"></a>
*Example: Markdown document with a video element*
```md
More details see our video tutorial:

<video
  src="tutorial-1.mp4"
  id="tutorial-part-1"
  class="video"
  title="Tutorial Part 1">
</video>
```
Then to generate a *List of Videos* from all elements of `class="video"` add to your *glossarify-md.conf.json*:

```json
"generateFiles": {
    "listOf": [{
        "class": "video",
        "title": "List of Videos",
        "file": "./videos.md"
    }]
}
```

After running glossarify-md there will be a file:

*docs-glossarified/videos.md (generated)*
> ## List of Videos
>
> - [Tutorial Part 1](#video-tutorial-part-1)

You can **type less** when prefixing ids with your list classifier:

~~~md
<video
  id="video-tutorial-part-1"
  title="Tutorial Part 1"
  src="tutorial-1.mp4">
</video>
~~~

Without a `title` attribute the tool attempts to derive a list item label from an elements inner text content:

~~~md
<video id="video-tutorial-part-1" src="tutorial-1.mp4">
   Tutorial Part 1
</video>
~~~

Use *invisible* HTML anchors to generate lists from and navigate to text content:

~~~md
<a id="tutorial-part-1" title="Tutorial Part 1"></a>
This is not a video tutorial but a textual tutorial. The body of text can be navigated to from a List of Tutorials and uses the classifier *tutorial*.
~~~

> **ⓘ Note:** If you find the browser not scrolling correctly when navigating lists on GitHub, please read [Known Issues: Lists in GitHub Repos](https://github.com/about-code/glossarify-md/blob/master/doc/lists-on-github.md).

<!--
**Link label extraction**

The link label for list items will be inferred in this order (first-match):

> 1. `title` attribute value (`<tag id="..." "title"="label"></tag>`)
> 1. Inner text of anchor tag (`<tag id="...">label</tag>`)
> 1. `id` attribute value, yet without list prefix (`<tag id="prefix-label"></tag>`)
> 1. Preceding section heading if `id` is just the list prefix (`<tag id="prefix"></tag>`)
> 1. Filename if `id` is just the list prefix and there is no preceding section heading.
-->

### List of Figures

In the previous section we used [`listOf`](#generating-files-lists) to generate a list *from HTML elements* inside Markdown. Writing HTML can be annoying, particularly if there is handier Markdown syntax for the elements to be listed. This is where `listOfFigures` and [`listOfTables`](#list-of-tables) fit in. It is a shortcut which makes glossarify-md generate the HTML anchor itself from Markdown's image syntax:

```md
![List item Label](./figure.png)
```

Then you may only need to use HTML for dynamically rendered figures, e.g. a PlantUML diagram:

````md
<figure id="figure-gen">Dynamically Rendered Diagram</figure>

```plantuml
@startuml
... your PlantUML diagram code ...
@enduml
```
````

To compile both figures into the same list one way to configure glossarify-md is to declare a `listOf` class *figure* (for HTML elements) and tell `listOfFigures` (for `![]()` images) to use the same classifier *figure*:

*glossarify-md.conf.json* (since v5.0.0)

```json
"generateFiles": {
    "listOf": [{
        "class": "figure",
        "title": "List of Figures",
        "file": "./figures.md"
    }],
    "listOfFigures": {
        "class": "figure"
    }
}
```

This configuration which would allow you to also choose a shorter classifier like *fig* is the default, though. Therefore, if you are fine with ***figure* as the default classifier** you can omit `listOf` and just use:

*glossarify-md.conf.json*

```json
"generateFiles": {
    "listOfFigures": {
        "title": "List of Figures",
        "file": "./figures.md"
    }
}
```

### List of Tables

`listOfTables` like [`listOfFigures`](#list-of-figures) is a shortcut alternative to HTML anchors with a default [`listOf`](#lists) classifier ***table***:

*glossarify-md.conf.json*

```json
"generateFiles": {
    "listOfTables": {
        "title": "Tables",
        "file": "./tables.md"
    }
}
```

In contrast to images Markdown tables have no notion of a table caption. To render a list item for a table glossarify-md tries to infer a list item label.

One such inference looks at the **paragraph preceding the table**. If it **ends with an *emphasized* phrase** and the phrase itself is **terminated by a colon** then the tool uses that phrase as the item label:

<a id="table-of-average-prices-by-article-category"></a>

```md
[...] which we can see from the *table of average prices by article category:*

| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

But the phrase could also be it's own distinct paragraph:
<a id="average-prices-by-category"></a>

```md
[...] which we can see from the average price by article category.

*Average prices by category:*

| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

**Since v3.4.0** there has also been support for *invisble* table captions using *HTML comment syntax*:
<a id="avg-prices"></a>

```md
<!-- table: Average Prices by Article Category -->
| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

The result for the tables above will be:

> ## List of Tables
>
> - [Table of average prices by article category](#table-of-average-prices-by-article-category)
> - [Average prices by category](#average-prices-by-category)
> - [Average Prices by Article Category](#avg-prices)


**Since v5.0.0** and the introduction of [`listOf`](#generating-files-lists) all the previous examples will make glossarify-md annotate the table with an HTML anchor. While not recommended due to verbosity, you could also just add an HTML anchor yourself, of course, applying what was described in [`listOf`](#generating-files-lists) above:

```md
<a id="avg-prices" class="table" title="Average Prices by Article Category"></a>

| Category | Description | Price Avg. |
| -------- | ----------- | ---------- |
| 1        | Video Game  | $35.66     |
| 2        | Film        | $10.13     |
| 3        | Book        | $23.45     |
```

> **ⓘ Note:** If glossarify-md can't find a list item label by any of the above means it will fall back to rendering a list item
> 1. using the table headers separated by comma,
> 1. or if no headers, using the closest section heading
> 1. or if no section heading, using the file name.

<!--
1. **HTML anchor** see `listOf`
1. **HTML comment** in the line above the table
1. **emphasized text** at the end of the preceding paragraph
1. **column headers** separated by comma, e.g. *Category, Description, Price Avg.*
1. **preceding section heading** (tables without column headers)
1. **filename** otherwise.
-->

### Lists from Regular Expressions (Experts)

**Since v5.2.0** you can use `listOf` with a regular expression pattern. Like [`listOfFigures`](#list-of-figures) and [`listOfTables`](#list-of-tables) it is meant to be a shortcut to save you from annotating Markdown with HTML elements yourself. If the regular expression (RegExp) matches text in a paragraph, then *the paragraph* will become annotated with an HTML anchor `<a class="..."></a>` preparing it for evaluation by `listOf` as we have seen above.

**Example:** Let's assume you are writing a book with *tasks* to be accomplished by your readers. You would like to compile a *List of Tasks* in that book. You decided to use a conventional pattern which prefixes tasks with a phrase **Task:** and ends them with an exclamation mark *!*

*Document.md*
~~~md
Some text [...]

**Task:** Clap your hands!
~~~

Then you can generate a *List of Tasks* with a configuration like this:
~~~md
{
  "generateFiles": {
    "listOf": [
      {
        "class": "task",
        "title": "Tasks in this Book",
        "file": "./list-of-tasks.md",
        "pattern": "Task: ([a-zA-Z0-9].*)!"
      }
    ]
  }
}
~~~

Our expression uses a Capture Group in brackets `()`. Text matching the capture group pattern will become the list item label, so *Clap your hands* will become the item label, because `Task:` and exclamation mark `!` are not part of the group. There can be at most one capture group.

> **ⓘ When to consider "Markdown" syntax in the RegExp pattern?**:
>
> You may noticed that the RegExp pattern above doesn't assume *Task:* to be written between "bold" star markers `**`, even though, that's the case in the input file *Document.md*. The pattern will be matched against *plain text* that was separated from syntactic tokens of [CommonMark] and [GFM] syntax. Other *non-standard* markdown syntax may require a special syntax plug-in which parses its tokens into an abstract syntax tree. Otherwise they will be considered plain text, too, thus have to be considered in the RegExp pattern. Unfortunately, remark plug-ins behave differently in this regard. There are plug-ins which promote special syntax which fits *their* purpose, yet *without* correctly parsing their syntax into an abstract syntax tree. So if this feature causes you headaches better try both ways or consider it not fit for your purpose.
>

See also page Plug-ins.
