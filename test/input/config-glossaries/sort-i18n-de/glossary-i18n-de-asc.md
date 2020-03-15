# Glossary i18n DE Ascending

GIVEN this input file

- AND a configuration

    ```json
    "i18n": {
        locale: "de",
    },
    "glossaries": [{
        "file": "./glossary-i18n-de-asc.md" ,
        "sort": "asc"
    }]
    ```

- AND an alphabet
  1. aäbcoösßuüz
  2. AÄBCOÖSUÜZ

- THEN the system should behave equal to a default configuration of

    ```json
    "i18n": {
        locale: "de",
        compare: {
            numeric: false,
            ignorePunctuation: false
        }
    },
    "glossaries": [{
        "file": "./glossary-i18n-de-asc.md" ,
        "sort": "asc"
    }]
    ```

-   AND the following sections WITH a heading depth >= 2 MUST be sorted such that their numeric section bodies produce an **ascending** sequence

## a-Term
0
## b-Term
2
## o-Term
4
## s-Term
6
## u-Term
8
## z-Term
10
## ä-Term
1
## c-Term
3
## ö-Term
5
## ß-Term
7
## ü-Term
9

## Ä-Term
12
## C-Term
14
## Ö-Term
16
## U-Term
18
## Z-Term
20
## A-Term
11
## B-Term
13
## O-Term
15
## S-Term
17
## Ü-Term
19
