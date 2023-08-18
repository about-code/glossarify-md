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

Produces a result *[Ambiguous Term][A]* linking the term phrase to a single definition, only, but not to alternative definitions. This provides no indication on ambiguity of a term. You might be interested to read below on how to improve automatically selecting the most appropriate definition.


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

## Select the most appropriate definition

You can choose from different tactics for that matter.

1. Explicitly choosing the link target, see Identifier-based Cross-Linking
1. Limiting the applicable scope of glossaries, see Tree-Scoped Linking (**since v7.0.0**)
2. Choosing algorithms for sorting/priorizing competing term definitions based on heuristics and contextual analysis (**since v7.1.0**):

### Sorting term definitions, contextually

We saw that glossarify-md renders occurrences of ambiguous terms using a format *[Ambiguous Term][A]<sup>[2)][B],[3)][C],[4)][D]</sup>*. By sorting term definitions, we determine the order by which links to definitions are attached to a term occurrence, for example whether the term's phrase *Ambiguous Term* links to itsa definition in glossary A or B and which definitions <sup>2), 3), 4)</sup> refer to.
Sorting term definitions, *contextually*, means determining the order more *individually* for term occurrences  such that - at least - the term occurrence's phrase refers to the definition which is most appropriate and applicable in the context of the term occurrence.

#### Sorting by Counting Glossary References


> **Assumption:** when the terminology defined in a particular glossary B occurs more often within the same section of a particular term occurrence than terminology of another glossary A, then for an ambiguous term which is defined in glossary A *and* glossary B it is more likely that the *most appropriate*  definition in the context of that section is provided by glossary B.

~~~json
"linking": {
   "sortAlternatives": {
      "by": "glossary-ref-count"
   }
}
~~~

<!--
\n\n Finding a good section depth: As a writer you may want to ask yourself at which heading depth it is more likely for you to change topics in a way that the meaning of ambiguous terms is more likely to change as well. For example, given your book is a single Markdown file then there is probably only one title heading '# Title' at heading depth 1. Given book chapters '## Chapter' at depth 2 cover different topics and use a topic-specific terminology while sections at heading depths 3 and deeper will only add details to the chapter's topic but do not change the overall topic and terminology of chapters. Then 'perSectionDepth: 2' can be a viable choice, because 'perSectionDepth: 1' would result in only a single term definition priority for the whole book. Consequently, an ambiguous term's primary definition would be the same in all chapters ignoring chapter-specific differences in terminology. In contrast, with 'perSectionDepth: 2' the algorithm determines a different term definition priority per chapter based on terminology use in those chapters. With 'perSectionDepth: 3' or deeper precision may or may not increase further. As a book writer when choosing the deeper value boundary you may also want to ask yourself how likely it is to having enough glossary terms at that depth, at all. The likelihood for finding (enough) term occurrences as samples for the term-glossary-distribution decreases with larger depths. With lower values for 'perSectionDepth' deeper sections use the same term-glossary-distribution and term definition priority as their parent sections. That distribution was derived from all of the parent's child sections, so the sampling space is larger. Because term-glossary-distributions at lower depths are always aggregations of more granular term-glossary-distributions from deeper levels for the term definition priority _at level 2_ it will make no difference whether sampling only one term-glossary-distribution 'perSectionDepth: 2' or sampling multiple separate term-glossary-distributions 'perSectionDepth: 3' then aggregating their ref counts. For disambiguation of terms at section level 2 the difference is comparable to a bar chart where 'perSectionDepth: 3' only reveals how much each subsection contributes to the glossary-term-distribution without changing the total distribution, though. At level 2 the higher resolution is meaningless. It is only relevant for disambiguation at section levels of 3 or deeper."
-->

Counting how often terms of various glossaries occure in a section scope gives us a kind of "popularity" distribution which could look like:

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

The distribution tells that terms from glossary *B* have been mentioned three times, terms from glossary *C* two times and terms of glossaries *A* and *D* only once. Sorting glossaries "by glossary ref.  count" then gives us an order of B, C, A, D which is a context-sensitive order derived from a writer's actual use of glossary terminology:

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

glossarify-md will then link definitions, accordingly, with the most likely definition in glossary B associated with the term's phrase: *[Ambiguous Term][B]<sup>[2)][C],[3)][A],[4)][D]</sup>* (move mouse over the links to get a tooltip with the glossary name).

> **ⓘ** We recommend sorting term definitions, contextually, when setting `"linking.limitByAlternatives": 0`. It increases the likelihood for a term *[Ambiguous Term][B]* being linked to the most appropriate definition, when it doesn't provide a hint on competing definitions.

#### Going Deeper


~~~json
"linking": {
   "sortAlternatives": {
      "by": "glossary-ref-count",
      "perSectionDepth": 1
   }
}
~~~

By counting `perSectionDepth: 1` the algorithm counts term occurrences after entering a section via some `# Heading 1` *including* terms in subsequent sections at deeper levels, e.g. (`## Heading 2, ### Heading 3`, etc.). It assesses a new distribution when coming across a new heading at depth 1. By counting `perSectionDepth: 2` glossarify-md will assess separate distributions for each section at level 2, as well. The sort order of links *at section level 2 or deeper* may change. Their order will no longer be derived from a distribution derived from all subsections underneath their parent section but from a distinct distribution specific to each section at the given level 2.

> **ⓘ Discussion:** What's the "right" value for `perSectionDepth`?
>
> Short answer: there is no right nor wrong. You may want to ask yourself
>
> - at which section level it is more likely for terminology to change in a way that the meaning of ambiguous terms could change?
> - up to which depth do you mention enough glossary terms to provide enough samples for good results?
>
> Our reasoning is that upper section levels (e.g. chapters) are more likely to introduce new topics and *different* terminology than sections at deeper levels which only add details to a chapter's topic. Furthermore, deeper levels will be less verbose than upper sections. The less verbose a section the higher the risk of not having enough glossary terms being mentioned, at all. Furthermore the less terms being mentioned the higher the weight of those _nearby_ terms that have been mentioned. Based on this reasoning we consider
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
> a good choice for many situations.
>
> The default is sorting alternatives in a more or less arbitrary decision, anyways, sorting `"by": "glossary-filename"`. It provides less surprises to the new user but can not assist in dealing with ambiguities.

> **Supplementary Notes**
> - Keep in mind that sorting by glossary ref. count means linkification is expected to produce different results between subsequent runs of glossarify-md depending on how your use of glossary terms changed between those runs.
> - Counting `perSectionDepth: 2` or deeper instead of counting references `perSectionDepth: 1` won't change sort order of links *at section level 1*. Increasing depth only increases "resolution". A higher resolution *might* improve results in sections at the level denoted by `perSectionDepth` and deeper but upper levels remain to be a summary distribution of all the partial distributions of their subsections (think of bar charts where going deeper with `perSectionDepth` only reveals more details on how much each subsection contributes to the total distribution of the parent section without changing the total heights of the bars for the parent section, though. Changes to the distributions itself can only be induced by changing the book contents and term usage that has been analyzed).


