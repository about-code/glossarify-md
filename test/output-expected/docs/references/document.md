# [Document](#md5-0a9a7c4)

GIVEN a file `references.md`
AND a complex heading reflecting IEEE citation style

    ###### C. E. Shannon, "A mathematical theory of communication," in The Bell System Technical Journal, vol. 27, no. 3, pp. 379-423, July 1948, doi: 10.1002/j.1538-7305.1948.tb01338.x.
    <!--
    uri: https://doi.org/10.1002/j.1538-7305.1948.tb01338.x
    aliases: Shannon1948
    -->

AND a document `document.md` citing [Shannon1948][1]
THEN the citation MUST be linked to `references.md`.

[1]: ./references.md#md5-68189da
