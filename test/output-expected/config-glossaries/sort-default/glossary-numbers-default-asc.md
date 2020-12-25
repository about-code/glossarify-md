# [Glossary Default Ascending](#glossary-default-ascending)

GIVEN this input file

*   AND a configuration

    ```json
    "glossaries": [{
        "file": "./glossary-numbers-default-asc.md" ,
        "sort": "asc"
    }]
    ```

*   AND an alphabet
    1.  0123456789

*   THEN the system should behave equal to a default configuration of

    ```json
    "i18n": {
        locale: "en",
        numeric: false,
        ignorePunctuation: false
    },
    "glossaries": [{
        "file": "./glossary-numbers-default-asc.md" ,
        "sort": "asc"
    }]
    ```

*   AND the following sections WITH a heading depth >= 2 MUST be sorted such that their numeric section bodies produce an **ascending** sequence

## [0-Term](#0-term)

0

## [1-Term](#1-term)

1

## [11-Term](#11-term)

2

## [111-Term](#111-term)

3

## [2-Term](#2-term)

4

## [3-Term](#3-term)

5

## [4-Term](#4-term)

6

## [5-Term](#5-term)

7

## [6-Term](#6-term)

8

## [7-Term](#7-term)

9

## [8-Term](#8-term)

10

## [9-Term](#9-term)

11
