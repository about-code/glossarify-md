const searchPathVersion = /\/conf(\/v\d\/|.)schema\.json/;
const searchTagVersion  = /\/glossarify-md\/v([\d.]+){1,}\//;

export function needsUpgrade(givenUserConf, systemDefaultConf) {
    const defaultConfFormatVersion = getConfigFormatVersion(systemDefaultConf);
    const userConfFormatVersion    = getConfigFormatVersion(givenUserConf);
    return userConfFormatVersion !== defaultConfFormatVersion;
}

export function hasUpdate(givenUserConf, systemDefaultConf) {
    const defaultConfReleaseVersion = getConfigReleaseVersion(systemDefaultConf);
    const userConfReleaseVersion    = getConfigReleaseVersion(givenUserConf);
    if (userConfReleaseVersion !== 0) {
        return userConfReleaseVersion !== defaultConfReleaseVersion;
    } else {
        return false;
    }
}

/**
 * Lift the configuration *release* version to make a config use newer options.
 * Does not lift the config *format* version and would not lift the given
 * config if it already uses the `latest` release version.
 *
 * @param {string} targetVersion A semver string "x.y.z" or "latest"
 * @param {*} confData
 * @returns
 */
export function liftConfigReleaseVersion(targetVersion, confData) {
    if (confData.$schema) {
        if (targetVersion === "latest") {
            confData.$schema = confData.$schema.replace(searchTagVersion,  `/glossarify-md/${targetVersion}/`);
        } else {
            confData.$schema = confData.$schema.replace(searchTagVersion,  `/glossarify-md/v${targetVersion}/`);
        }
    }
    return confData;
}

/**
 * Call this to lift the config format version after a breaking change to the
 * configuration format.
 *
 * This will also lift the config release version to the given version to
 * prevent incompatible paths like `/glossarify-md/3.1.0/conf/v5/schema.json`.
 * Such a path would indicate a release v3 using a config format v5. This were
 * guaranteed to break and doesn't exist, either.
 *
 * @param {string} targetVersion A semver string "x.y.z" where x will be used as the new config format version.
 * @param {*} confData
 * @returns
 */
export function liftConfigFormatVersion(targetVersion, confData) {
    const majorVersion = targetVersion[0];
    if (confData.$schema) {
        confData.$schema = confData.$schema.replace(searchPathVersion, `/conf/v${majorVersion}/schema.json`);
        liftConfigReleaseVersion(targetVersion, confData);
    }
    return confData;
}

/**
 * Returns the configuration _format_ version referred to in the given object.
 * This one is critical to determine compatibility and whether a configuration
 * upgrade is needed. It is a version `vM` (e.g. `v1`, `v2`, ...) where M
 * indicates the last glossarify-md major version which introduced breaking
 * changes to the config format.
 *
 * A configuration format version does not have to be identical with the latest
 * glossarify major release version. E.g. a `glossarify-md@^7.0.0` package may
 * still work with configurations in a v5 format if there have been no breaking
 * changes to the configuration format since `glossarify-md@5.0.0`.
 *
 * @param {*} confData
 */
export function getConfigFormatVersion(confData) {
    const schemaPath = confData.$schema;
    if (schemaPath) {
        const match = /^.*\/conf\/v(\d)\/schema\.json/.exec(schemaPath);
        if (match) {
            return parseInt(match[1]);
        }
    }
    return 0;
}

export function getConfigReleaseVersion(confData) {
    const schemaUri = confData.$schema;
    if (schemaUri) {
        const match = /^https:\/\/raw\.githubusercontent\.com\/about-code\/glossarify-md\/(latest|v([0-9.]+))\/conf\/v\d\/schema\.json$/.exec(schemaUri);
        if (match) {
            if (match[2]) {
                // e.g. "5.1.0"
                return match[2];
            } else if (match[1]) {
                // "latest"
                return match[1];
            }
        }
    }
    return 0;
}
