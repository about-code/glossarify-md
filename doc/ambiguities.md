# [Multiple Glossaries and Ambiguity](#multiple-glossaries-and-ambiguity)

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

## [Limiting the number of links to alternative definitions](#limiting-the-number-of-links-to-alternative-definitions)

```json
"linking": {
   "limitByAlternatives": 0
}
```

Produces a result *[Ambiguous Term][A]* linking the term phrase to a single definition, only, but not to alternative definitions. This provides no indication on ambiguity of a term. You might be interested to read below on how to improve automatically [selecting the most appropriate definition][1].

## [Stop linking at a certain degree of ambiguity](#stop-linking-at-a-certain-degree-of-ambiguity)

```json
"linking": {
   "limitByAlternatives": -5
}
```

Stops linking automatically once there are six definitions in total, one definition and five alternative definitions. Since there are only three alternative definitions in our example, this setting produces a result *[Ambiguous Term][A]<sup>[2)][B],[3)][C],[4)][D]</sup>*. In contrast

```json
"linking": {
   "limitByAlternatives": -2
}
```

would permit two alternative definitions, at most, that is three definitions in total. *Ambiguous Term* were not linkified, anymore, since there are three alternative definitions for the term.

## [Not linking ambiguous terms, at all](#not-linking-ambiguous-terms-at-all)

```json
"linking": {
   "limitByAlternatives": -1
}
```

Stops linking if there are two definitions in total, one definition and one alternative definition. But you could also exclude a particular term occurrence in a case by case decision by wrapping it in a pseudo HTML tag like `<x>Ambiguous Term</x>`.

## [Selecting the most appropriate definition](#selecting-the-most-appropriate-definition)

You can choose from different tactics to prioritize glossary definitions for ambiguous terms:

1.  Explicitly choosing the link target, see [Identifier-based Cross-Linking][2]
2.  Limiting the applicable scope of glossaries, see [Tree-Scoped Linking][3] (**since v7.0.0**)
3.  Choosing from sort algorithms for determining definition priority, algorithmically (**since v7.1.0**):

The rest of this section documents algorithms for the third option. By sorting term definitions, we determine the primary definition which the term's phrase *Ambiguous Term* refers to but also the order of definitions when referred to by indicators <sup>2),3),4)</sup>. Sorting term definitions, *contextually*, means determining the order more *individually* for term occurrences  such that, ideally, the term occurrence's phrase refers to the definition which is most appropriate and applicable in the context of a particular term occurrence.

#### [Sorting by Counting Glossary References](#sorting-by-counting-glossary-references)

> **Assumption:** When there are more terms of glossary B within the same section S than terms from glossary A, then for an occurrence of an ambiguous term which is defined in glossary A *and* glossary B it is more likely that the *most appropriate*  definition for that occurrence *in the context of section S* is provided by glossary B.

```json
"linking": {
   "sortAlternatives": {
      "by": "glossary-ref-count"
   }
}
```

<!--
\n\n Finding a good section depth: As a writer you may want to ask yourself at which heading depth it is more likely for you to change topics in a way that the meaning of ambiguous terms is more likely to change as well. For example, given your book is a single Markdown file then there is probably only one title heading '# Title' at heading depth 1. Given book chapters '## Chapter' at depth 2 cover different topics and use a topic-specific terminology while sections at heading depths 3 and deeper will only add details to the chapter's topic but do not change the overall topic and terminology of chapters. Then 'perSectionDepth: 2' can be a viable choice, because 'perSectionDepth: 1' would result in only a single term definition priority for the whole book. Consequently, an ambiguous term's primary definition would be the same in all chapters ignoring chapter-specific differences in terminology. In contrast, with 'perSectionDepth: 2' the algorithm determines a different term definition priority per chapter based on terminology use in those chapters. With 'perSectionDepth: 3' or deeper precision may or may not increase further. As a book writer when choosing the deeper value boundary you may also want to ask yourself how likely it is to having enough glossary terms at that depth, at all. The likelihood for finding (enough) term occurrences as samples for the term-glossary-distribution decreases with larger depths. With lower values for 'perSectionDepth' deeper sections use the same term-glossary-distribution and term definition priority as their parent sections. That distribution was derived from all of the parent's child sections, so the sampling space is larger. Because term-glossary-distributions at lower depths are always aggregations of more granular term-glossary-distributions from deeper levels for the term definition priority _at level 2_ it will make no difference whether sampling only one term-glossary-distribution 'perSectionDepth: 2' or sampling multiple separate term-glossary-distributions 'perSectionDepth: 3' then aggregating their ref counts. For disambiguation of terms at section level 2 the difference is comparable to a bar chart where 'perSectionDepth: 3' only reveals how much each subsection contributes to the glossary-term-distribution without changing the total distribution, though. At level 2 the higher resolution is meaningless. It is only relevant for disambiguation at section levels of 3 or deeper."
-->

Counting how often terms of various glossaries occur in a section scope gives us a kind of "popularity" distribution which could look like:

    refCount
        ^
        |
      3_|       _
      2_|      | |  _
      1_|   _  | | | |  _
      0_|  |1| |3| |2| |1|
        +-|---|---|---|---|--> glossary
          | A | B | C | D |

