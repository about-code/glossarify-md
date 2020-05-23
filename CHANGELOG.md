# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.1.2](https://github.com/about-code/glossarify-md/compare/v2.1.1...v2.1.2) (2020-05-23)


### Bug Fixes

* **Hotfix:** Nail minimist-options to version 4.0.1 ([3d57136](https://github.com/about-code/glossarify-md/commit/3d571360404340f28f5cfba1907518b873335913))

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
