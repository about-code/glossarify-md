# Configuration

[doc-readme]: ../README.md#install

- [Config Format v5](./v5/doc/schema.md).

## Generate a config file with `--init`

Use `--init` to write a *minimal* config to the console.
- add `--more` to write a config with more options and default values
- add `--local` to load the config schema from the `node_modules` directory
- add `--new`  to write a config to `./glossarify-md.conf.json` and a glossary to `./docs/glossary.md`

Examples:

Write config to console
~~~
npx glossarify-md --init --local

{
  "$schema": "./node_modules/glossarify-md/conf/v5/schema.json",
  "baseDir": "./docs",
  "outDir": "../docs-glossarified"
}
~~~

Write config from console to a file
~~~
npx glossarify-md --init --local > glossarify-md.conf.json
~~~

Write config with default filename and initialize a ./doc/ directory with a glossary file.
~~~
npx glossarify-md --init --local --new
~~~

> **ⓘ Paths**
>
> 1. `baseDir` and `$schema` are resolved relative to the config file or current working directory (when passed via CLI)
> 1. all other paths  are resolved relative to `baseDir`
> 1. `outDir` *must not* be in `baseDir`so, if relative, must step out of `baseDir`


## Editor Support

Many IDEs and editors provide suggestions when editing JSON files that refer to a JSON Schema using a conventional `$schema` property. There are two ways to refer to a glossarify-md config schema.

### Local Referencing with `--local` 

Local referencing is the **recommended** way **when glossarify-md was [installed "locally"][doc-readme] to a project**. It references the config schema of the glossarify-md version installed to the `./node_modules/` folder of the project. This way your editor can suggest all the latest options supported by the installed version.

*glossarify-md.conf.json*
~~~
{
  "$schema": "./node_modules/glossarify-md/conf/v5/schema.json"
}
~~~

### Web References

Web references  are intended to be used when glossarify-md was installed "globally" using `npm install -g`. They will be generated when omitting the `--local` option.

*glossarify-md.conf.json*
~~~
{
  "$schema": "https://raw.githubusercontent.com/about-code/glossarify-md/v5.1.0/conf/v5/schema.json"
}
~~~

> **ⓘ** Note that the web reference contains a config *format version* `v5` but also a particular *release version* `v5.1.0`. The latter is the version by the glossarify-md release that generated the config. If you later install a newer version of glossarify-md (say `v5.2.0`) web references in your config files **will only get upgraded on breaking changes to the configuration format**. Thus your config files may keep on referring to `v5.1.0`. Due to backwards compatibility this isn't a problem but your editor won't suggest you *the latest* options that could be used with glossarify-md `v5.2.0`. For this to happen change the *release version* in the path, manually.



<!--
If you use `latest` release version your editor will suggest you options from
the 'latest' tag. But there may be options not yet supported by the release
you've installed, locally. Keep that in mind otherwise you're wasting time
trying things that can't work until you update.

*glossarify-md.conf.json*
~~~
{
  "$schema": "https://raw.githubusercontent.com/about-code/glossarify-md/latest/conf/v5/schema.json"
}
~~~

> **Note:** If your editor doesn't validate against the latest version it may have cached an older version.

IMPORTANT:
When introducing a new config format version KEEP the previous format's /conf/v.. folder.
Otherwise moving the 'latest' tag forward onto a new revision which misses the old folder would
cause $schema-URLs onto the old path to break, although still widely in public use:

https://raw.githubusercontent.com/about-code/glossarify-md/latest/conf/---BREAKING--/schema.json

We may only remove versions after they phased out and will no longer be supported.
-->
