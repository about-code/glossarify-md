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

## [a-Term](#a-term)

0

## [A-Term](#a-term-1)

11

## [ä-Term](#ä-term)

1

## [Ä-Term](#ä-term-1)

12

## [b-Term](#b-term)

2

## [B-Term](#b-term-1)

13

## [c-Term](#c-term)

3

## [C-Term](#c-term-1)

14

## [o-Term](#o-term)

4

## [O-Term](#o-term-1)

15

## [ö-Term](#ö-term)

5

## [Ö-Term](#ö-term-1)

16

## [s-Term](#s-term)

6

## [S-Term](#s-term-1)

17

## [ß-Term](#ß-term)

7

## [u-Term](#u-term)

8

## [U-Term](#u-term-1)

18

## [ü-Term](#ü-term)

9

## [Ü-Term](#ü-term-1)

19

## [z-Term](#z-term)

10

## [Z-Term](#z-term-1)

20
