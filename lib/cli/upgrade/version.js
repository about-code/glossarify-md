const searchPathVersion = /\/conf(\/v\d\/|.)schema\.json/;
const searchTagVersion  = /\/glossarify-md\/v([\d.]+){1,}\//;

function liftSchemaVersion(targetVersion, confData) {
    const targetMajor = targetVersion[0];
    if (confData.$schema) {
        confData.$schema = confData.$schema.replace(searchPathVersion, `/conf/v${targetMajor}/schema.json`);
        confData.$schema = confData.$schema.replace(searchTagVersion,  `/glossarify-md/v${targetVersion}/`);
    } else {
        confData.$schema = `https://raw.githubusercontent.com/about-code/glossarify-md/v${targetVersion}/conf/v${targetVersion[0]}/schema.json`;
    }
    return confData;
}

/**
 * Extract version information from the given config object.
 * @param {*} confData
 */
function getMajorVersion(confData) {
    const schemaPath = confData.$schema;
    if (schemaPath) {
        const match = /^.*\/conf\/v(\d)\/schema\.json/.exec(schemaPath);
        if (match) {
            return parseInt(match[1]);
        }
    }
    return 0;
}

function getFullVersion(confData) {
    const schemaUri = confData.$schema;
    if (schemaUri) {
        const match = /^https:\/\/raw\.githubusercontent\.com\/about-code\/glossarify-md\/v([0-9.]+)\/conf\/v\d\/schema\.json$/.exec(schemaUri);
        if (match) {
            return match[1];
        }
    }
    return 0;
}

module.exports = {
    getMajorVersion
    ,getFullVersion
    ,liftSchemaVersion
};
