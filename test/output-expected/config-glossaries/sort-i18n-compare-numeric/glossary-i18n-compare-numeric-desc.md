# [Glossary Default Ascending](#glossary-default-ascending)

GIVEN this input file

-   AND a configuration

    ```json
    "i18n": {
        "numeric": true
    },
    "glossaries": [{
        "file": "./glossary-i18n-compare-numeric-desc.md" ,
        "sort": "desc"
    }]
    ```

-   AND an alphabet
    1.  0123456789

-   THEN the system should behave equal to a default configuration of

    ```json
    "i18n": {
        locale: "en",
        numeric: true,
        ignorePunctuation: false
    },
    "glossaries": [{
        "file": "./glossary-i18n-compare-numeric-desc.md" ,
        "sort": "desc"
    }]
    ```

-   AND the following sections WITH a heading depth >= 2 MUST be sorted such that their numeric section bodies produce a **descending** sequence

## [111-Term](#111-term)

11

## [11-Term](#11-term)

10

## [9-Term](#9-term)

9

## [8-Term](#8-term)

8

## [7-Term](#7-term)

7

## [6-Term](#6-term)

6

## [5-Term](#5-term)

5

## [4-Term](#4-term)

4

## [3-Term](#3-term)

3

## [2-Term](#2-term)

2

## [1-Term](#1-term)

1

## [0-Term](#0-term)

0
