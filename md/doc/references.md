# Citations and References

[Shannon1948]: https://doi.org/10.1002/j.1538-7305.1948.tb01338.x

A way to use glossarify-md for citing and linking is to have a file, e.g. `references.md` ...

~~~md
# References

## Shannon1948
<!-- uri: https://doi.org/10.1002/j.1538-7305.1948.tb01338.x -->

C. E. Shannon, "A mathematical theory of communication," in The Bell System Technical Journal, vol. 27, no. 3, pp. 379-423, July 1948, doi: 10.1002/j.1538-7305.1948.tb01338.x.
~~~

...and configure it as a glossary:

~~~json
{
 "glossaries": [{
    "file": "./references.md",
    "linkUris": true
  }]
}
~~~

Use `linkUris: true` to make glossarify-md link occurrences of [Shannon1948] to the web using its `uri`. With `linkUris: false` (default) it links to `references.md`.

## More Examples

*Example: Linking mentions of [Shannon1948] by aliasing the works title:*
~~~md
# References

#### C. E. Shannon, "A mathematical theory of communication,"
<!--
aliases: Shannon1948
uri: https://doi.org/10.1002/j.1538-7305.1948.tb01338.x
-->

in The Bell System Technical Journal, vol. 27, no. 3, pp. 379-423, July 1948, doi: 10.1002/j.1538-7305.1948.tb01338.x.
~~~

*Example (rendered):*

# References

#### C. E. Shannon, "A mathematical theory of communication,"
<!--
aliases: Shannon1948
uri: https://doi.org/10.1002/j.1538-7305.1948.tb01338.x
-->

in The Bell System Technical Journal, vol. 27, no. 3, pp. 379-423, July 1948, doi: 10.1002/j.1538-7305.1948.tb01338.x.