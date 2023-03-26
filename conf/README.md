# Configure

[doc-readme]: ../doc/install.md
[doc-cli]: ../doc/cli.md


[All config options (Config Format v5)](./v5/doc/schema.md)
~~~
npx glossarify-md --config [file]
~~~

## Generate a config file

~~~
npx glossarify-md --init
~~~

- add `--new`
  - to write to a config file `./glossarify-md.conf.json`
  - to create a glossary file `./docs/glossary.md`
- add `--local` to load the config `$schema` from `./node_modules` ([see below](#local-schema))
- add `--more` to write a verbose config with more options and their default values

*Example: Writing console outputs to a file*
~~~
npx glossarify-md --init --local > my-own.conf.json
~~~


*Example: Minimal configuration*
~~~
{
  "$schema": "./node_modules/glossarify-md/conf/v5/schema.json",
  "baseDir": "./docs",
  "outDir": "../docs-glossarified"
}
~~~



> **ⓘ Paths**
>
> 1. `baseDir` and `$schema` are resolved relative to the config file or current working directory (when passed via CLI)
> 1. all other paths  are resolved relative to `baseDir`
> 1. `outDir` *must not* be in `baseDir`so, if relative, must step out of `baseDir`
> 1. prefer relative paths over absolute paths in the configuration

## Editor Support

Many IDEs and editors provide suggestions for JSON files with a `$schema` property locating a JSON Schema.

### Local `$schema`

... is **recommended** when glossarify-md was [installed][doc-readme] using `npm install` (*without* the `-g` switch). If supported, an editor loads the schema from the `./node_modules/` directory of your project, thus it can suggest you the config options matching your currently installed version of glossarify-md.

~~~json
{
  "$schema": "./node_modules/glossarify-md/conf/v5/schema.json"
}
~~~

### Remote `$schema`

...may be used when glossarify-md was installed using `npm install -g`. It requires editors downloading the schema from a remote location.

~~~json
{
  "$schema": "https://raw.githubusercontent.com/about-code/glossarify-md/v6.1.0/conf/v5/schema.json"
}
~~~

> **ⓘ Note** The remote `$schema` URL contains a config *format version* (`v5`) and a glossarify-md *release version* (`v6.1.0`). The release version is the glossarify-md version *which initially generated the config file*. When you install a newer release of glossarify-md (say `v6.2.0`) the URL *won't* be updated and keeps on referring to `v6.1.0`. Therefore, your editor or IDE won't suggest you *the latest* options available for `v6.2.0` when editing the config file. However, glossarify-md will inform you when it detects this situation.
>
> On breaking changes affecting the *format version* glossarify-md will attempt to provide assistance on upgrading your configuration files including the `$schema` URL. This should happen *rarely*, though.