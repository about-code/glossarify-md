GIVEN plain text THEN "[Lorem ipsum↴][1]" MUST be linked to glossary.

GIVEN italic format THEN "_[Lorem ipsum↴][1]_" MUST be linked to glossary WITH being kept italic.

GIVEN bold format THEN "**[Lorem ipsum↴][1]**" MUST be linked to glossary WITH being kept bold.

[1]: ../glossary.md#lorem-ipsum "Lorem ipsum is the worlds most famous, most beloved piece of nonsense."
