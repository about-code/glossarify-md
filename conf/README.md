# Configuration

- [Config Format v5](./v5/doc/schema.md).

## Config Format Versions

Versions in this directory reflect config *format* versions. A config format version corresponds to the major version of some glossarify-md release *which
introduced breaking changes* to the config format.

The `v5` format was introduced with `glossarify-md@5.0.0`. Newer versions of `glossarify-md` continue publishing the latest schema revision in a `v5` directory until there are breaking changes to the structure of the config format which require a new format version. In case of breaking changes *glossarify-md* aims to assist in upgrading configs to a newer version.

## Editor Support and Schema Compatibility

Many JSON editors provide assistance when referring to a JSON-Schema from within
a JSON file using a `$schema` property. There are two ways to do that.

#### Local References

Local references pull the schema from the local `./node_modules/` folder. With
local references you'll always get the latest schema which matches the version
you installed. A local reference may look like

*glossarify-md.conf.json*
~~~
{
  "$schema": "./node_modules/glossarify-md/conf/v5/schema.json"
}
~~~

#### Web References

Web References make editors pull the schema from the internet (if permitted).

*glossarify-md.conf.json*
~~~
{
  "$schema": "https://raw.githubusercontent.com/about-code/glossarify-md/v5.1.0/conf/v5/schema.json"
}
~~~

Unlike local references they do not only contain a config format version (`v5`)
but also a glossarify-md release version (`v5.1.0`). When installing a newer
release of glossarify-md (say `v5.2.0`) above configuration keeps on referring
to the previous release. This is guaranteed to work but your editor may not
suggest you the latest options. You need to adjust the URL manually after
updates. It will only get upgraded on breaking changes to the configuration
format. Therefore local references are usually the better choice.

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
