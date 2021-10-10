import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import { TermDefinitionNode } from "./ast/with/term-definition.js";

const LD_CONTEXT = {
    "@context": {
        "@vocab": "https://about-code.github.io/vocab/glossarify-md/2021/10/#"
        ,"skos": "http://www.w3.org/2004/02/skos/core#"
        ,"dc": "http://purl.org/dc/terms/"
        ,"uri": "@id"
        ,"type": "@type"
        ,"title": "dc:title"
        ,"terms": {
            "@container": "@index"
            ,"@reverse": "skos:inScheme"
        }
        ,"Glossary": "skos:ConceptScheme"
        ,"Term": {
            "@id": "skos:Concept"
            ,"@context": {
                "label": "skos:prefLabel"
                ,"definition": "skos:definition"
                ,"aliases": {
                    "@id": "skos:altLabel"
                    ,"@container": "@set"
                }
                ,"abstract": "dc:abstract"
            }
        }
    }
};

export function exporter(context) {
    const { i18n } = context.conf;
    return (tree, vFile) => {
        if (vFile.isGlossary !== true) {
            return;
        }
        if (! vFile.export) {
            return;
        }
        const output = {
            ...LD_CONTEXT
            ,type: "Glossary"
            ,uri: vFile.uri
            ,title: vFile.title
            ,language: i18n.locale
            ,terms: {}
        };
        output["@context"]["@language"] = i18n.locale;
        visit(tree, TermDefinitionNode.type, (node) => {
            const termUri = node.uri;
            output.terms[termUri] = {
                type: "Term"
                ,uri: termUri
                ,label: node.value
                ,definition: node.longDesc
                ,abstract: node.shortDesc
                ,aliases: [... node.aliases ]
            };
        });
        context.writeFiles.push(new VFile({
            path: vFile.export
            ,value: JSON.stringify(output, null, 2)
        }));
    };
}
