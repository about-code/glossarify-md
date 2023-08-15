# Multiple Glossaries and Ambiguity

[multiple glossaries]: ../README.md#multiple-glossaries
[A]: ./glossary-a.md#ambiguous-term "Glossary A"
[B]: ./glossary-b.md#ambiguous-term "Glossary B"
[C]: ./glossary-c.md#ambiguous-term "Glossary C"
[D]: ./glossary-d.md#ambiguous-term "Glossary D"

If you have [multiple glossaries] there could be multiple definitions for the same term in two or more glossaries (polysemy). When glossarify-md finds a term occurrence for which multiple term definitions exist, say four, then it will create links to all four definitions by default using a format *[Ambiguous Term][A]<sup>[2)][B],[3)][C],[4)][D]</sup>*. This way a reader won't miss different meanings of a term. Technically, you can <x>configure glossarify-md</x> to list **up to `95`** alternative definitions. The **default limit is `10`**, though.

You have various options to fine tune the handling of ambiguities.
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

## Limiting the number of links to alternative definitions

~~~json
"linking": {
   "limitByAlternatives": 0
}
~~~

Produces a result *[Ambiguous Term][A]* linking the term phrase to a single definition but not to alternative definitions. This provides no indication on ambiguity of a term. As mentioned earlier, there is a maximum of 95 and a default of 10.


## Stop linking at a certain degree of ambiguity


~~~json
"linking": {
   "limitByAlternatives": -5
}
~~~

Stops linking automatically once there are six definitions in total, one definition and five alternative definitions. Since there are only three alternative definitions in our example, this setting produces a result *[Ambiguous Term][A]<sup>[2)][B],[3)][C],[4)][D]</sup>*. In contrast

~~~json
"linking": {
   "limitByAlternatives": -2
}
~~~

would permit two alternative definitions, at most, that is three definitions in total. *Ambiguous Term* were not linkified, anymore, since there are three alternative definitions for the term.

## Not linking ambiguous terms, at all

~~~json
"linking": {
   "limitByAlternatives": -1
}
~~~

Stops linking if there are two definitions in total, one definition and one alternative definition.

You could also exclude a particular term occurrence in a case by case decision by wrapping it in a pseudo HTML tag like `<x>Ambiguous Term</x>`.

## Select the most appropriate definition, manually

See Identifier-based Cross-Linking.

## Select the most likely definition, automatically

There's currently support for two tactics for improving the likelihood of glossarify-md finding the best applicable definition, automatically:

1. Collecting Glossary Popularity Metrics (**since v7.1.0**, recommended):
2. Tree-Scoped Linking (**since v7.0.0**)

### Collecting Glossary Popularity Metrics

~~~json
"linking": {
   "sortAlternatives": {
      "by": "glossary-ref-count-per-file"
   }
}
~~~

As the value suggests this option will make glossarify-md count for each glossary how many of its terms have occurred *in a given file*. It will then priortize glossaries and the term definition they contribute based on that count. This is a simple "popularity metric" for the glossary terminology applicable in a particular evaluation scope.

An example distribution could look like:

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

The distribution tells that terms from glossary *B* have been mentioned three times, terms from glossary *C* two times and terms of glossaries *A* and *B* once within the evaluation scope of a file. Sorting glossaries by `refCount`...

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

...then gives us an order of B, C, A, D which is an order derived from a writer's actual use of glossary terminology. glossarify-md will sort the links to alternative definitions, accordingly, thus linking the term phrase with the most likely definition in glossary B, e.g. *[Ambiguous Term][B]<sup>[2)][C],[3)][A],[4)][D]</sup>* (move mouse over the links to get a tooltip with the glossary file name). If only C and A did provide a definition the result were *[Ambiguous Term][C]<sup>[2)][A]</sup>*, of course.

> **ⓘ** Combine with `"linking.limitByAlternatives": 0` if you do not want to indicate polysemy, anymore, and link to the most likely definition, only, e.g. *[Ambiguous Term][B]*.

Instead of using an evaluation scope *per file* you can choose to collect a separate distribution *per section* (does not imply a performance penalty). The latter may provide better results, esp. in **single-file book projects**:

~~~json
"linking": {
   "sortAlternatives": {
      "by": "glossary-ref-count",
      "perSectionDepth": 2
   }
}
~~~

This will make glossarify-md count term occurrences, separately, for every section at depth 1 (`# Heading 1`) and depth 2 (`## Heading 2`). As a result the same ambiguous term may be linked differently in sections at these depths depending on the terminlogy prevalent in those sections. Glossary references in section depths 3,4...,6 will contribute to `refCount` of the parent section at level 2 and share the same glossary priority derived from that.

Given you would like *every* section be a distinct terminological context, then configure:

~~~json
"linking": {
   "sortAlternatives": {
      "by": "glossary-ref-count",
      "perSectionDepth": 6
   }
}
~~~

> **ⓘ Discussion:** What's the "right" section depth?
>
> To answer that question for yourself you should ask yourself questions like
>
> - is it more likely for terminology to change between chapters (say at level 2) or sections (level 3+)
> - should there be a minimum number of term occurrences contributing to an evaluation and which section level is most likely to capture enough term occurrences when including subsections
>
> Our assumption is that upper section levels are more likely to capture *different* topics and set up *different* terminological contexts than sections deeper in a table of contents. Furthermore, deeper levels will be less verbose than upper sections. The less verbose the higher the weight of _nearby_ term occurrences but also the higher the risk of not having another occurrence at all. Such a section would miss a discriminator for choosing the glossary for an ambiguous term. Based on this reasoning we plan on making
>
> ~~~json
> {
>   "sortAlternatives": {
>     "by": "glossary-ref-count",
>     "perSectionDepth": 2
>   }
> }
> ~~~
>
> the default in future major releases (`v8` or later). The default until `v7` has been `"by": "glossary-filename"` just for the sake of having a defined order, at all.
>
> Keep in mind that sorting alternatives by glossary refCount means links might change between subsequent runs of glossarify-md depending on how your terminology usage evolved between those runs.

