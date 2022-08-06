# Test: Shortcodes

[remark-shortcodes]: https://npmjs.com/package/remark-shortcodes
[Hugo]: https://gohugo.io

GIVEN

- the plug-in [remark-shortcodes] installed
- AND a configuration
   ~~~json
   {
     "unified": {
       "plugins": {
         "remark-shortcodes": {
           "startBlock": "{{<",
           "endBlock": "{{>"
         }
       }
     }
   }
   ~~~

...

## Test Case 1: Glossary term with a shortcode


- ... AND a glossary term *Shortcode* WITH [Hugo] shortcode syntax

THEN

1. the glossarify file MUST be written with the shortcodes *unmodified*
1. AND the term occurrence SHOULD have an unmodified short description.


## Test Case 2: Document with a shortcode

...
THEN

- the character sequence {{< shortcode >}}
- AND character sequence *between* code fences `{{< shortcode >}}`

MUST be equal.
