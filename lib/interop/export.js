import { DcTermsUri, GlossarifyMdUri, JsonLd, SkosUri } from "./vocab.js";

/**
 * JSON-LD context for mapping glossarify-md's export model terminology onto
 * SKOS and Dublin Core terminology.
 */
export const GlossarifyExportSkos = {
    "@vocab": GlossarifyMdUri
    ,"skos": SkosUri
    ,"dc": DcTermsUri
    ,"uri": JsonLd["@id"]
    ,"type": JsonLd["@type"]
    ,"Glossary": "skos:ConceptScheme"
    ,"Term": "skos:Concept"
    ,"label": "skos:prefLabel"
    ,"definition": "skos:definition"
    ,"aliases": "skos:altLabel"
    ,"abstract": "dc:abstract"
    ,"title": "dc:title"
    ,"terms": { "@container": "@index" }
};
