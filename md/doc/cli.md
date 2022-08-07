# Command Line Interface

For a full list of arguments use `--help`.

## Shortcuts

Let `npm` run a particular glossarify-md command-line for you by adding
`scripts` in your `package.json`:

*package.json*
~~~json
{
  "scripts": {
    "glossarify": "glossarify-md --config ./glossarify-md.conf.json"
  }
}
~~~

Next time run glossarify-md by just typing line 1 below.

```
1 | npm run glossarify
2 | npm run glossarify -- --help
```

Though, with npm you need additional ` -- ` before any arguments (line 2).

## Configuration Overrides

### `--shallow` | `--deep` (Since v4.0.0)

Use Cases

1. Provide a configuration solely via command line
2. Merge a configuration with a config file


**Example:** use `--shallow` to *replace* simple top-level options:
~~~
glossarify-md
  --config ./glossarify-md.conf.json
  --shallow "{ 'baseDir':'./docs', 'outDir':'../target' }"
~~~

**Example:** use `--shallow` to *replace* nested object-like options like `glossaries`:

~~~
glossarify-md
  --config ./glossarify-md.conf.json
  --shallow "{ 'glossaries': [{'file':'./replace.md'}] }"
~~~

**Example:** use `--deep` to *extend* nested object-like options e.g. to add another array item to `glossaries` in the config file:

~~~
glossarify-md
  --config ./glossarify-md.conf.json
  --deep "{'glossaries': [{'file':'./extend.md'}] }"
~~~
