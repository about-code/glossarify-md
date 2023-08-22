# [Multiple Glossaries and Ambiguity](#multiple-glossaries-and-ambiguity)

[multiple glossaries]: ../README.md#multiple-glossaries

[A]: ./glossary-a.md#ambiguous-term "Glossary A"

[B]: ./glossary-b.md#ambiguous-term "Glossary B"

[C]: ./glossary-c.md#ambiguous-term "Glossary C"

[D]: ./glossary-d.md#ambiguous-term "Glossary D"

If you have [multiple glossaries] there could be multiple definitions for the same term in two or more glossaries (polysemy, ambiguity). When glossarify-md finds a [term occurrence][1] for which multiple term definitions exist, say four, then it will create links to all four definitions by default using a format *[Ambiguous Term][A]<sup>[2)][B],[3)][C],[4)][D]</sup>*. This way a reader won't miss different meanings of a term. Technically, you can <x>configure glossarify-md</x> to list **up to `95`** alternative definitions. The **default limit is `10`**, though.

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

## [Limiting the number of links to alternative definitions](#limiting-the-number-of-links-to-alternative-definitions)

```json
"linking": {
   "limitByAlternatives": 0
}
```

produces a result *[Ambiguous Term][A]* linking the term phrase to a single definition, only, but not to alternative definitions. This provides no indication on ambiguity of a term. You might be interested to read below on how to improve linking the most appropriate definition, automatically.

## [Stop linking at a certain degree of ambiguity](#stop-linking-at-a-certain-degree-of-ambiguity)

```json
"linking": {
   "limitByAlternatives": -5
}
```

stops linking automatically once there are five alternative definitions. So it stops linking once there are six definitions in total, one "primary" definition and five alternative definitions. Since there are only four definitions in our example, this setting were to produce a result *[Ambiguous Term][A]<sup>[2)][B],[3)][C],[4)][D]</sup>*. In contrast

```json
"linking": {
   "limitByAlternatives": -2
}
```

stops linking once there are two alternative definitions. Our example *Ambiguous Term* were not linkified, anymore, since it has three alternative definitions and four definitions in total.

## [Not linking ambiguous terms, at all](#not-linking-ambiguous-terms-at-all)

```json
"linking": {
   "limitByAlternatives": -1
}
```

stops linking once there is at least one alternative definition, that is, two definitions in total.

You could also exclude a particular [term occurrence][1] in a case by case decision by wrapping it in a pseudo HTML tag like `<x>Ambiguous Term</x>`.

## [Selecting the most appropriate definition](#selecting-the-most-appropriate-definition)

You can choose from different tactics to prioritize glossary definitions for ambiguous terms:

1.  Explicitly choosing the link target, see [Identifier-based Cross-Linking][2]
2.  Limiting the applicable scope of glossaries, see [Tree-Scoped Linking][3] (**since v7.0.0**)
3.  Choosing from sort algorithms for determining definition priority (**since v7.1.0**):

Options 2 and 3 can be combined since option 2 works more like a filtering strategy while option 3 works more like a sort strategy which could be applied to filtered sets, as well. The rest of this section describes option 3.

### [Choosing from sort algorithms for determining definition priority](#choosing-from-sort-algorithms-for-determining-definition-priority)

By sorting term definitions, we determine the primary definition which the term's phrase *Ambiguous Term* refers to but also the order of definitions when referred to by indicators <sup>2),3),4)</sup> and so forth. Sorting term definitions, *contextually* means determining the order more *individually* for [term occurrences][1]  such that, *ideally*, the term occurrence's phrase refers to the definition which is most appropriate and applicable in the context of a particular term occurrence. This ideal is impossible to achieve with 100% accuracy due to the lack of computers fully understanding book content and context. Algorithms provided are meant to increase the accuracy without claiming to be 100% accurate.

#### [Sorting contextually by counting glossary references](#sorting-contextually-by-counting-glossary-references)

> **Premise:** When there are more terms of glossary B within the same section S than terms from glossary A, then for an occurrence of an ambiguous term which is defined in glossary A *and* glossary B it is more likely that the *most appropriate*  definition for that occurrence *in the context of section S* is provided by glossary B.

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

Counting how often terms of various glossaries occur is a numerical expression for glossary relevance, which could be distributed like in this bar chart:

    refCount
        ^
        |
      3_|       _
      2_|      | |  _
      1_|   _  | | | |  _
      0_|  |1| |3| |2| |1|
        +-|---|---|---|---|--> glossary
          | A | B | C | D |

The distribution tells us that the writer has mentioned (whichever) terms defined in glossary *B* three times, terms defined in glossary *C* two times and terms defined in glossaries *A* and *D* only once. Sorting the bars "by glossary reference count" yields:

    refCount
        ^
        |
      3_|   _
      2_|  | |  _
      1_|  | | | |  _   _
      0_|  |3| |2| |1| |1|
        +-|---|---|---|---|--> glossary
          | B | C | A | D |

It shows the order `B,C,A,D` which is the context-sensitive *glossary priority* derived from a writer's actual use of glossary terminology in the scope that has been analyzed for above distribution. Given within the analyzed scope we find a [term occurrence][1] with a [term definition][4] in glossaries `A,C,D` then above distribution suggests prioritzing definitions by their glossary origin in order `C,A,D`: *[Ambiguous Term][C]<sup>[2)][A],[3)][D]</sup>* (move your mouse over the links to get a tooltip which denotes the priority of term definitions being linked).

