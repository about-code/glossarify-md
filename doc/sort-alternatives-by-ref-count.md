# [Sorting Alternatives by Counting Glossary References](#sorting-alternatives-by-counting-glossary-references)

[multiple glossaries]: ../README.md#multiple-glossaries

[A]: ./glossary-a.md#ambiguous-term "Term definition in glossary A"

[B]: ./glossary-b.md#ambiguous-term "Term definition in glossary B"

[C]: ./glossary-c.md#ambiguous-term "Term definition in glossary C"

[D]: ./glossary-d.md#ambiguous-term "Term definition in glossary D"

Read [Ambiguities][1], first, to a get a bit more context on what this aims to achieve.

```json
"linking": {
  "sortAlternatives": {
    "by": "glossary-ref-count"
   }
}
```

By counting how often terms of various glossaries occur we get a distribution like, for example:

    refCount
        ^
        |
      3_|       _
      2_|      | |  _
      1_|   _  | | | |  _
      0_|  |1| |3| |2| |1|
        +-|---|---|---|---|--> glossary
          | A | B | C | D |

The distribution tells us that the writer has mentioned (whatever) terms defined in glossary `B` *three times*, terms defined in glossary `C` *two times* and terms defined in glossaries `A` or `D` *once*, each. Sorting the bars by glossary reference count (descending) yields a glossary priority:

    refCount
        ^
        |
      3_|   _
      2_|  | |  _
      1_|  | | | |  _   _
      0_|  |3| |2| |1| |1|
        +-|---|---|---|---|--> glossary
          | B | C | A | D |

The order `B,C,A,D` is a *context-sensitive glossary priority derived from a writer's actual use of glossary terminology*. Once we find a [term occurrence][2] *Ambiguous Term* with definitions in glossaries, e.g. `A,B,C` then above distribution suggests linking term definitions in glossary order `B,C,A` producing a linkified result *[Ambiguous Term][B]<sup>[2)][C],[3)][A]</sup>* (move your mouse over the links to get a hint on the link target).

> **Note:** Due to glossary priority being derived from a writer's use of glossary terminology linkification results are expected to change between subsequent runs of glossarify-md when a writer's use of glossary terminology has changed between those runs.

#### [Different priorities for different sections](#different-priorities-for-different-sections)

```json
"linking": {
  "sortAlternatives": {
    "by": "glossary-ref-count",
    "perSectionDepth": 1
   }
}
```

Let's assume a Markdown document with a *[Table of Contents][3]:*

*   `# Section 1`
*   `# Section 2`
*   `## Section 2.1`
*   `## Section 2.2`
*   `### Section 2.2.1`

By sorting definitions `perSectionDepth: 0` the system counts and aggregates a single distribution per markdown file. Counting and sorting `perSectionDepth: 1` increases sensitivity towards *section-specfic* use of terminology and makes glossarify-md aggregate distinct distributions for sections at a heading level `# Heading 1` which add up to the total count for the file:

*Each dot denotes an occurrence of some term from glossary A, B, C or D in the section:*

    Heading
     Depth                   .
       |                   . : .
       |                 : : : :
       |                 : : : :
       |                 A,B,C,D
       |                  Total
     0_|                    o          .
       |         .         / \     . . : :
       |       . : : .    /   \    : : : :
       |       A,B,C,D   /     \   A,B,C,D
     1_|_#    Section 1 o       o Section 2
       |
       V

The new setting changes [term definition][4] priorities to

*   `B,C,A,D` in context of Section 1
*   `C,D,A,B` in context of Section 2

Subsections *Section 2.1, Section 2.2* and *Section 2.2.1* inherit [term definition][4] priority `C,D,A,B` from their parent section *Section 2*. You may notice that the total count hasn't changed. Upper nodes summarize their child nodes.

The **default** sensitivity when sorting by `glossary-ref-count` is sorting `perSectionDepth: 2`. Omitting `perSectionDepth` would be equal to `perSectionDepth: 2` and in our example it may revealead distributions:

    Heading
     Depth                   .
       |                   . : .
       |                 : : : :
       |                 : : : :
       |                 A,B,C,D
       |                  Total
     0_|                    o          .
       |         .         / \     . . : :
       |       . : : .    /   \    : : : :
       |       A,B,C,D   /     \   A,B,C,D
     1_|_#    Section 1 o       o Section 2
       |                       / \
       |               .      /   \           :
       |         . : . :     /     \      : . : .
       |         A,B,C,D    /       \     A,B,C,D
     2_|_##    Section 2.1 o         o  Section 2.2
       |
       V

The new tree continues to suggest a glossary priority

*   `B,C,A,D` in context of Section 1
*   `C,D,A,B` in context of Section 2

but now suggests different [term definition][4] priorities

*   `D,B,A,C` in context of Section 2.1 and deeper
*   `C,A,B,D` in context of Section 2.2 and deeper.

*Section 2.2.1* now inherits a priority `C,A,B,D` from its parent section *Section 2.2*.

> **ⓘ What's the "right" value for `perSectionDepth`?**
>
> Short story: there's none. You may want to ask yourself two questions for a good *tradeoff*:
>
> 1.  At which section level do you think your use of glossary terminology changes in a way that terms with a meaning in section A may could have a different meaning in section B?
> 2.  Are your sections verbose enough at the given section depth and do they mention enough glossary terms (on average) to help selecting the most appropriate definition for an ambiguous term occurrence?
>
> The default is `perSectionDepth: 2`. See details for our own answers which drove that decision.
>
> <details><ol><li> We expect a heading at level 1 to be a book title, especially in single-file projects. Then headings at level 2 denote book chapters. We assume it is more likely to introduce new topics with their own terminology at the level of chapters than at the level of sections within a chapter. Deeper sections may add details to a chapter's topic but do not change it, significantly. Therefore having separate term definition priorities at levels deeper than 2 may not be required in many situations.</li><li>The deeper the level the less words are being scanned and the less term occurrences can contribute to a glossary-ref-count distribution. The less glossary term occurrences the higher the weight of those few occurrences that have been mentioned when it comes to deciding on the most appropriate definition for an ambiguous term occurrence. At times this might exactly what you want. Then changing the default and counting separately for deeper levels would be sane. However, in general, the less words are being evaluated the higher the risk of not finding and counting enough glossary term occurrences in total, to make good decisions for ambiguous term occurrences in particular.</li> </ol>
>
> From this reasoning we concluded that `perSectionDepth: 2` seems to be a good tradeoff and sensible default.

</details>

[1]: ./ambiguities.md#linking-to-the-most-appropriate-term-definition

[2]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term-occurrence "A phrase in a Markdown file A which matches the phrase of a heading in a Markdown file B where B was configured to be a glossary file."

[3]: https://github.com/about-code/glossarify-md/blob/master/README.md

[4]: https://github.com/about-code/glossarify-md/blob/master/doc/glossary.md#term-definition "A term definition is, technically, the phrase of a heading in a Markdown file which was configured to be a glossary file."
