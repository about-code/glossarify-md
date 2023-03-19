# Configuration

[doc-readme]: ../doc/install.md
[doc-cli]: ../doc/cli.md

- [Config Format v5](./v5/doc/schema.md).

## Generate a config file with `--init`

Use `--init` to write a *minimal* config to the console.
- add `--more` to write a config with more options and default values
- add `--local` to load the config schema from the `node_modules` directory (see [Local Referencing](#local-referencing) below)
- add `--new`  to write a config to `./glossarify-md.conf.json` and a glossary to `./docs/glossary.md`

*Example: Writing a minimal configuration to the console*
~~~
npx glossarify-md --init --local

{
  "$schema": "./node_modules/glossarify-md/conf/v5/schema.json",
  "baseDir": "./docs",
  "outDir": "../docs-glossarified"
}
~~~

*Example: Writing a minimal configuration to a file*
~~~
npx glossarify-md --init --local > glossarify-md.conf.json
~~~

*Example: Initializing a new glossarify-md project with a minimal configuration*
~~~
npx glossarify-md --init --local --new
~~~

*Example: Configuring glossarify-md via CLI*
~~~
npx glossarify-md --shallow "{ 'baseDir':'./docs', 'outDir':'../target', 'glossaries': ['./glossary.md'] }"
~~~

More on configuring glossarify-md by its command-line interface see [CLI][doc-cli].


> **ⓘ Paths**
>
> 1. `baseDir` and `$schema` are resolved relative to the config file or current working directory (when passed via CLI)
> 1. all other paths  are resolved relative to `baseDir`
> 1. `outDir` *must not* be in `baseDir`so, if relative, must step out of `baseDir`
> 1. prefer relative paths over absolute paths in the configuration

## Editor Support

Many IDEs and editors provide suggestions when editing JSON files that refer to a JSON Schema using a conventional `$schema` property. There are two ways to refer to a glossarify-md config schema.

### Local Referencing

Local referencing is **recommended** when glossarify-md was [installed "locally"][doc-readme] to a project. It references the config schema of the glossarify-md version installed to the `./node_modules/` folder of the project. This way your editor can suggest all the latest options supported by the installed version.

*glossarify-md.conf.json*
~~~
{
  "$schema": "./node_modules/glossarify-md/conf/v5/schema.json"
}
~~~

### Web References

Web references are intended to be used when glossarify-md was installed "globally" using `npm install -g`. They will be generated when omitting the `--local` option.

*glossarify-md.conf.json*
~~~
{
  "$schema": "https://raw.githubusercontent.com/about-code/glossarify-md/v6.1.0/conf/v5/schema.json"
}
~~~

> **ⓘ Note** A web reference contains a config *format version* (e.g. `v5`) but also a particular *release version* (e.g. `v6.1.0`). The release version is the version of the glossarify-md release *that initially generated the config*. When you later install newer release versions of glossarify-md (say `v6.2.0`) the release version in the web reference *won't* be updated. Your config files may keep on referring to `v6.1.0`. This is not an issue at all due to the config format which hasn't changed. But your editor or IDE won't suggest you *the latest* options that might have been added to feature glossarify-md `v6.2.0` until you change the *release version*, manually. You'll receive a hint from glossarify-md if it detects such a situation. On breaking changes to the *configuration format*, though, glossarify-md will attempt to provide assistance on upgrading your configuration including the format version in a web reference.
