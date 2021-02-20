# Unified Properties

| Property              | Type     | Required | Nullable       | Defined by                                                                                                                                                                                              |
| :-------------------- | :------- | :------- | :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [plugins](#plugins)   | Merged   | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-unified-properties-plugins.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Unified/properties/plugins")   |
| [settings](#settings) | `object` | Optional | cannot be null | [glossarify-md.conf.json Schema](schema-defs-unified-properties-settings.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Unified/properties/settings") |

## plugins

Object or array with names of 'unified' and 'remark' plug-ins and plug-in settings as described in <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md>
Note that this configuration is not to be considered part of glossarify-md's own configuration interface!
If you like to keep 'unified' configuration separate use 'rcPath' to load a unified configuration from an external file.

`plugins`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-unified-properties-plugins.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Unified/properties/plugins")

## settings

Unified *processor* settings as described in <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md> . glossarify-md uses the "remark" Markdown processor. To customize Markdown output style you can apply any *formatting options* documented at <https://github.com/syntax-tree/mdast-util-to-markdown#formatting-options> which is the module used by 'remark-stringify' to serialize (compile) the Markdown Abstract Syntax Tree that was created from Markdown text input back into Markdown text output.

`settings`

*   is optional

*   defined in: [glossarify-md.conf.json Schema](schema-defs-unified-properties-settings.md "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json#/$defs/Unified/properties/settings")
