# [Citations and References](#citations-and-references)

You might want to cite sources *and* link to them when citing them online. A way to do this with [glossarify-md][1] is to have a file, e.g. `references.md` and configure it as a [glossary][2]:

```json
{
 "glossaries": [{
    "file": "./references.md",
    "linkUris": true
  }]
}
```

Use `linkUris: true` to make [glossarify-md][1] link occurrences of *Shannon1948* using `uri`. Use `linkUris: false` (default) to link to `references.md`.

*Example: <x>references.md</x> using the reference keyword in a heading*

```md
# References

## Shannon1948
<!--
uri: https://doi.org/10.1002/j.1538-7305.1948.tb01338.x
-->
C. E. Shannon, "A mathematical theory of communication," in The Bell System Technical Journal, vol. 27, no. 3, pp. 379-423, July 1948, doi: 10.1002/j.1538-7305.1948.tb01338.x.
```

*Example: <x>references.md</x> using a flat list and reference keywords as aliases*

```md
# References

###### C. E. Shannon, "A mathematical theory of communication," in The Bell System Technical Journal, vol. 27, no. 3, pp. 379-423, July 1948, doi: 10.1002/j.1538-7305.1948.tb01338.x.
<!--
uri: https://doi.org/10.1002/j.1538-7305.1948.tb01338.x
aliases: Shannon1948
-->
```

> **⚠ Important** The examples may not be acceptable in terms of academic or scientific standards.

[1]: https://github.com/about-code/glossarify-md

[2]: https://github.com/about-code/glossarify-md/tree/master/doc/glossary.md
