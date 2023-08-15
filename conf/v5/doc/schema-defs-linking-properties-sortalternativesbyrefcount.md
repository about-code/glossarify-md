# sortAlternativesByRefCount Properties



## by

Sorting glossary definitions by 'glossary-ref-count' means priortizing term definitions from glossaries whose terms have been mentioned (referenced) more often over term definitions from glossaries whose terms have been mentioned less often in a particular section scope. Use of glossary terminology thus affects how ambiguous term occurrences will be linked. The algorithm uses a histogram where each occurrence of a term adds to the bar of the glossary the term has been defined in. Ambiguous term occurrences raise the bar of two or more glossaries. Eventually the glossaries will be priortized from largest bar to smallest bar which establishes a order on glossaries. The order will be used as sort criteria for term definitions of ambiguous terms. The 'most likely appropriate' term definition is considered to be provided by the glossary with the highest priority among those glossaries which provide a definition for the term. More technically: the numerical 'probability measure' will be the aggregated number of glossary references derived from term occurrences in a section. The likelihood function is a sort function sorting glossaries according to the probability measure in descending order. The 'most likely term definition' will be provided by the glossary which is found first in the list of glossaries known to provide a definition for the term.

`by`

*   is required

*   Type: `string`

### by Constraints

**constant**: the value of this property must be equal to:

```json
"glossary-ref-count"
```

## perSectionDepth

When there are ambiguous terms in a book one glossary term definition might be more appropriate in a section A while an alternative definition may be more appropriate in a section B. 'glossary-ref-count' can sort term definitions separately per section by evaluating term usage individually per section (see description of 'by' for how sorting by glossary-ref-count works).

Finding a good section depth: As a writer you may want to ask yourself at which heading depth it is more likely for you to change topics in a way that the meaning of ambiguous terms is more likely to change as well. For example, given your book is a single Markdown file then there is probably only one title heading '# Title' at heading depth 1. Given book chapters '## Chapter' at depth 2 cover different topics and use a topic-specific terminology while sections at heading depths 3 and deeper will only add details to the chapter's topic but do not change the overall topic and terminology of chapters. Then 'perSectionDepth: 2' can be a viable choice, because 'perSectionDepth: 1' would result in only a single term definition priority for the whole book. Consequently, an ambiguous term's primary definition would be the same in all chapters ignoring chapter-specific differences in terminology. In contrast, with 'perSectionDepth: 2' the algorithm determines a different term definition priority per chapter based on terminology use in those chapters. With 'perSectionDepth: 3' or deeper precision may or may not increase further. As a book writer when choosing the deeper value boundary you may also want to ask yourself how likely it is to having enough glossary terms at that depth, at all. The likelihood for finding (enough) term occurrences as samples for the term-glossary-distribution decreases with larger depths. With lower values for 'perSectionDepth' deeper sections use the same term-glossary-distribution and term definition priority as their parent sections. That distribution was derived from all of the parent's child sections, so the sampling space is larger. Because term-glossary-distributions at lower depths are always aggregations of more granular term-glossary-distributions from deeper levels for the term definition priority *at level 2* it will make no difference whether sampling only one term-glossary-distribution 'perSectionDepth: 2' or sampling multiple separate term-glossary-distributions 'perSectionDepth: 3' then aggregating their ref counts. For disambiguation of terms at section level 2 the difference is comparable to a bar chart where 'perSectionDepth: 3' only reveals how much each subsection contributes to the glossary-term-distribution without changing the total distribution, though. At level 2 the higher resolution is meaningless. It is only relevant for disambiguation at section levels of 3 or deeper.

`perSectionDepth`

*   is required

*   Type: `number`

### perSectionDepth Default Value

The default value is:

```json
2
```
