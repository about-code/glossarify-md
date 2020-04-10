# Glossary Default Ascending

GIVEN this input file

- AND a configuration

    ```json
    "i18n": {
        "numeric": true
    },
    "glossaries": [{
        "file": "./glossary-i18n-compare-numeric-desc.md" ,
        "sort": "desc"
    }]
    ```

- AND an alphabet
  1. 0123456789

- THEN the system should behave equal to a default configuration of

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

- AND the following sections WITH a heading depth >= 2 MUST be sorted such that their numeric section bodies produce a **descending** sequence


## 0-Term

0

## 2-Term

2

## 4-Term

4

## 6-Term

6

## 8-Term

8

## 1-Term

1

## 11-Term

10

## 111-Term

11

## 3-Term

3

## 5-Term

5

## 7-Term

7

## 9-Term

9
