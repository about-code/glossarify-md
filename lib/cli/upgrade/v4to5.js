import { liftConfigFormatVersion } from "./version.js";

export function v4To5(confData, confVersion) {
    if (confVersion >= 5) {
        return;
    }
    if (typeof confData.linking === "string") {
        confData.linking = { paths: confData.linking, mentions: "all" };
    }
    if (typeof confData.paths === "string") {
        confData.linking = Object.assign({}, confData.linking, { paths: confData.paths });
        delete confData.paths;
    }
    if (typeof confData.baseUrl === "string") {
        confData.linking = Object.assign({}, confData.linking, { baseUrl: confData.baseUrl });
        delete confData.baseUrl;
    }
    if (confData.generateFiles) {
        const {indexFile} = confData.generateFiles;
        if (typeof indexFile === "string") {
            confData.generateFiles.indexFile = { file: indexFile };
        }
    }
    if (! confData.$schema) {
        confData.$schema = "https://raw.githubusercontent.com/about-code/glossarify-md/v4.0.0/conf.schema.json";
    }
    confData = liftConfigFormatVersion("5.1.0", confData);
    return confData;
}