The distribution tells us that some writer has used terms from glossary *B* three times, terms from glossary *C* two times and terms of glossaries *A* and *D* only once. Sorting glossaries "by glossary reference count" yields a *glossary priority*:

    refCount
        ^
        |
      3_|   _
      2_|  | |  _
      1_|  | | | |  _   _
      0_|  |3| |2| |1| |1|
        +-|---|---|---|---|--> glossary
          | B | C | A | D |

It shows the order B, C, A, D which is the context-sensitive order derived from a writer's actual use of glossary terminology. When there's an occurrence for an ambiguous term which has a definition in all those glossaries, then *glossary priority* will determine *term definition priority*. In the example, the most appropriate definition is assumed to be provided by glossary B. Its definition will be associated with the term occurrence's term phrase: *[Ambiguous Term][B]<sup>[2)][C],[3)][A],[4)][D]</sup>* (move mouse over the links to get a tooltip with the glossary name).

> **ⓘ** We recommend sorting term definitions, contextually, when setting `"linking.limitByAlternatives": 0`. Since the latter disables superscript indicators even when there are multiple definitions, there's only one possible link *[Ambiguous Term][B]* to some term definition. Sorting contextually, increases the likelihood for that link to refer to a definition which seems contextually appropriate given your use of terminology.

#### [Going Deeper (Optional Reading)](#going-deeper-optional-reading)

```json
"linking": {
   "sortAlternatives": {
      "by": "glossary-ref-count",
      "perSectionDepth": 1
   }
}
```

By counting `perSectionDepth: 1` the algorithm assesses a new distribution and reference count whenever coming across a new heading at depth 1, like `# Heading 1`. Counting references always *includes* terms in direct *subsections* at deeper levels, e.g. (`## Heading 1.1, ### Heading 1.1.1`, etc.). By counting `perSectionDepth: 2` glossarify-md will assess a separate distribution for each section at level 2, *as well*. The sort order of links *at section level 2 or deeper* may change. Their order will no longer depend on the sorted distribution for their parent section at depth 1 (which was derived from *all* subsections at depth 2) but there will be a distinct distribution per section at depths 2 which determines the sort order for the particular section and their subsections. Going deeper may help dealing better with terminological variance at a given section level.

> **ⓘ Discussion:** What's the "right" value for `perSectionDepth`?
>
> Short answer: there is none. You may want to ask yourself
>
> *   at which section level are you more likely to change terminology in a way that meaning of ambiguous terms, changes as well?
> *   up to which depth do you mention enough glossary terms to provide enough samples for good results?
>
> Our reasoning is that upper section levels (e.g. chapters) are more likely to introduce new topics and *different* terminology than sections at deeper levels which only add details to a chapter's topic. Furthermore, deeper levels will be less verbose than upper sections. The less verbose a section the higher the risk of not having enough glossary terms being mentioned and found, at all. Furthermore the less terms being mentioned the higher the weight of those (few?) terms in selecting the "most likely appropriate" definition for ambiguous terms, automatically. Based on this reasoning we consider
>
> ```json
> {
>   "sortAlternatives": {
>     "by": "glossary-ref-count",
>     "perSectionDepth": 2
>   }
> }
> ```
>
> a good choice for many situations.
>
> The default algorithm for priortizing definitions is `"by": "glossary-filename"`. It assumes definition priority solely from the alphanumeric order of glossary file names hosting definition. This strategy won't adapt to the writer's contextual use of terminology but therefore is also easier to reason about. For example, it is not expected to update link order in sections which haven't been changed, which is expected, though, when sorting by `glossary-ref-count`.

> **Supplementary Notes**
>
> *   Keep in mind that sorting by glossary ref. count means linkification is expected to produce different results between subsequent runs of glossarify-md depending on how your use of glossary terms changed between those runs.
> *   Counting `perSectionDepth: 2` or deeper instead of counting references `perSectionDepth: 1` won't change sort order of links *at section level 1*. Increasing depth only increases "resolution". A higher resolution *might* improve results in sections at the level denoted by `perSectionDepth` and deeper but upper levels remain to be a summary distribution of all the partial distributions of their subsections (think of bar charts where going deeper with `perSectionDepth` only reveals more details on how much each subsection contributes to the total distribution of the parent section without changing the total heights of the bars for the parent section, though. Changes to the distributions itself can only be induced by changing the book contents and term usage that has been analyzed).

[1]: https://github.com/about-code/glossarify-md/blob/master/doc/ambiguities.md#selecting-the-most-appropriate-definition "You can choose from different tactics to prioritize glossary definitions for ambiguous terms: Explicitly choosing the link target, see Identifier-based Cross-Linking Limiting the applicable scope of glossaries, see Tree-Scoped Linking (since v7.0.0) Choosing from sort algorithms for determining definition priority, algorithmically (since v7.1.0): The rest of this section documents algorithms for the third option."

[2]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md#identifier-based-cross-linking "When there are two or more term definitions or book sections with the same heading phrase then you might want to refer to a particular term definition or section."

[3]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md#tree-scoped-linking "Tree Scoped Linking can be used to restrict Term-Based Linking to link targets within particular branches of a file tree and prevent links across branches."
