## unified Default Value

The default value is:

```json
{}
```

## unified Examples

```json
{
  "rcPath": "./.remarkrc.json"
}
```

```json
{
  "settings": {
    "bullet": "*",
    "ruleRepetition": 3,
    "fences": true
  },
  "plugins": {
    "remark-frontmatter": {
      "type": "yaml",
      "marker": "-"
    }
  }
}
```

# unified Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                                                                    |
| :-------------------- | :------- | :------- | :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [rcPath](#rcpath)     | `string` | Optional | cannot be null | [Configuration Schema](schema-defs-unified-properties-rcpath.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/unified/properties/rcPath")     |
| [plugins](#plugins)   | Merged   | Optional | cannot be null | [Configuration Schema](schema-defs-unified-properties-plugins.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/unified/properties/plugins")   |
| [settings](#settings) | `object` | Optional | cannot be null | [Configuration Schema](schema-defs-unified-properties-settings.md "https://raw.githubusercontent.com/about-code/glossarify-md/v7.0.0/conf/v5/schema.json#/$defs/unified/properties/settings") |

## rcPath

Path to an external *unified* configuration file as documented under <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md>. See description of *unified* property why you may want such a configuration.

`rcPath`

*   is optional

*   Type: `string`

*   more: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md#plugins

## plugins

Object or array with names of *unified* and *remark* plug-ins and plug-in settings as described in <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md>
Note that this configuration is not to be considered part of glossarify-md's own configuration interface!
If you like to keep *unified* configuration separate use 'rcPath' to load a unified configuration from an external file.

`plugins`

*   is optional

*   Type: merged type ([Details](schema-defs-unified-properties-plugins.md))

*   more: https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md#plugins

## settings

Unified *processor* settings as described in <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md> . glossarify-md uses the "remark" Markdown processor. To customize Markdown output style you can apply any *formatting options* documented at <https://github.com/syntax-tree/mdast-util-to-markdown#formatting-options> which is the module used by 'remark-stringify' to serialize (compile) the Markdown Abstract Syntax Tree that was created from Markdown text input back into Markdown text output.

`settings`

*   is optional

*   Type: `object` ([Details](schema-defs-unified-properties-settings.md))
