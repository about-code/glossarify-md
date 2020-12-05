# [Test Case](#test-case)

GIVEN

-   a directory `docs`
-   a markdown file `./docs/document.md`
-   a markdown file `./docs/glossary.md`
-   a glossary term [INIT][1]
-   a command line (multiple lines for readability only)

        npx glossarify-md --init > glossarify-md.conf.json
        && npx glossarify-md --config ./glossarify-md.conf.json`

THEN

-   the files MUST be processable without errors

AND

-   the term should be replaced with a link to its glossary definition.

[1]: ./glossary.md#init "Initialize a configuration via npx glossarify-md --init."
