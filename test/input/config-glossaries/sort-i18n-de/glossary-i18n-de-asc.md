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
        numeric: false,
        ignorePunctuation: false
    },
    "glossaries": [{
        "file": "./glossary-i18n-de-asc.md" ,
        "sort": "asc"
    }]
    ```

-   AND the following sections WITH a heading depth >= 2 MUST be sorted such that their numeric section bodies produce an **ascending** sequence

## a-Term
0
## ä-Term
2
## b-Term
4
## c-Term
6
## o-Term
8
## ö-Term
10
## s-Term
12
## ß-Term
14
## U-Term
16
## Ü-Term
18
## Z-Term
20

## A-Term
1
## Ä-Term
3
## B-Term
5
## C-Term
7
## O-Term
9
## Ö-Term
11
## S-Term
13
## u-Term
15
## ü-Term
17
## z-Term
19
