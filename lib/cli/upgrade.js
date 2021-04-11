const inquirer = require("inquirer");
const {copySync, writeFile} = require("fs-extra");
const {getMajorVersion, getFullVersion} = require("./upgrade/version");
const {v4To5} = require("./upgrade/v4to5");

const upgrades = [v4To5];

function needsUpgrade(confData, confDataDefault) {
    const defaultConfVersion = getMajorVersion(confDataDefault);
    const userConfVersion  = getMajorVersion(confData);
    return userConfVersion !== defaultConfVersion;
}

function hasUpdate(confData, confDataDefault) {
    const defaultConfVersion = getFullVersion(confDataDefault);
    const userConfVersion = getFullVersion(confData);
    if (userConfVersion !== 0) {
        return userConfVersion !== defaultConfVersion;
    } else {
        return false;
    }
}

function applyUpgrades(userConfData, defaultConfData) {
    const targetVersion = getMajorVersion(defaultConfData);
    let currentVersion = getMajorVersion(userConfData);
    for (const upgradeFn of upgrades) {
        if (currentVersion < targetVersion) {
            userConfData = upgradeFn(userConfData, currentVersion) || userConfData;
            currentVersion = getMajorVersion(userConfData);
        }
    }
    if (currentVersion !== targetVersion) {
        throw new Error(
            `⚠ Error: No upgrade path from your config version (v${currentVersion}) to current schema version (v${targetVersion})! Your config might be too old. Please generate a current config using the --init option, then try applying your customizations to the newly generated one. Some things may have changed. Have a look at the changelog for details.
            `
        );
    }
    return userConfData;
}

/**
 *
 * @param {*} userConfData
 * @param {*} userConfFile
 * @param {*} defaultConfData
 * @param {CallableFunction} userConfModifierFn
 */
function updateConfig(userConfData, userConfFile, defaultConfData, userConfModifierFn) {
    return inquirer.prompt([{
        message: "Your configuration needs an upgrade. Keep a copy of the old version?"
        ,type: "confirm"
        ,name: "keepBackup"
        ,required: true
        ,default: "y"
    }]).then((answers) => {
        return new Promise((resolve, reject) => {
            try {
                if (answers.keepBackup) {
                    const backupFile = userConfFile + ".old";
                    copySync(userConfFile, backupFile);
                    console.info(`A backup of your previous configuration has been written to '${backupFile}'`);
                }
                const newConf = userConfModifierFn.call(undefined, userConfData, defaultConfData);
                writeFile(userConfFile, JSON.stringify(newConf, null, 2), "utf-8", (err) => {
                    if (err) { reject(err); }
                    resolve(newConf);
                });
            } catch (error) {
                reject(error);
            }
        });
    });
}

function suggestUpdate(userConfData, defaultConfData) {
    console.info(`ⓘ  Version Info:
────────────────
There's an updated config $schema available at ${defaultConfData.$schema}. We recommend updating your glossarify-md config file to get the latest options suggested (given your editor supports it). However, you can also ignore this message and things continue to work. For more details on what's new in this version see our changelog at https://github.com/about-code/glossarify-md/blob/master/CHANGELOG.md.
────────────────
`);
    return userConfData;
}

function upgrade(userConfData, userConfFile, defaultConfData) {
    if (needsUpgrade(userConfData, defaultConfData)) {
        return updateConfig(userConfData, userConfFile, defaultConfData, applyUpgrades);
    } else if (hasUpdate(userConfData, defaultConfData)) {
        suggestUpdate(userConfData, defaultConfData);
        return Promise.resolve(userConfData);
    } else {
        return Promise.resolve(userConfData);
    }
}
module.exports = upgrade;
