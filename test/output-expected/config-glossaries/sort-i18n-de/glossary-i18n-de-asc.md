# [Glossary i18n DE Ascending](#glossary-i18n-de-ascending)

GIVEN this input file

-   AND a configuration

    ```json
    "i18n": {
        locale: "de",
    },
    "glossaries": [{
        "file": "./glossary-i18n-de-asc.md" ,
        "sort": "asc"
    }]
    ```

-   AND an alphabet
    1.  aäbcoösßuüz
    2.  AÄBCOÖSUÜZ

-   THEN the system should behave equal to a default configuration of

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

## [a-Term](#a-term)

0

## [A-Term](#a-term-1)

1

## [ä-Term](#ä-term)

2

## [Ä-Term](#ä-term-1)

3

## [b-Term](#b-term)

4

## [B-Term](#b-term-1)

5

## [c-Term](#c-term)

6

## [C-Term](#c-term-1)

7

## [o-Term](#o-term)

8

## [O-Term](#o-term-1)

9

## [ö-Term](#ö-term)

10

## [Ö-Term](#ö-term-1)

11

## [s-Term](#s-term)

12

## [S-Term](#s-term-1)

13

## [ß-Term](#ß-term)

14

## [u-Term](#u-term)

15

## [U-Term](#u-term-1)

16

## [ü-Term](#ü-term)

17

## [Ü-Term](#ü-term-1)

18

## [z-Term](#z-term)

19

## [Z-Term](#z-term-1)

20
