# Title Depth 1

GIVEN

- a configuration

  ~~~json
  {
    "glossaries": [
      { "file": "./glossary-1.md" },
      { "file": "./glossary-2.md" },
      { "file": "./glossary-3.md" }
    ],
    "indexing": {
      "groupByHeadingDepth": 2
    },
    "generateFiles": {
      "indexFiles": [{
        "file": "./index-1-hide-true.md",
        "glossary": "./glossary-1.md",
        "hideDeepLinks": true
      },{
        "file": "./index-2-hide-false.md",
        "glossary": "./glossary-2.md",
        "hideDeepLinks": false
      },{
        "file": "./index-3-hide-default.md",
        "glossary": "./glossary-3.md"
      }]
    }
  }
  ~~~

- AND three glossaries
  - `glossary-1.md` WITH term *Term1*
  - `glossary-2.md` WITH term *Term2*
  - `glossary-3.md` WITH term *Term3*
- AND these terms being mentioned in *this* file
  - AND in *this section* at depth 1
  - AND in *sections below* being sections at depths 2 to 6
- AND `indexing.groupByHeadingDepth: 2`

THEN

- three index files must be generated
  - AND `./index-1-hide-true.md`
    - MUST have a single entry *Term1*
    - AND there MUST be links to sections
      - Glossary 1
      - Title Depth 1
      - Section Depth 2
  - AND `./index-2-hide-false.md`
    - MUST have a single entry *Term2*
    - AND there MUST be links
      - WITH label *Glossary 1* linking to document section *Glossary 1*
      - WITH label *Title Depth 1* linking to document section *Title Depth 1*
      - WITH label *Section Depth 2* linking to document section *Section Depth 2*
        - WITH label *2* linking to document section *Section Depth 3*
        - WITH label *3* linking to document section *Section Depth 4*
        - WITH label *4* linking to document section *Section Depth 5*
        - WITH label *5* linking to document section *Section Depth 6*
  - AND `./index-3-hide-default.md`
     - MUST have a single entry *Term3*
     - AND MUST otherwise generate links identical to `./index-2-hide-false.md`
       because the default is expected to be `hideDeepLinks: false`.


## Section Depth 2

Term1, Term2, Term3.

### Section Depth 3

Term1, Term2, Term3.

#### Section Depth 4

Term1, Term2, Term3.

##### Section Depth 5

Term1, Term2, Term3.

###### Section Depth 6

Term1, Term2, Term3.
