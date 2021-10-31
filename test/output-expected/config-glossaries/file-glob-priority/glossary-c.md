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
  X { "file": "./glossary*.md", "termHint": "==C"  }
]
```

THEN for terms of *this* glossary when found in [document.md][1]
the `termHint` of file set marked with `X` MUST be used ("LAST WINS").

## [C\_olosseum](#c_olosseum)

Expect termHint '==C'

## [C\_omission](#c_omission)

Expect termHint '==C'

[1]: ./document.md
