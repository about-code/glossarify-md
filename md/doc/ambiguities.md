# Multiple Glossaries and Ambiguity

[multiple glossaries]: ../README.md#multiple-glossaries

If you have [multiple glossaries] there could be multiple definitions for the same term in two or more glossaries (polysemy). When glossarify-md finds a term occurrence for which multiple term definitions exist, say four, then it will create links to all four definitions by default using a format *[Ambiguous Term](./glossary-a.md#ambiguous-term)<sup>[2)](./glossary-b.md#ambiguous-term),[3)](./glossary-c.md#ambiguous-term),[4)](./glossary-d.md#ambiguous-term)</sup>*. This way a reader won't miss different meanings of a term. Technically, you can configure glossarify-md to list **up to `99`** alternative definitions. The **default limit is `10`**.

You can change the default behavior in various aspects.
<!--
There are some questions you may ask yourself when thinking about ambiguities:

1. Should I link ambiguous terms, automatically, *at all*?
2. I would like to link ambiguous terms, automatically,...
   1. ... but how can I limit the number of links to alternative definitions?
   2. ... but how can I stop linking when there are too many alternative definitions?
   3. ... but how can I manually select a particular definition in a case by case decision?
   4. ... but how can I exclude a particular term occurrence from being linkified in a case by case decision?
   5. ... but how can I make glossarify-md to understand what definition is the *most appropriate* in the context of a term occurrence?
-->

### Limiting the number of links to alternative definitions

~~~json
"linking": {
   "limitByAlternatives": 3
}
~~~

Produces a result *[Ambiguous Term](./glossary-a.md#ambiguous-term)<sup>[2)](./glossary-b.md#ambiguous-term),[3)](./glossary-c.md#ambiguous-term)</sup>* limiting the number of links to three. As mentioned earlier, there is a maximum of 99 and when not setting the value there's a default of 10.


### Stop linking at a certain level of *ambiguity*


~~~json
"linking": {
   "limitByAlternatives": -5
}
~~~

stops linking once there are more than five alternative definitions. So it produces a result *[Ambiguous Term](./glossary-a.md#ambiguous-term)<sup>[2)](./glossary-b.md#ambiguous-term),[3)](./glossary-c.md#ambiguous-term),[4)](./glossary-d.md#ambiguous-term)</sup>* since there are only four definitions. In contrast

~~~json
"linking": {
   "limitByAlternatives": -3
}
~~~

would produce *Ambiguous Term*.

### Not linking ambiguous terms, at all

~~~json
"linking": {
   "limitByAlternatives": -1
}
~~~

### Selecting a particular definition, manually

See Identifier-based Cross-Linking.

### Excluding a particular term occurrence from being linkified

Wrap it into a pseudo HTML tag like `<x>Ambiguous Term</x>`.

### Linking the term phrase to the most likely definition

You can choose or combine two tactics for improving the likelihood of finding the most appropriate definition for a term occurrence:

1. Tree-scoped Auto-Linking (**since v7.0.0**)
2. Priortizing glossaries by relevance (**since v7.1.0**):

If you do not want to abide to a particular project layout, choose the second tactic and configure:

~~~json
"linking": {
   "sortAlternatives": "by-glossary-refCount-in-file"
}
~~~

As the name suggests this option will make glossarify-md count for each glossary how many of its terms have occurred *in a file*. The evaluation may result in a distribution like:

~~~
refCount
    ^
    |
  3_|       _
  2_|      | |  _
  1_|   _  | | | |  _
  0_|  |1| |3| |2| |1|
    +-|---|---|---|---|--> glossary
      | A | B | C | D |
~~~

Sorting glossaries by `refCount`...

~~~
refCount
    ^
    |
  3_|   _
  2_|  | |  _
  1_|  | | | |  _   _
  0_|  |3| |2| |1| |1|
    +-|---|---|---|---|--> glossary
      | B | C | A | D |
~~~

...then gives us the order of links for *[Ambiguous Term](./glossary-b.md#ambiguous-term)<sup>[2)](./glossary-c.md#ambiguous-term),[3)](./glossary-a.md#ambiguous-term),[4)](./glossary-d.md#ambiguous-term)</sup>* (move mouse over the links to see the glossary file name) based on the terminology you used the most in the file.

> **ⓘ** If you find this working well enough and you do not want to indicate polysemy anymore then combine it with option `"limitByAlternatives": 0`. The result will be *[Ambiguous Term](./glossary-b.md#ambiguous-term)* being linked to the most likely definition, only.

**When your book project consists of a single Markdown file** then a *file scoped analysis* may not provide the best results. You can scope analysis to individual *sections*, too:

~~~json
"linking": {
   "sortAlternatives": "by-glossary-refCount-at-depths-2"
}
~~~

This will make glossarify-md assess a separate distribution and priortization for every new section at depth 1 and depth 2 *but not* for section levels 3,4...,6. Rather, term occurrences found in sections deeper or equal than depth 2 contribute to the `refCount` of the parent section at level 2. So levels 2,3,...6 will share the same glossary-term distribution and priortization, here.

The overall assumption behind such a setting is similar to that behind tree-scoped linking: it is  the assumption that headings at a higher level, e.g. 1 and 2, are more likely to introduce *different* topics and set up *different* terminological contexts than deep sections, say at level 3 or deeper. Nevertheless, given you would like *every* section be a distinct terminological context, then configure:

~~~json
"linking": {
   "sortAlternatives": "by-glossary-refCount-at-depths-6"
}
~~~

**Just note as a general *rule of thumb***: if you observe sections becoming less and less verbose the deeper and detailed your headings become, then choose to aggregate refCounts at a level which is most likely to collect enough glossary term occurrences and glossary references, to gain enough contextual information for *good enough* context-sensitive results.


> **ⓘ** We plan on making `"sortAlternatives": "by-glossary-refCount-at-depths-2"` the default in future major releases (`v8` or later). The default until `v7` has been `by-glossary-file-name` just for the sake of having a defined order.

> **ⓘ** Keep in mind that sorting alternatives by glossary refCount means links might change between subsequent runs of glossarify-md depending on how your terminology usage evolves in between *as you write*.