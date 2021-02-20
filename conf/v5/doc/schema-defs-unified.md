# unified Properties



## plugins

Object or array with names of 'unified' and 'remark' plug-ins and plug-in settings as described in <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md>
Note that this configuration is not to be considered part of glossarify-md's own configuration interface!
If you like to keep 'unified' configuration separate use 'rcPath' to load a unified configuration from an external file.

`plugins`

*   is optional

*   Type: merged type ([Details](schema-defs-unified-properties-plugins.md))

## settings

Unified *processor* settings as described in <https://github.com/unifiedjs/unified-engine/blob/main/doc/configure.md> . glossarify-md uses the "remark" Markdown processor. To customize Markdown output style you can apply any *formatting options* documented at <https://github.com/syntax-tree/mdast-util-to-markdown#formatting-options> which is the module used by 'remark-stringify' to serialize (compile) the Markdown Abstract Syntax Tree that was created from Markdown text input back into Markdown text output.

`settings`

*   is optional

*   Type: `object` ([Details](schema-defs-unified-properties-settings.md))
