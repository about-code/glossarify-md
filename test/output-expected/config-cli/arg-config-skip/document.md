GIVEN

-   command-line `--shallow "{ 'baseDir':'./input/config-cli/no-file', 'outDir':'../../../output-actual/config-cli/no-file', 'includeFiles':['.'], 'glossaries':[{'file':'./glossary.md'}] }"`

AND

-   no config file

THEN

-   glossarify-md MUST be able to work without a config file.

AND

-   term '[Term][1]' MUST be linked to the glossary.

[1]: ./glossary.md#term
