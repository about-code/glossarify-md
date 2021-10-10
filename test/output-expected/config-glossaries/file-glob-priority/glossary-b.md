# [Glossary A](#glossary-a)

GIVEN a configuration with a `glossaries` configuration in a particular order

```json
{
  "glossaries": [
    { "file": "./glossary*.md",   "termHint": "==C"  },
    { "file": "./glossary-a*.md", "termHint": "==AB" },
    { "file": "./glossary-a.md",  "termHint": "==A"  },
    { "file": "./glossary-b*.md", "termHint": "==B"  }
  ]
}
```

AND this glossary matches glob patterns (file sets)

```json
[
  X { "file": "./glossary-b*.md", "termHint": "==B"  }
]
```

THEN for terms of *this* glossary when found in [document.md][1]
the `termHint` of file set marked with `X` MUST be used ("LAST WINS").

## [B_erlin](#b_erlin)

Expect termHint '==B'

## [B_ern](#b_ern)

Expect termHint '==B'

[1]: ./document.md
