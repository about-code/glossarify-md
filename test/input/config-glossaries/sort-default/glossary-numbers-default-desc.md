# Glossary Default Ascending

GIVEN this input file

- AND a configuration

    ```json
    "glossaries": [
        {
            "file": "./glossary-numbers-default-desc.md" ,
            "sort": "desc"
        }
    ]
    ```

- AND an alphabet
  1. 0123456789

- THEN the system should behave equal to a default configuration of

    ```json
    "i18n": {
        locale: "en",
        compare: {
            numeric: false,
            ignorePunctuation: false
        }
    },
    "glossaries": [
        {
            "file": "./glossary-numbers-default-desc.md" ,
            "sort": "desc"
        }
    ]
    ```

- AND the following sections WITH a heading depth >= 2 MUST be sorted such that their numeric section bodies produce a **descending** sequence


## 0-Term

0

## 2-Term

4

## 4-Term

6

## 6-Term

8

## 8-Term

10

## 1-Term

1

## 11-Term

2

## 111-Term

3

## 3-Term

5

## 5-Term

7

## 7-Term

9

## 9-Term

11
