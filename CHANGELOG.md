# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.0.0](https://github.com/about-code/glossarify-md/compare/v6.0.0-rc.0...v6.0.0) (2021-11-20)

This is a summary of notable changes between v5.2.0 and v6.0.0. As a user of prerelease versions (`alpha, beta, rc`) or `glossarify-md@next` have a look at [changes between pre-releases](https://github.com/about-code/glossarify-md/blob/v6.0.0-rc.1/CHANGELOG.md).

### ⚠ BREAKING CHANGES

* Option `linking.baseUrl` now requires values to have a trailing slash.
* glossarify-md@6.0.0 ends support for Node 12.x.
* Dropping use of deprecated `url.parse()` NodeJS-API.

  Unfortunately, there is no replacement for the old API that is fully compatible.
As a consequence you *may* observe that path encoding has changed. Previously
all paths (relative or absolute) have been passed through
`url.parse(path).format()` and thereby got URL-encoded. With this change
(differently) encoded URLs are only created for option `paths: "absolute"` in
combination with a `baseUrl` other than `"/"`. Values for `baseUrl` (if present)
now must be `"/"` *or* must be a URL which conforms to WHATWG URL specification
and which can be passed as a *base* parameter to Node's URL implementation (see
also https://docs.nodejs.org/api/url.html).

* Making `outDir` current working directory (CWD):

  This might only affect you if you have used glossarify-md
with third-party remark plug-ins which require file path configurations
and assume paths relative to `process.cwd()`.

* chore(deps): Migrating to remark v14 and unified v10.

### Features

* Apply options like `termHint` and `sort` on glossaries selected with `glob` pattern. ([1030b78](https://github.com/about-code/glossarify-md/commit/1030b7821db989fecc9eb60f79378436f276c60e))

**Exporting & Importing**

* New config option `glossaries[].export` and `glossaries[].exports`: Structured interoperable export. ([6d68976](https://github.com/about-code/glossarify-md/commit/6d689762b1b5882f6f94efa8884efc368b8b5363))
* Export and import RDF N-Quads ([#209](https://github.com/about-code/glossarify-md/issues/209)) ([d5057c4](https://github.com/about-code/glossarify-md/commit/d5057c4ec41d816927f80a2d9d26328da8dada9c))
* Support multiple exports with different JSON-LD context mappings. ([4cfcdc3](https://github.com/about-code/glossarify-md/commit/4cfcdc3396b46b4a8af1e549c79af20f7881ca99))
* Structured imports. ([4447f72](https://github.com/about-code/glossarify-md/commit/4447f727732ce7d04d1a48dd570fa8bfe30dd1c3))
* Import from remote ([#205](https://github.com/about-code/glossarify-md/issues/205)) ([ebadc59](https://github.com/about-code/glossarify-md/commit/ebadc591983d57a8b23008b4b92a033203f6f1ef))

**Linking**

* New option `linking.pathComponents` ([#173](https://github.com/about-code/glossarify-md/issues/173)) ([1a2fdd6](https://github.com/about-code/glossarify-md/commit/1a2fdd6af4bcc37f12d2c2e5c535e593c0458b45))
* New option value `"none"` for option `linking.paths`. ([a0fc951](https://github.com/about-code/glossarify-md/commit/a0fc951b80065ca609eb035d3ea8adbb5be8c1b0))
* New options `linking.headingIdPandoc`, <del>`linking.byReference`</del>, `linking.headingAsLink`. ([447fc17](https://github.com/about-code/glossarify-md/commit/447fc1700538eddaa38286dc98011a029a1a061c))
  * Rename option `linking.byReference` to `linking.byReferenceDefinition`. ([#174](https://github.com/about-code/glossarify-md/issues/174)) ([7950a17](https://github.com/about-code/glossarify-md/commit/7950a17a73f1b7a65797271a22c37fc8b049cf12))
* New option `linking.headingIdAlgorithm` for unique heading identifiers based on MD5 or SHA256. ([ab61b6c](https://github.com/about-code/glossarify-md/commit/ab61b6cbfa5400c809e9755338dee27ecb56173a))
* New config option `glossaries[].uri` ([699f01e](https://github.com/about-code/glossarify-md/commit/699f01eaabca75336e71260093dab90fbd713bee))
* New option `glossaries[].showUris` ([48b5585](https://github.com/about-code/glossarify-md/commit/48b5585784ecc599670998427f4902bcf6c943be))
* New option `glossaries.linkUris`. ([8d8f78b](https://github.com/about-code/glossarify-md/commit/8d8f78b9e145c1af0364657ec410a46ef6d15b46))


**Others**

* New JSONish term attributes syntax (Aliases, etc.) ([e6e9f45](https://github.com/about-code/glossarify-md/commit/e6e9f453b8300ebaa236175ddb55707f198ecb3e))
* Install less dependencies by default ([inquirer](https://npmjs.com/package/inquirer) as a peer-dependency). ([986bdec](https://github.com/about-code/glossarify-md/commit/986bdec7a30e92d162d7bcd8d7318fc64023ebfb))
* Make outdir current working dir ([#196](https://github.com/about-code/glossarify-md/issues/196)) ([241d59d](https://github.com/about-code/glossarify-md/commit/241d59d2271f4a7527b6cb7f4d9b6e76f4a26a1a))
* Migrate to ECMAScript Modules (ESM) ([#164](https://github.com/about-code/glossarify-md/issues/164)) ([36e6289](https://github.com/about-code/glossarify-md/commit/36e62891d80fb828aaaf3ca4c9cb1135c9314359))
* CommonJS interop. Package entry module with npm package archives for vuepress v1.x compatibility. ([5898b5c](https://github.com/about-code/glossarify-md/commit/5898b5c16bf423edfd402b41181a579f8ac63bca))
* Provide CommonJS export of getSlugger() for vuepress v1 compatibility ([#189](https://github.com/about-code/glossarify-md/issues/189)) ([101b768](https://github.com/about-code/glossarify-md/commit/101b768b3ca3f1cd3d824cdfc9fa85cfdab00313))
* Drop use of deprecated `url.parse()` NodeJS-API. ([#178](https://github.com/about-code/glossarify-md/issues/178)) ([ed8ffc8](https://github.com/about-code/glossarify-md/commit/ed8ffc8b6ffdd25cad13153b5133d3a37a1ce54f))
* New node support matrix ([#210](https://github.com/about-code/glossarify-md/issues/210)) ([b83f73f](https://github.com/about-code/glossarify-md/commit/b83f73fe395cf5dfffb0b232bae101b2ac932dc0))

### Bug Fixes

* --init --new wrongly assumes ./docs/glossary.md exists ([#224](https://github.com/about-code/glossarify-md/issues/224)) ([d6bc34d](https://github.com/about-code/glossarify-md/commit/d6bc34d5f3cabaa85a0252ef51daaa5ccc0b3660))
* Wrong linking of heading depths when term exists twice at different depths ([#217](https://github.com/about-code/glossarify-md/issues/217)) ([3df4fe5](https://github.com/about-code/glossarify-md/commit/3df4fe56e5b14d024cf9e04095d3f468e7fd5b22))
* **perf:** Unnecessary "unwrap" iterations. ([2b0aa2f](https://github.com/about-code/glossarify-md/commit/2b0aa2f3f8b417cd7304bb0f8d6629ede2615095))
* **perf:** Unnecessary duplicate writes. ([f92db19](https://github.com/about-code/glossarify-md/commit/f92db19281194d096b6f137df327a5eaf5fabb5a))
* Access error when processing all-empty files ([aeaaf1d](https://github.com/about-code/glossarify-md/commit/aeaaf1d9ccd70190f3e58bbf39313f7fd784cbe2))
* Not importing localized data correctly. ([#220](https://github.com/about-code/glossarify-md/issues/220)) ([0327d87](https://github.com/about-code/glossarify-md/commit/0327d879d987ab52b430469db3abe483cf565f60))
* Add missing dependency vfile. ([df8afc2](https://github.com/about-code/glossarify-md/commit/df8afc204b0e25239585d7450fcc9bd508348f35))
* Spaces causing many `&#x20;` being rendered in index files and lists ([#195](https://github.com/about-code/glossarify-md/issues/195)) ([65d5290](https://github.com/about-code/glossarify-md/commit/65d529077484dbf57167751adfc9d6a65a54a926)), closes [#x20](https://github.com/about-code/glossarify-md/issues/x20)

### Documentation Updates

* Added [Using with pandoc](./doc/pandoc.md) ([#221](https://github.com/about-code/glossarify-md/issues/221)) ([f24eff5](https://github.com/about-code/glossarify-md/commit/f24eff5007dce1b407508b8bc9c4f39b33a0a18d))
* Clarify pattern anchorization ([bf7f98f](https://github.com/about-code/glossarify-md/commit/bf7f98f02aa72e48efd529e8b0f4cfa4b87bddd1))


## [5.2.0](https://github.com/about-code/glossarify-md/compare/v5.1.3...v5.2.0) (2021-06-04)


### Features

* Generate lists from RegExp patterns ([#161](https://github.com/about-code/glossarify-md/issues/161)) ([c99d5c6](https://github.com/about-code/glossarify-md/commit/c99d5c67fc022311109d84b6857f498d30982cd6))


### Documentation Updates

* Fix vuepress plugin requirements. ([4cfef24](https://github.com/about-code/glossarify-md/commit/4cfef24630b57de89523ee5471d457d428b7ebfa))

### [5.1.3](https://github.com/about-code/glossarify-md/compare/v5.1.2...v5.1.3) (2021-05-27)

* This is minor release which updates the list of dependencies to include new minor versions with security fixes. If you've installed glossarify-md for the first time, then you should already have got newer versions of dependencies due to version range specifiers used within glossarify's `package.json`. Otherwise you should have been able to install fixed dependencies yourself using `npm audit fix`.

### [5.1.2](https://github.com/about-code/glossarify-md/compare/v5.1.1...v5.1.2) (2021-04-17)


### Bug Fixes

* Option `indexFiles`: Incorrect path from index to section of occurrence. ([#156](https://github.com/about-code/glossarify-md/issues/156)) ([41e59ad](https://github.com/about-code/glossarify-md/commit/41e59ad449e29fa53b5d483d86ccbbf0e98a2027))


### [5.1.1](https://github.com/about-code/glossarify-md/compare/v5.1.0...v5.1.1) (2021-04-17)

### Bug Fixes

* Option `indexFiles`: Empty files generated on windows (#154) ([0353f0e](https://github.com/about-code/glossarify-md/commit/0353f0e19c3ef347f62637f4ff804614a042c4b6))

## [5.1.0](https://github.com/about-code/glossarify-md/compare/v5.0.1...v5.1.0) (2021-04-11)


### Features

* New option `indexFiles`. Generate an index document for terms of a particular glossary ([#152](https://github.com/about-code/glossarify-md/issues/152)) ([62448e8](https://github.com/about-code/glossarify-md/commit/62448e8ad83963a188dcf79bc85c5d7f67147752))

### [5.0.1](https://github.com/about-code/glossarify-md/compare/v5.0.0...v5.0.1) (2021-02-20)


### Bug Fixes

* Clarify semantics of option 'linking.limitByAlternatives'. ([6a1842e](https://github.com/about-code/glossarify-md/commit/6a1842ec56e73f347bbfca2d07dd43f307fb3c0f))
* Escaping of link labels (particularly if link label is an URL). ([e5074a8](https://github.com/about-code/glossarify-md/commit/e5074a8cb3f9f7d6b8a30c31a3e6b0a848ffb590))
* Linker sometimes adds '...' when there are no alternative definitions (Closes [#148](https://github.com/about-code/glossarify-md/issues/148)) ([24f26c0](https://github.com/about-code/glossarify-md/commit/24f26c031ed6d7feaf563388bdcc66ded2faeecb))


### Documentation Updates

* New config docs in conf/v5/doc directly generated from JSON Schema. ([06a629b](https://github.com/about-code/glossarify-md/commit/06a629bc5f9b6db349622b9df5720e86645ebc99))
* fix schema opts ([3d1d6fd](https://github.com/about-code/glossarify-md/commit/3d1d6fda0146e2ebf8e0ef4eff41b0bfc59af0e9))
* Rename unified addendum into Conceptual Layers ([444af60](https://github.com/about-code/glossarify-md/commit/444af60f1ed5177f49c541c1af9cab86f0dce325))

## [5.0.0](https://github.com/about-code/glossarify-md/compare/v5.0.0-beta.0...v5.0.0) (2020-12-31)


### ⚠ BREAKING CHANGES

* **NodeJS 10.x will no longer be supported** for glossarify-md versions `>= 5.0.0`. While `v5.0.0-alpha.*` and `v5.0.0-beta.0` have been continuously tested on NodeJS 10.x beginning with the release of gossarify-md v5 tests will target NodeJS 12.x (LTS), 14.x (LTS) and 15.x (Current), only. Updates to `glossarify-md >= 5.0.0` may break on NodeJS 10 without explictly notifying about a breaking change.
* File extension "mkdown" no longer supported. Aligning with GitHub-supported file extensions.

### Features

* New node support matrix ([#145](https://github.com/about-code/glossarify-md/issues/145)) ([07b95b0](https://github.com/about-code/glossarify-md/commit/07b95b05ab50bface1dc03855e6ec330f8945c54))
* **cli:** New options `--new` and `--more` usable with `--init`. See [README.md](./README.md#Install) for details. ([02240d3](https://github.com/about-code/glossarify-md/commit/02240d34ae9a6da00cdb8c4bb30551440191d5fe))
* **docs:** Demonstrate glossarify-md in the docs by generating ./doc/ from ./demo ([#143](https://github.com/about-code/glossarify-md/issues/143)) ([88a8b96](https://github.com/about-code/glossarify-md/commit/88a8b967f337224d31e3bfad44753a447fc633e7))


### Bug Fixes

* Default Config Values: 'outDir' being in default 'baseDir' ([ea0a144](https://github.com/about-code/glossarify-md/commit/ea0a1447bb9f9728e986a3a5ffc30111ac037dcb))
* Wrong link to glossary definition in generated index file when `glossaries[i].file` config is a glob. ([4ada56f](https://github.com/about-code/glossarify-md/commit/4ada56ff5dbb9b1484af897e6d34ca3ecd25f549)), closes [#133](https://github.com/about-code/glossarify-md/issues/133)
* Use GitHub set of supported Markdown file extensions. ([745fd82](https://github.com/about-code/glossarify-md/commit/745fd82ae700ebaeae24fec2cd6c514f4ab59ab5))

## [5.0.0-beta.0](https://github.com/about-code/glossarify-md/compare/v5.0.0-alpha.2...v5.0.0-beta.0) (2020-12-26)


### ⚠ BREAKING CHANGES

* For unordered lists glossarify-md now writes the star marker "*". Previously it wrote dashes "-". For emphasis it now uses the star marker as well. Previously it used underscores.
  > Since both is equally Markdown this is **only a breaking change in terms of output similarity not in terms of Markdown rendering**. We therefore do not provide any upgrade assistance to keep results the same. If you still care you can restore previous results by adding below snippet to your glossary-md.conf.json. However, we do not give any guarantees about *identical* outputs in the next major release, anyway.

    ~~~json
    "unified": {
      "settings": {
        "bullet": "-",
        "emphasis": "_"
      }
    }
    ~~~

* Renamed option `linking.terms` into `linking.mentions`. Affects users of `v5.0.0-alpha.1` and `v5.0.0-alpha.2`. Please rename the option in your config file.
   * Due to a mistake we published `v5.0.0-alpha-*` releases too soon with the npm dist tag `latest` when we actually wanted to keep v4.0.1 tagged `latest` until 5.0 release. This should mostly have affected users who installed glossarify-md for the first time and got an alpha release. If you are affected by this breaking change we like to apologize. In case you are still on v4.0.1 we recommend to stay there and use the upgrade assistant once v5.0 is out. Beginning with this `v5.0.0-beta.0` we do not have plans to add more breaking changes anymore.

### Features

* Markdown syntax extensions via plug-ins.
  * New option `unified` for extended markdown processing configuration ([#140](https://github.com/about-code/glossarify-md/issues/140)) ([49a2dce](https://github.com/about-code/glossarify-md/commit/49a2dce82eb844eaa222127fc338b248563e2054)).
  This opens up a whole lot of new possibilities and enables using glossarify-md on Markdown inputs not strictly adhering to [CommonMark]. Make sure to read the [README.md](./README.md#markdown-syntax-extensions).
* Cross linking
  * glossary file globs ([#133](https://github.com/about-code/glossarify-md/issues/133)) ([705f9a0](https://github.com/about-code/glossarify-md/commit/705f9a067f3555bec3e23d0243e7acfc6b8cb6ac))
  * identifier-based cross-linking with pandoc-style custom-heading-ids ([#122](https://github.com/about-code/glossarify-md/issues/122)) ([949c815](https://github.com/about-code/glossarify-md/commit/949c815d1f5f93192aa3611d7a8ad9c664f5e5a0))
  * New option `linking.headingDepths`. Select heading depths to generate term-based links for. ([#136](https://github.com/about-code/glossarify-md/issues/136)) ([d4c8646](https://github.com/about-code/glossarify-md/commit/d4c86462c4d2b7db8c455c3b7ed82a65e40b67ca))
  * New option `linking.limitByAlternatives` ([#137](https://github.com/about-code/glossarify-md/issues/137)) ([98cb9d0](https://github.com/about-code/glossarify-md/commit/98cb9d08cb96a92dffa149881015c6f67e8bfb82))
  * New option `indexing.headingDepths` ([#139](https://github.com/about-code/glossarify-md/issues/139)) ([37c7b1e](https://github.com/about-code/glossarify-md/commit/37c7b1edeb7344de06e15dd9352cea71cec90287)), closes [#136](https://github.com/about-code/glossarify-md/issues/136)
  * New [README.md section on Cross Linking](./README.md#cross-linking)

### Bug Fixes

* fix(upgrade): Fix race condition which causes upgrade assistant to write new config to backup file. ([f419aa7](https://github.com/about-code/glossarify-md/commit/f419aa7a4627b9f8eacaa8ae60b2596dd7453386))
* fix(upgrade): Make sure to only upgrade to versions compatible with default schema
* Being more robust if no glossary file is available.

## [5.0.0-alpha.2](https://github.com/about-code/glossarify-md/compare/v5.0.0-alpha.1...v5.0.0-alpha.2) (2020-12-19)


### Bug Fixes

* Include 'conf' directory in npm package ([280efef](https://github.com/about-code/glossarify-md/commit/280efefc0bf4a1ada9a42ff840ecc6e05f2af14f))

## [5.0.0-alpha.1](https://github.com/about-code/glossarify-md/compare/v4.0.1...v5.0.0-alpha.1) (2020-12-19)


### ⚠ BREAKING CHANGES

* Option `linking` has become `linking.paths`.
Option `baseUrl` has become `linking.baseUrl`.

  **An upgrade assistant will help with the migration.** From this version on configuration files must
refer to a schema by means of a versioned path. This helps the upgrade assistant in future releases to find out what changes need to be applied
to upgrade from an old schema.

* Migrating to remark@13.0.0 with remark-parse@9.0.0 and new micromark parser (#132)

  With remark-parse having switched to a
  completely new yet CommonMark compatible markdown parser
  there's a (minor) risk that output produced by glossarify-md
  changed. Based on what we observed by comparing outputs with our previous baseline there were only marginal changes which make output even more compliant with CommonMark. These are the changes we accepted as part of our new test baseline:

  **Indentation**: Remark strips leading spaces on new lines
  either because there is no syntax construct which requires
  them or to correct indentation, e.g. of list items.

  **Headings**: Remark lifts headings at a depth > 6 into
  the valid range of 1-6 according to CommonMark Spec v0.29.

  **Escapes**: There may be a few changes to what is being
  escaped by a leading backslash. See remark for details.

  The remark changelog can be found here:
  https://github.com/remarkjs/remark/releases/tag/13.0.0

* test: Upgrade test configurations to v5 schema.
* test: New baseline.
* Terms found in HTML markup won't be linkified any longer.

### Features

* New option `linking.terms`. Limiting the number of glossary links to once per paragraph ([#118](https://github.com/about-code/glossarify-md/issues/118)) ([0310e93](https://github.com/about-code/glossarify-md/commit/0310e9309b56276c8f659ace0fdf86d93eaf0c83)), closes [#117](https://github.com/about-code/glossarify-md/issues/117) [#127](https://github.com/about-code/glossarify-md/issues/127)
* **cli:** New parameter --init to generate a config file with all options and defaults ([#126](https://github.com/about-code/glossarify-md/issues/126)) ([04894ce](https://github.com/about-code/glossarify-md/commit/04894ceeaaaf20e0c49bdb8b364ddaa3eb2c7c53))
* Allow lists from arbitrary identifiable HTML nodes ([1342a69](https://github.com/about-code/glossarify-md/commit/1342a69da3e98c21717801f128d4e52369b0c7aa))
* Anchors for direct navigation to images and tables and unified lists ([2175d8b](https://github.com/about-code/glossarify-md/commit/2175d8b01557df3b55b08b8b3cf4977d492c5eb7))
* Improved performance ([2e9f9dc](https://github.com/about-code/glossarify-md/commit/2e9f9dc186bfba9d542f0944d2124049a5cae98c))
* Support pandoc-style custom heading ids ([#112](https://github.com/about-code/glossarify-md/issues/112)) ([4ef0fe7](https://github.com/about-code/glossarify-md/commit/4ef0fe7d2e94eb80ad114f94570f1bc353489b9e))


### Bug Fixes

* Deeply merge configuration schema defaults ([#124](https://github.com/about-code/glossarify-md/issues/124)) ([1583ff0](https://github.com/about-code/glossarify-md/commit/1583ff087f3d696347dd2cb79b15e1a0f84264bc))
* Linkification in embedded HTML markup ([#110](https://github.com/about-code/glossarify-md/issues/110)) ([5da4415](https://github.com/about-code/glossarify-md/commit/5da441505b5019a6612aaa2f8d64dc97956e29ac))


* Conf schema upgrade and upgrade assistant (#128) ([1eb152f](https://github.com/about-code/glossarify-md/commit/1eb152f2871ead25800d265a6aed05fbfc97ca75)), closes [#128](https://github.com/about-code/glossarify-md/issues/128)

## [5.0.0-alpha.0](https://github.com/about-code/glossarify-md/compare/v4.0.1...v5.0.0-alpha.0) (2020-11-11)


### ⚠ BREAKING CHANGES

* Terms found in HTML markup won't be linkified any longer.

### Features

* Allow lists from arbitrary identifiable HTML nodes ([1342a69](https://github.com/about-code/glossarify-md/commit/1342a69da3e98c21717801f128d4e52369b0c7aa))
* Anchors for direct navigation to images and tables and unified lists.. See also [README Section *Lists*](./README.md#lists) ([2175d8b](https://github.com/about-code/glossarify-md/commit/2175d8b01557df3b55b08b8b3cf4977d492c5eb7))
* Improved performance ([2e9f9dc](https://github.com/about-code/glossarify-md/commit/2e9f9dc186bfba9d542f0944d2124049a5cae98c))


### Bug Fixes

* Linkification in embedded HTML markup ([#110](https://github.com/about-code/glossarify-md/issues/110)) ([5da4415](https://github.com/about-code/glossarify-md/commit/5da441505b5019a6612aaa2f8d64dc97956e29ac))

### [4.0.1](https://github.com/about-code/glossarify-md/compare/v4.0.0...v4.0.1) (2020-10-18)


### Bug Fixes

* --force-Flag not working ([#103](https://github.com/about-code/glossarify-md/issues/103)) ([5084d36](https://github.com/about-code/glossarify-md/commit/5084d36b263b0a8f168aaf35be357bc2d05af79a))

## [4.0.0](https://github.com/about-code/glossarify-md/compare/v3.6.5...v4.0.0) (2020-09-26)


### ⚠ BREAKING CHANGES

* `outDirDropOld` is now `true` by default. Previously `false`.
* `experimentalFootnotes` is no longer required and no longer
a valid configuration option. Please remove it.

> Footnotes are still not official CommonMark. However they are also not really
a feature of *glossarify-md*, thus the option doesn't provide any value and
was removed.


* `indexFile` option no longer supports a string value. Instead of

  ~~~json
  "generateFiles": {
    "indexFile": "./book-index.md"
  }
  ~~~

  write:

  ~~~json
  "generateFiles": {
    "indexFile": {
      "file": "./book-index.md",
      "title": "Book Index"
    }
  }
  ~~~


* Command Line Interface (CLI) changed (#94).

From the old set of arguments only `--config` and `--help` remain supported.
Any other configuration options are being replaced by two new options
`--shallow` and `--deep` which take a JSON string that is expected to match
the configuration schema. As you may recognise from their names you can use
them to merge a command-line provided configuration with the configuration
provided in the configuration file.

Use those two options if you need to override particular configuration
keys in a configuration file on a particular program execution.

For example if you previously wrote

~~~
glossarify-md --config ./glossarify-md.conf.json --baseUrl "http://example.org"
~~~

you now write

~~~
glossarify-md --config ./glossarify-md.conf.json --shallow '{ "baseUrl": "http://example.org" }'
~~~

If you need to add another glossarify file write

~~~
glossarify-md --config ./glossarify-md.conf.json --deep '{ "glossaries": [{ "file": "./glossary2.md" }] }'
~~~

### Bug Fixes

* bump lodash from 4.17.15 to 4.17.19 ([#102](https://github.com/about-code/glossarify-md/issues/102)) ([788379d](https://github.com/about-code/glossarify-md/commit/788379db20509b05b8a12a5d3e83cf9d8fb0eeb5))
* Drop option 'experimentalFootnotes' ([5785aba](https://github.com/about-code/glossarify-md/commit/5785abae0b2c032d26472c211fc6361dfe99db6d)), closes [#x3](https://github.com/about-code/glossarify-md/issues/x3) [#90](https://github.com/about-code/glossarify-md/issues/90)
* minimist-options 4.1.0 breaks glossarify-md ([#93](https://github.com/about-code/glossarify-md/issues/93)). ([0c1d2dd](https://github.com/about-code/glossarify-md/commit/0c1d2ddf7ad6dc7ab81c4639608ba9015e3221cb)), closes [#94](https://github.com/about-code/glossarify-md/issues/94)
* Drop output directory by default. ([0b9c2dc](https://github.com/about-code/glossarify-md/commit/0b9c2dc6453c4af60535e0288f07186d93b42227))
* 59 config option generate files indexfile drop support for value range string (#95) ([8449eda](https://github.com/about-code/glossarify-md/commit/8449edaa582c11f322d1aae399272849801a5eb5)), closes [#95](https://github.com/about-code/glossarify-md/issues/95) [#59](https://github.com/about-code/glossarify-md/issues/59)

### [3.6.5](https://github.com/about-code/glossarify-md/compare/v3.6.4...v3.6.5) (2020-05-23)

*Same as 3.6.4 but replaces 2.1.2 hotfix release for v2 release branch on npm with another v3 release.*

### [3.6.4](https://github.com/about-code/glossarify-md/compare/v3.6.3...v3.6.4) (2020-05-23)


### Bug Fixes

* **Hotfix:** Nail 'minimist-options' at v4.0.1 to mitigate breaking change in v4.1.0 ([#93](https://github.com/about-code/glossarify-md/issues/93)). ([06db3cb](https://github.com/about-code/glossarify-md/commit/06db3cb))

### [3.6.3](https://github.com/about-code/glossarify-md/compare/v3.6.2...v3.6.3) (2020-05-01)


### Bug Fixes

* glossarify-md breaks VuePress `[[toc]]` markdown extension ([#88](https://github.com/about-code/glossarify-md/issues/88)) ([539b685](https://github.com/about-code/glossarify-md/commit/539b685))

### [3.6.2](https://github.com/about-code/glossarify-md/compare/v3.6.1...v3.6.2) (2020-04-29)


### Bug Fixes

* 'Cannot find module remark-stringify' ([#87](https://github.com/about-code/glossarify-md/issues/87)). ([de16967](https://github.com/about-code/glossarify-md/commit/de16967))

### [3.6.1](https://github.com/about-code/glossarify-md/compare/v3.6.0...v3.6.1) (2020-04-29)


### Bug Fixes

* Don't cut a term's short description on markdown formatting ([#81](https://github.com/about-code/glossarify-md/issues/81)) and Correctly link to formatted term headings ([#82](https://github.com/about-code/glossarify-md/issues/82)) ([c0066f2](https://github.com/about-code/glossarify-md/commit/c0066f2))
* Extract anchor labels with markdown formatting ([#84](https://github.com/about-code/glossarify-md/issues/84)) ([3c85a96](https://github.com/about-code/glossarify-md/commit/3c85a96))
* Headings with codespans cause error output ([#75](https://github.com/about-code/glossarify-md/issues/75)) ([dfa42d4](https://github.com/about-code/glossarify-md/commit/dfa42d4))

## [3.6.0](https://github.com/about-code/glossarify-md/compare/v3.4.1...v3.6.0) (2020-04-10)


### Features

* Minor performance improvements. Write outputs in parallel. ([f7720e8](https://github.com/about-code/glossarify-md/commit/f7720e8))
* Sort terms in a glossary ([#66](https://github.com/about-code/glossarify-md/issues/66)) ([1846929](https://github.com/about-code/glossarify-md/commit/1846929))

## [3.5.0](https://github.com/about-code/glossarify-md/compare/v3.4.1...v3.5.0) (2020-03-01)

### Features

* Arbitrary Lists with HTML anchor tags (`<a>`), e.g. *List of Listings, List of Formulas, ...* . See also [README.md](https://github.com/about-code/glossarify-md/blob/22bcbdd0523742df4d8a3d726f89511e7d6a028e/README.md#arbitrary-lists-with-anchors).  ([#73](https://github.com/about-code/glossarify-md/issues/73)) ([4cee0ec](https://github.com/about-code/glossarify-md/commit/4cee0ec))
* New option `outDirDropOld` to remove prior outputs rather than overwrite/merge with new ones. Default: `false` ([5c518b0](https://github.com/about-code/glossarify-md/commit/5c518b0))

### [3.4.1](https://github.com/about-code/glossarify-md/compare/v3.4.0...v3.4.1) (2020-02-15)


### Documentation Updates

* Fix opts for listOfTables ([203c4f7](https://github.com/about-code/glossarify-md/commit/203c4f7))

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
