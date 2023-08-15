# items Properties



## class

The class is used to compile lists of content elements. Elements with a common class will be compiled into the same list.

`class`

*   is optional

*   Type: `string`

## file

Path relative to 'outDir' where to create the index markdown file.

`file`

*   is optional

*   Type: `string`

## pattern

A regular expression which when matching against text will generate an entry in the given list. The expression may contain a capture group which extracts a list item title. A match will result in an URL-addressable HTML node being added to the output.

`pattern`

*   is optional

*   Type: `string`

## title

The page title for the index file. If missing the application uses a default value.

`title`

*   is optional

*   Type: `string`