> **ⓘ** We recommend sorting term definitions contextually when setting `"linking.limitByAlternatives": 0`. The latter disables superscript indicators even when there are multiple definitions. When there's only one possible link *[Ambiguous Term][B]* to some term definition sorting contextually, increases the likelihood for the generated link to refer to the definition which seems the most appropriate given your use of terminology.

#### [Going Deeper (Optional Reading)](#going-deeper-optional-reading)

So far we have seen how reference counting works in general to yield a [term definition][4] priority. We could consider the bar charts above to describe a term definition priority for an entire markdown file which were equal to counting references `perSectionDepth: 0`. By telling glossarify-md to count references `perSectionDepth: 1` or deeper we can increase sensitivity regarding section-specfic terminology which results in *different term definition priorities for different sections* (the default is `perSectionDepth: 2`).

**Example (Optional Reading):**
Let's assume a Markdown document with a *[Table of Contents][5]:*

*   `# Section 1`
*   `# Section 2`
    *   `## Section 2.1`
    *   `## Section 2.2`
        *   `### Section 2.2.1`

Counting `perSectionDepth: 1` makes glossarify-md create a tree of section-specific reference count distributions like this:

    Heading
     Depth
       |                    .:.
       |                   ::::
       |                   ::::
       |                   ABCD
     0_|                    o
       |           .       / \       ..::
       |         .::.     /   \      ::::
       |         ABCD    /     \     ABCD
     1_|_#    Section 1 o       o  Section 2
       |
       V

Glossary references are no longer summarized at the root, only, but the contribution of distinct distributions at section depths 1 are kept separately. Sorting the distributions for each section by counting the dots suggests that, in this example, term definitions should be prioritized

*   in glossary order `C,B,A,D` in context of Section 1
*   in glossary order `C,D,A,B` in context of Section 2

With `perSectionDepth: 0`, *Section 1* and *Section 2* had been inheriting priority `C,B,D,A` from sorting the root aggregtion. Going even deeper by counting `perSectionDepth: 2` may then yield a tree

    Heading
     Depth
       |                    .:.
       |                   ::::
       |                   ::::
       |                   ABCD
     0_|                    o
       |           .       / \       ..::
       |         .::.     /   \      ::::
       |         ABCD    /     \     ABCD
     1_|_#    Section 1 o       o  Section 2
       |              .        / \         .
       |           .:.:       /   \      :.:.
       |           ABCD      /     \     ABCD
     2_|_##     Section 2.1 o       o  Section 2.2
       |
       V

Once again, the tree suggests that term definitions should be prioritized in context of

*   Section 1 in glossary order `C,B,A,D`
*   Section 2 in glossary order `C,D,A,B`
*   Section 2.1 (and subsections) in glossary order `D,B,A,C`
*   Section 2.2 (and subsections) in glossary order `C,A,B,D`

You may note that the priorities for *Section 1* and *Section 2* at section depth 1 have *not* changed. What changed, again, by going deeper is that sections at depths 2 no longer inherit [term definition][4] priority from upper levels (which included reference counts of sibling sections). Instead term definition priority for sections at depth 2 or deeper reflect more specifically the use of terminology in those sections ignoring the use of terminology in sibling sections and their child sections.

> **ⓘ What's the "right" value for `perSectionDepth`?**
>
> Short answer: there is none. You may want to ask yourself
>
> *   at which section level are you more likely to change terminology in a way that meaning of ambiguous terms, changes as well?
> *   up to which depth do you mention enough glossary terms to provide enough samples for meaningful results?
>
> Our reasoning is that upper section levels (e.g. chapters) are more likely to introduce new topics and *different* terminology than sections at deeper levels which only add details to a chapter's topic. Furthermore, deeper levels will be less verbose than upper sections in total. The less verbose a section the higher the risk of not having enough glossary terms for sampling good term distributions. Furthermore the less terms being mentioned the higher the weight of those (few?) terms that have been mentioned in selecting the "most likely appropriate" definition for ambiguous terms. Based on this reasoning we consider
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
> a good choice for many situations. `perSectionDepth: 2` will be the default if none was given.
>
> The *default algorithm* for priortizing definitions is `"by": "glossary-filename"`. It assumes definition priority solely from the alphanumeric order of glossary file names hosting definitions. This strategy won't adapt to your use of glossary terms but is less confusing to new users since it requires less knowledge on how text analysis affects linking and link order.

> **ⓘ Supplementary Notes**
>
> *   Keep in mind that sorting by glossary ref. count means linkification is expected to produce different results between subsequent runs of glossarify-md depending on how your use of glossary terms changed between those runs.

[1]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term-occurrence "A phrase in a Markdown file A which matches the phrase of a heading in a Markdown file B where B was configured to be a glossary file."

[2]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md#identifier-based-cross-linking "When there are two or more term definitions or book sections with the same heading phrase then you might want to refer to a particular term definition or section."

[3]: https://github.com/about-code/glossarify-md/blob/master/doc/cross-linking.md#tree-scoped-linking "Tree Scoped Linking can be used to restrict Term-Based Linking to link targets within particular branches of a file tree and prevent links across branches."

[4]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term-definition "A term definition is, technically, the phrase of a heading in a Markdown file which was configured to be a glossary file."

[5]: https://github.com/about-code/glossarify-md/blob/master/README.md
