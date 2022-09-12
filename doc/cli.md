# [Command Line Interface](#command-line-interface)

Get a list of command line arguments by passing `--help`.

## [Shortcuts](#shortcuts)

If you have installed [glossarify-md][1] locally to a project folder with a `package.json` then you can define an `npm run` script in the `scripts` section of your `package.json`:

*package.json*

```json
{
  "scripts": {
    "glossarify": "glossarify-md --config ./glossarify-md.conf.json"
  }
}
```

Next time you can run [glossarify-md][1] by just typing line 1. Pass arguments after a `--` separator (line 2).

    1 | npm run glossarify
    2 | npm run glossarify -- --help

## [Configuration Overrides](#configuration-overrides)

### [`--shallow` | `--deep` (Since v4.0.0)](#--shallow----deep-since-v400)

Use Cases

1.  Provide a configuration solely via command line
2.  Merge a configuration with a config file

**Example:** use `--shallow` to *replace* simple top-level options:

    glossarify-md
      --config ./glossarify-md.conf.json
      --shallow "{ 'baseDir':'./docs', 'outDir':'../target' }"

**Example:** use `--shallow` to *replace* nested object-like options like `glossaries`:

    glossarify-md
      --config ./glossarify-md.conf.json
      --shallow "{ 'glossaries': [{'file':'./replace.md'}] }"

**Example:** use `--deep` to *extend* nested object-like options e.g. to add another array item to `glossaries` in the config file:

    glossarify-md
      --config ./glossarify-md.conf.json
      --deep "{'glossaries': [{'file':'./extend.md'}] }"

[1]: https://github.com/about-code/glossarify-md "This project."
