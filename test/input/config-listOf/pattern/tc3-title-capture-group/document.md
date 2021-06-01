# Tests for pattern-based lists

## Test Case

GIVEN a configuration

```md
{
   "generateFiles": {
       "listOf": [      {
        "class": "test",
        "file": "./list.md",
        "title": "Test Case",
        "pattern": ":::[ ]?tip Tipp[:]? ([a-zA-Z0-9].*)"
      }]
   }
}
```

AND a container node

:::tip Tipp: Extract me
The title of this container should be extracted
:::

THEN the system MUST generate a list item with list item label `Extract me`
