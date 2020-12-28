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
function getVersion(confData) {
    const schemaPath = confData.$schema;
    if (schemaPath) {
        const match = /^.*\/conf\/v(\d)\/schema.json/.exec(schemaPath);
        if (match) {
            return parseInt(match[1]);
        }
    }
    return 0;
}
function needsUpgrade(confData, effectiveVersion) {
    const userConfVersion  = getVersion(confData);
    return userConfVersion !== effectiveVersion;
}

/**
 * Use this _after_ all upgrades have been applied.
 *
 * If the currently effective version derived from the default config schema
 * does not match the user config version after all upgrades have been applied,
 * then this will make the function return 'false' since there is obviously no
 * (valid) upgrade path in this case.
 *
 * @param {*} resultConfData
 * @param {*} effectiveVersion
 */
function hasUpgradePath(resultConfData, effectiveVersion) {
    const confVersion = getVersion(resultConfData);
    if (confVersion !== effectiveVersion) {
        console.log(
            `⚠ Warning: Missing upgrade path from your config version (v${confVersion}) to effective schema version (v${effectiveVersion})!`
        );
        return false;
    } else {
        return true;
    }
}

module.exports = {
    needsUpgrade
    ,getVersion
    ,liftSchemaVersion
    ,hasUpgradePath
};
