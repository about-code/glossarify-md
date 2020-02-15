# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [3.4.0](https://github.com/about-code/glossarify-md/compare/v3.3.0...v3.4.0) (2020-02-15)

### Features

* Generate a list of tables. New option `generateFiles.listOfTables`. See also [README.md](https://github.com/about-code/glossarify-md#list-of-tables). ([#67](https://github.com/about-code/glossarify-md/issues/62)) ([ef91d9d](https://github.com/about-code/glossarify-md/commit/ef91d9d))

* Allow to configure heading depth for less cluttered index file ([#71](https://github.com/about-code/glossarify-md/issues/71)) ([04ed7f8](https://github.com/about-code/glossarify-md/commit/04ed7f8))

## [3.3.0](https://github.com/about-code/glossarify-md/compare/v3.2.0...v3.3.0) (2020-01-19)

### Bug Fixes

* Option `--reportNotMentioned` is ignored. With this fix please pass `--reportNotMentioned` explicitely via command line or config file to keep on being informed about unused terms. ([#67](https://github.com/about-code/glossarify-md/issues/67)) ([dbbf4a4](https://github.com/about-code/glossarify-md/commit/dbbf4a4))

* Index: term headings should be at depth 2 ([#64](https://github.com/about-code/glossarify-md/issues/64)) ([792253e](https://github.com/about-code/glossarify-md/commit/792253e))

### Features

* Generate a List of Figures with option `generateFiles.listOfFigures`. More see README.md. ([#61](https://github.com/about-code/glossarify-md/issues/61)) ([2c57ace](https://github.com/about-code/glossarify-md/commit/2c57ace))


## [3.2.0](https://github.com/about-code/glossarify-md/compare/v3.1.0...v3.2.0) (2019-12-29)


### Bug Fixes

* Errorneous file links with config option `linking: "absolute"` and `generateFiles.indexFile`. ([293c7eb](https://github.com/about-code/glossarify-md/commit/293c7eb))

* Only last occurrence of a shared term gets linked with all its definitions. ([#55](https://github.com/about-code/glossarify-md/issues/55)) ([c891c87](https://github.com/about-code/glossarify-md/commit/c891c87))

### Features

* Use superscript typesetting for ambiguously defined term links. ([#57](https://github.com/about-code/glossarify-md/issues/57)) ([0b98e43](https://github.com/about-code/glossarify-md/commit/1bf9f37))


## [3.1.0](https://github.com/about-code/glossarify-md/compare/v3.0.0...v3.1.0) (2019-12-24)


### Bug Fixes

* escape terms containing characters with special meaning in regExp ([1815304](https://github.com/about-code/glossarify-md/commit/1815304))
* v3.0.0 linkified headings don't play well with vuepress. Closes [#48](https://github.com/about-code/glossarify-md/issues/48). ([e9485f2](https://github.com/about-code/glossarify-md/commit/e9485f2))


### Deprecation Notices

* Value range 'string' of config option 'generateFiles.indexFile'. Use object instead (see README.md). ([ceb7e0c](https://github.com/about-code/glossarify-md/commit/ceb7e0c))


### Features

* Custom page title for generated index file can now be set. ([0b98e43](https://github.com/about-code/glossarify-md/commit/0b98e43))
* link usage of (other) terms in a term's glossary definition. ([671d1ee](https://github.com/about-code/glossarify-md/commit/671d1ee))

## [3.0.0](https://github.com/about-code/glossarify-md/compare/v2.1.0...v3.0.0) (2019-12-14)


### ⚠ BREAKING CHANGES

* **v3.0.0:** End of support for nodejs 8.x (LTS). Versions of glossarify-md >= 3.0.0
may continue to work with nodejs 8.x but may also begin to use JS language
features and APIs earliest available with nodejs 10.x LTS. Such changes
may be introduced with any new version including bugfix versions and without
notice or classification of being breaking changes to nodejs 8.x users.
* With this change section headings will be automatically linkified. URL fragments of section headings may change thus affecting inter-document cross-links or bookmarks of already published documentation. Note: links and bookmarks will continue to point the same *page* yet not the correct section on that page. Prior section headings which have manually been wrapped into markdown link brackets may get wrapped twice. Review any output prior to publishing it.

### Documentation Updates

* **CONTRIBUTING.md:** Rework debug section ([25a1288](https://github.com/about-code/glossarify-md/commit/25a1288))


### Features

* Report on glossary terms never mentioned in text ([#43](https://github.com/about-code/glossarify-md/issues/43)) ([96a7415](https://github.com/about-code/glossarify-md/commit/96a7415))


* 3 support backlinks from definition to usage (#46) ([9d06dd6](https://github.com/about-code/glossarify-md/commit/9d06dd6)), closes [#46](https://github.com/about-code/glossarify-md/issues/46) [#3](https://github.com/about-code/glossarify-md/issues/3)
* **v3.0.0:** New node support matrix ([#45](https://github.com/about-code/glossarify-md/issues/45)) ([#47](https://github.com/about-code/glossarify-md/issues/47)) ([c140016](https://github.com/about-code/glossarify-md/commit/c140016))

### [2.1.1](https://github.com/about-code/glossarify-md/compare/v2.1.0...v2.1.1) (2019-12-04)

### Bug Fixes

* In cases where the alias began with the term as a substring, then ocurrences of the alias were no longer linked. For example if the term is *Cat* and the alias is *Cats*, then occurrences of *Cats* were no longer linked to the glossary term *Cat*. ([#41](https://github.com/about-code/glossarify-md/issues/41)) ([4ace562](https://github.com/about-code/glossarify-md/commit/4ace562))

## [2.1.0](https://github.com/about-code/glossarify-md/compare/v2.0.0...v2.1.0) (2019-10-04)

### Features

* New option `--experimentalFootnotes` for Markdown footnotes ([#38](https://github.com/about-code/glossarify-md/issues/38)). Support for Pandoc footnote syntax  will be considered *experimental* until it becomes part of the official CommonMark Specification at https://spec.commonmark.org. See also https://pandoc.org/MANUAL.html#footnotes. ([f75a21c](https://github.com/about-code/glossarify-md/commit/f75a21c))
---

### [2.0.1](https://github.com/about-code/glossarify-md/compare/v2.0.0...v2.0.1) (2019-10-04)


### Bug Fixes

* Glossary-terms flanked by `(` or `)` wouldn't get linked ([#37](https://github.com/about-code/glossarify-md/issues/37)) ([ee998e7](https://github.com/about-code/glossarify-md/commit/ee998e7))
* remove Firefox remote debugging. Not for nodejs. ([8d77ce2](https://github.com/about-code/glossarify-md/commit/8d77ce2))


### Documentation Updates

* **README.md:** Fix document output example (replace inline link with reference) ([d3d147e](https://github.com/about-code/glossarify-md/commit/d3d147e))
* **vuepress:** Include a link to vuepress issue 1815. ([62f19e7](https://github.com/about-code/glossarify-md/commit/62f19e7))

## [2.0.0](https://github.com/about-code/glossarify-md/compare/v1.1.3...v2.0.0) (2019-10-01)


### ⚠ BREAKING CHANGES

* **cli:** No `--baseDir` and `--outDir` default values anymore. You will be asked for explicit values if none provided.
* **cli:** Now stops if `--baseDir` and `--outDir` resolve to the same directory to prevent accidental overwriting of source files. Can be ignored with `--force` flag.
* **cli:** CLI options now take precedence over config file options, if the same option exists in the config file loaded via `--config` and as a command line argument.

### Bug Fixes

* Short description not correctly extracted ([#30](https://github.com/about-code/glossarify-md/issues/30)) ([eff54b4](https://github.com/about-code/glossarify-md/commit/eff54b4))
* Runtime error `path.absolute is not a function` for configuration `linking: absolute` and `baseUrl: ""` ([538c65d](https://github.com/about-code/glossarify-md/commit/538c65d))
* **cli:** CLI argument handling and defaults ([c55cee0](https://github.com/about-code/glossarify-md/commit/c55cee0))
* **test:** Make `npm run commit-baseline` run tests first. Reset git index before commit and include new test artifacts on commit. ([19fd039](https://github.com/about-code/glossarify-md/commit/19fd039))

### Features

* Option to let user define position of term hint ([#10](https://github.com/about-code/glossarify-md/issues/10)) ([0569652](https://github.com/about-code/glossarify-md/commit/0569652))

### [1.1.3](https://github.com/about-code/glossarify-md/compare/v1.1.2...v1.1.3) (2019-09-26)


### Bug Fixes

* Aliases: Trailing comma causes infinite loop with out-of-memory failure ([#26](https://github.com/about-code/glossarify-md/issues/26)). ([d5ddd5b](https://github.com/about-code/glossarify-md/commit/d5ddd5b))


### Documentation Updates

* **CONTRIBUTING.md:** Using glossarify-md debug config and experimental debugging ([7c47169](https://github.com/about-code/glossarify-md/commit/7c47169))
* **README.md:** Update sample. Fix wrong default value for 'baseDir'. ([7959d80](https://github.com/about-code/glossarify-md/commit/7959d80))

### [1.1.2](https://github.com/about-code/glossarify-md/compare/v1.1.1...v1.1.2) (2019-09-25)


### Bug Fixes

* dangling anchor links with german umlauts ([#27](https://github.com/about-code/glossarify-md/issues/27)). See updates to doc/vuepress.md and slugify option. ([475d692](https://github.com/about-code/glossarify-md/commit/475d692))
* package.json declares wrong 'main' ([0dc107d](https://github.com/about-code/glossarify-md/commit/0dc107d))
* Security. Update package-lock.json for use of handlebars@^4.3.1 ([f464ceb](https://github.com/about-code/glossarify-md/commit/f464ceb))
* Terms with leading or trailing Umlauts/Non-ASCII chars not linked ([#28](https://github.com/about-code/glossarify-md/issues/28)). ([0c7f1da](https://github.com/about-code/glossarify-md/commit/0c7f1da))


### Documentation Updates

* **vuepress:** Add more info on implications of changing vuepress slugifier ([065914b](https://github.com/about-code/glossarify-md/commit/065914b))
* **vuepress:** npm start should serve from src for live-reloading ([8930098](https://github.com/about-code/glossarify-md/commit/8930098))
* **vuepress:** Use glossarify-md slugger with vuepress ([c707566](https://github.com/about-code/glossarify-md/commit/c707566))

### [1.1.1](https://github.com/about-code/glossarify-md/compare/v1.1.0...v1.1.1) (2019-09-16)

## [1.1.0](https://github.com/about-code/glossarify-md/compare/v1.0.0...v1.1.0) (2019-09-15)


### Features

* glossarify-md --help ([0084878](https://github.com/about-code/glossarify-md/commit/0084878))

## 1.0.0

### Features:

- Glossary Linking
- Multiple Glossaries
- Aliases
- Case-insensitive linking (via option)
- Term Hints
- Ignored Files
- Excluded Files
- Supported Platforms: *Linux, Windows, macOS*
