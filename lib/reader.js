import path from "node:path";
import remark_link_headings from "remark-autolink-headings";
import remark_footnotes from "remark-footnotes";
import remark_gfm from "remark-gfm";
import remark_parse from "remark-parse";
import remark_ref_links from "remark-reference-links";
import remark_stringify from "remark-stringify";
import { unified } from "unified";
import { engine as unifiedNgin } from "unified-engine";
import { anchorizer } from "./anchorizer.js";
import { printAst } from "./ast/tools.js";
import { withNodeType } from "./ast/with/node-type.js";
import { TermDefinitionNode } from "./ast/with/term-definition.js";
import { TermOccurrenceNode } from "./ast/with/term-occurrence.js";
import { TocInstructionNode } from "./ast/with/toc-instruction.js";
import { counter } from "./counter.js";
import { identifier } from "./identifier.js";
import { indexes as anchorIndexes } from "./index/anchors.js";
import { indexes as termsIndexes } from "./index/terms.js";
import { indexer } from "./indexer.js";
import { linker } from "./linker.js";
import { PandocHeadingIdNode } from "./pandoc/pandoc-heading-id-node.js";
import { pandoc_heading_append_id, pandoc_heading_parse_id } from "./pandoc/pandoc-heading-id-plugin.js";
import { reproducablePaths } from "./path/plugins.js";
import { toForwardSlash } from "./path/tools.js";
import { whenTrue } from "./plugin/tools.js";
import { sorter } from "./sorter.js";
import { terminator } from "./terminator.js";

/**
 * Reads glossary files to index terms defined in there.
 *
 * @param {Context} context
 * @return {Promise<Context>} context
 */
export function readGlossaries(context) {
    const {
        baseDir, outDir, glossaries, keepRawFiles, excludeFiles,
        unified: unifiedConf
    } = context.conf;
    return new Promise((resolve, reject) => {
        const unifiedNginConf = Object.assign({}, unifiedConf, {
            processor: unified()
                .use(remark_parse)
                .use(pandoc_heading_parse_id)
                .use(remark_gfm)
                .use(glossaryVFiles, { context })
                .use(identifier, { context })
                .use(terminator, { context })
                .use(indexer, { context, indexes: [...termsIndexes] })
            ,cwd: baseDir
            ,files: toForwardSlash(
                glossaries
                    .map(g => g.file)
                    .sort((f1, f2) => f1.localeCompare(f2, "en"))
            )
            ,ignoreName: ".mdignore"
            ,ignorePatterns: [
                toForwardSlash(path.relative(baseDir, outDir))
                ,...toForwardSlash(keepRawFiles)
                ,...toForwardSlash(excludeFiles)
            ]
            ,extensions: [
                // GitHub set of markdown file extensions
                // https://github.com/github/markup/blob/master/lib/github/markup/markdown.rb#L34
                "md", "mkd", "mkdn", "mdwn", "mdown", "markdown"
            ]
            ,alwaysStringify: false
            ,treeOut: false
            ,out: false
            ,output: false
            ,color: true
            ,silent: true
        });
        unifiedNgin(unifiedNginConf ,(err) => {
            err ? reject(err) : resolve(context);
        });
    });
}


/**
 * Reads the pile of markdown files and replaces plaintext term occurrences with
 * links pointing to the term definition in one or more glossaries.
 *
 * @param {Context} context
 * @return {Promise<Context>} context
 */
export function readDocumentFiles(context) {
    const {
        baseDir, outDir, includeFiles, keepRawFiles, excludeFiles, generateFiles,
        linking, reportNotMentioned, unified: unifiedConf, dev
    } = context.conf;
    return new Promise((resolve, reject) => {
        const unifiedNginConf = Object.assign({}, unifiedConf, {
            processor: unified()
                .use(withNodeType(TocInstructionNode))
                .use(withNodeType(TermDefinitionNode))
                .use(withNodeType(TermOccurrenceNode))
                .use(withNodeType(PandocHeadingIdNode))
                .use(remark_parse) // parser
                .use(remark_stringify) // compiler
                .use(whenTrue(dev.printInputAst, printAst), { match: dev.printInputAst })
                .use(whenTrue(generateFiles.listOf.length > 0, anchorizer), { context })
                .use(sorter, { context })
                .use(remark_gfm)
                .use(remark_footnotes, {inlineNotes: true})
                .use(pandoc_heading_parse_id)
                .use(identifier, { context })
                .use(linker, { context })
                .use(indexer, { context, indexes: [...termsIndexes, ...anchorIndexes ]})
                .use(whenTrue(reportNotMentioned || dev.termsFile, counter), { context })
                .use(whenTrue(linking.byReferenceDefinition, remark_ref_links))
                .use(whenTrue(linking.headingAsLink, remark_link_headings), {behavior: "wrap"})
                .use(whenTrue(linking.headingIdPandoc, pandoc_heading_append_id))
                .use(whenTrue(dev.reproducablePaths, reproducablePaths), { context })
                .use(whenTrue(dev.printOutputAst, printAst), { match: dev.printOutputAst })
            ,cwd: baseDir
            ,files: [
                ...toForwardSlash(includeFiles)
            ]
            ,ignoreName: ".mdignore"
            ,ignorePatterns: [
                toForwardSlash(path.relative(baseDir, outDir))
                ,...toForwardSlash(keepRawFiles)
                ,...toForwardSlash(excludeFiles)
            ]
            ,extensions: ["md", "mkd", "mkdn", "mdwn", "mdown", "markdown" ]
            ,alwaysStringify: true
            ,output: false
            ,out: false
            ,color: true
            ,silent: false
        });
        unifiedNgin(unifiedNginConf, (err, statusCode, uContext) => {
            if (err) {
                reject(err);
            } else {
                context.vFiles = [...uContext.files];
                resolve(context);
            }
        });
    });
}

function glossaryVFiles(args) {
    const { context } = args;
    const { glossaries } = context.conf;
    const glossariesByPath = {};
    glossaries.map(g => glossariesByPath[context.resolvePath(g.file)] = g);
    return (tree, vFile) => {
        const glossaryConf = glossariesByPath[context.resolvePath(vFile.path)] || {};

        /**
         * @type {Glossary} Glossary Mixin
         */
        const glossaryMixin = {
            isGlossary: true
            ,title: ""
            ,termHint: ""
            ,sort: ""
            ,...glossaryConf
            ,file: toForwardSlash(vFile.path)
            ,toJSON() {
                return {
                    file: this.file
                    ,termHint: this.termHint
                };
            }
        };
        Object.assign(vFile, glossaryMixin);
    };
}
