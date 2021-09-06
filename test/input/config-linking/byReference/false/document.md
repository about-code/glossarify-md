# Document

## Section

GIVEN a document *Document* mentioning glossary term *Term*
AND a configuration `linking.byReference: false`
THEN links MUST be placed inline similar to

~~~md
*[Term](./glossary.md#Term)*
~~~

AND MUST NOT be referenced using link references similar to

~~~md
*[Term][1]*

[1]: ./glossary.md#Term
~~~
