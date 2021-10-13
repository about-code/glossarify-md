# Glossary AB-1

GIVEN a configuration with a `glossaries` configuration in a particular order

~~~json
{
  "glossaries": [
    { "file": "./glossary*.md",   "termHint": "==C"  },
    { "file": "./glossary-a*.md", "termHint": "==AB" },
    { "file": "./glossary-a.md",  "termHint": "==A"  },
    { "file": "./glossary-b*.md", "termHint": "==B"  }
  ]
}
~~~

AND this glossary matches glob patterns (file sets)

~~~json
[
    { "file": "./glossary*.md",   "termHint": "==C"  },
  X { "file": "./glossary-a*.md", "termHint": "==AB" },
]
~~~

THEN for terms of *this* glossary when found in [document.md](./document.md)
the `termHint` of file set marked with `X` MUST be used ("LAST WINS").

## AB_solute

Expect termHint '==AB'

## AB_normal

Expect termHint '==AB'
