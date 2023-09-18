# Multiple Glossaries and Ambiguity

[multiple glossaries]: ../README.md#multiple-glossaries
[A]: ./glossary-a.md#ambiguous-term "Term definition in glossary A"
[B]: ./glossary-b.md#ambiguous-term "Term definition in glossary B"
[C]: ./glossary-c.md#ambiguous-term "Term definition in glossary C"
[D]: ./glossary-d.md#ambiguous-term "Term definition in glossary D"

If you have [multiple glossaries] there could be multiple definitions for the same term in two or more glossaries (polysemy, ambiguity). When glossarify-md finds a term occurrence for which multiple term definitions exist, say four, then it will create links to all four definitions by default using a format *[Ambiguous Term][A]<sup>[2)][B],[3)][C],[4)][D]</sup>*. This way a reader won't miss different meanings of a term. Technically, you can <x>configure glossarify-md</x> to list **up to `95`** alternative definitions. The **default limit is `10`**, though.

You have various options to fine tune this behavior and the handling of term ambiguities.
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

## Stop linking at a certain degree of ambiguity


~~~json
"linking": {
   "limitByAlternatives": -5
}
~~~

...stops linking automatically once there are five alternative definitions. So it stops linking once there are six definitions in total, one "primary" definition and five alternative definitions. Since there are only four definitions in our example, this setting were to produce a result *[Ambiguous Term][A]<sup>[2)][B],[3)][C],[4)][D]</sup>*. In contrast

~~~json
"linking": {
   "limitByAlternatives": -2
}
~~~

...stops linking once there are two alternative definitions. Our example *Ambiguous Term* has three alternative definitions and four definitions in total, so with this setting it were not linkified, anymore.

## Stop linking ambiguous terms, completely

~~~json
"linking": {
   "limitByAlternatives": -1
}
~~~

...stops linking once there is at least one alternative definition, that is, two definitions in total. You could also exclude a particular term occurrence in a case by case decision by wrapping it in a pseudo HTML tag like `<x>Ambiguous Term</x>`.

## Enable linking but to a single definition, only

~~~json
"linking": {
   "limitByAlternatives": 0
}
~~~

...produces a result *[Ambiguous Term][A]* linking the term phrase to a single definition, only, but not to alternative definitions. This provides no indication on ambiguity of a term. You might be interested to read below on how to improve linking the most appropriate definition, automatically.

## Enable linking a fixed number of alternative definitions

~~~json
"linking": {
   "limitByAlternatives": 1
}
~~~

...produces a result *[Ambiguous Term][A]<sup>[2)][B]...</sup>* with a link to a primary definition and one alternative definition, only. It indicates  with dots when there are more definitions.


## Linking to the most appropriate term definition

When there are multiple definitions available we usually want a term occurrence's phrase refer to the definition most appropriate in the context of the term occurrence. What the primary definition is *for ambiguous terms* depends on the context in which a term occurs. This makes solving this problem tricky when linkification happens, automatically. You can affect this process by choosing or even combining different approaches case-by-case:

1. Manually choosing the link target yourself. For more, see Identifier-based Cross-Linking.
2. Avoiding ambiguities by scoping glossaries. For more, see Tree-Scoped Linking.
3. Sorting term definitions by a priority metric. For more, continue reading.


### Sorting term definitions by priority metrics

By sorting term definitions we can affect what becomes the *primary definition* linked with the term occurrence's phrase as well as the order for linking alternative definitions from indicators <sup>2)3)4)</sup>.There are two sort strategies at the moment:

1. [Sorting *context-free* by glossary filename](#sorting-by-glossary-filename)
1. [Sorting *contextually* by counting references to glossary terms](#sorting-by-glossary-ref-count)


#### Sorting by `glossary-filename`

This strategy allows you to declare a static term definition priority simply by naming glossary files. Definitions in glossaries whose filenames begin with a letter earlier in an alphabet take priority over others. This strategy is easy to reason about and sort results are reproducable across multiple executions of glossarify-md. However, it can not adapt dynamically to a writer's actual use of glossary terminology.

~~~json
"linking": {
  "sortAlternatives": {
    "by": "glossary-filename"
   }
}
~~~

> **ⓘ** This strategy has been available, implicitly, since there is support for [multiple glossaries]. It remains to be the default when no `linking.sortAlternatives` configuration was found.

#### Sorting by `glossary-ref-count`

This is a dynamic metric which prioritizes definitions given the actual use of glossary terminology (**since v7.1.0**). It operates on the following logical heuristic:

> **Premise:** Given *a book section S* and in total there occur more terms referring to glossary B than terms referring to glossary A then for a particular occurrence of some ambiguous term with a definition in glossary A *and* glossary B it gives priority to the definition provided by glossary B which *seems* more *likely* to provide the most appropriate definition *in context of section S*.

~~~json
"linking": {
  "sortAlternatives": {
    "by": "glossary-ref-count"
   }
}
~~~

For additional details on how this is implemented and additional settings, see [Sorting Alternatives by Counting Glossary References](./sort-alternatives-by-ref-count.md).