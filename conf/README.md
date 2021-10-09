# Configuration

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

Version `v5` in the path reflects the last major version of glossarify-md *which
introduced breaking changes* to the config *format*. So it is *not* the actual
schema version but a format version. For example, given  `glossarify-md@^6.0.0`
only adds new optional config properties, then it will come with the latest
schema but keep on reading it from a `v5` path. If some `glossarify-md@^7.0.0`
introduced breaking changes glossarify-md would try to assist you in upgrading
to a new `v7` config format and path.

#### Web References

Web References make editors pull the schema from the internet (if permitted).

*glossarify-md.conf.json*
~~~
{
  "$schema": "https://raw.githubusercontent.com/about-code/glossarify-md/v5.1.0/conf/v5/schema.json"
}
~~~

Unlike local references they may not only contain a config format version (`v5`)
but also a glossarify-md release version (`v5.1.0`). When installing a newer
glossarify-md release (say `v5.2.0`) above configuration keeps on referring to
the previous release. This is guaranteed to work but your editor may not provide
support for the latest options. To make it do so use `latest`:

*glossarify-md.conf.json*
~~~
{
  "$schema": "https://raw.githubusercontent.com/about-code/glossarify-md/latest/conf/v5/schema.json"
}
~~~

Like [Local References](#local-references) such a reference will keep on
working for all newer releases compatible with the `v5` config format.

> **Note:** If your editor doesn't offer the latest options consider that it may cached an older version.
