import fs from "fs-extra";
import { INQUIRER_REQUIRED, UPGRADE_REQUIRED } from "./messages.js";
import { v4To5 } from "./upgrade/v4to5.js";
import { getConfigFormatVersion, getConfigReleaseVersion } from "./upgrade/version.js";

const upgrades = [v4To5];

function needsUpgrade(confData, confDataDefault) {
    const defaultConfFormatVersion = getConfigFormatVersion(confDataDefault);
    const userConfFormatVersion    = getConfigFormatVersion(confData);
    return userConfFormatVersion !== defaultConfFormatVersion;
}

function hasUpdate(confData, confDataDefault) {
    const defaultConfReleaseVersion = getConfigReleaseVersion(confDataDefault);
    const userConfReleaseVersion    = getConfigReleaseVersion(confData);
    if (userConfReleaseVersion !== 0) {
        return userConfReleaseVersion !== defaultConfReleaseVersion;
    } else {
        return false;
    }
}

function applyUpgrades(userConfData, defaultConfData) {
    const targetVersion = getConfigFormatVersion(defaultConfData);
    let currentVersion  = getConfigFormatVersion(userConfData);
    for (const upgradeFn of upgrades) {
        if (currentVersion < targetVersion) {
            userConfData = upgradeFn(userConfData, currentVersion) || userConfData;
            currentVersion = getConfigFormatVersion(userConfData);
        }
    }
    if (currentVersion !== targetVersion) {
        throw new Error(`
────────────────────────────────
⚠ No automatic upgrade path from your config version v${currentVersion} to version v${targetVersion}. Your config might be too old. Please save a copy of your config and generate a new one by running 'npx glossarify-md --init --more' then try to apply your customizations to the new one. Some things may have changed. Have a look at the changelog for details. Omit --more to generate a minimal config.
────────────────────────────────`
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
async function updateConfig(userConfData, userConfFile, defaultConfData, userConfModifierFn) {
    console.log(UPGRADE_REQUIRED);
    let _module;
    try {
        _module = await import("inquirer");
    } catch (err) {
        console.log(INQUIRER_REQUIRED);
        return;
    }

    const inquirer = _module.default;
    const answers = await inquirer.prompt([{
        message: "Keep a copy of the old version?"
        ,type: "confirm"
        ,name: "keepBackup"
        ,required: true
        ,default: "y"
    }]);

    if (answers.keepBackup) {
        const backupFile = userConfFile + ".old";
        await fs.copy(userConfFile, backupFile);
        console.info(`A backup of your previous configuration has been written to '${backupFile}'`);
    }

    const newConf = userConfModifierFn.call(undefined, userConfData, defaultConfData);
    await fs.writeJson(userConfFile, newConf, { spaces: 2 });
    return newConf;
}

function suggestUpdate(userConfData, defaultConfData) {
    console.info(`ⓘ  Version Info:
────────────────
There's an updated config schema available at ${defaultConfData.$schema}. We recommend updating $schema in your config file to get the latest options suggested (if your editor supports it). But you may also just ignore this message. For more details on what's new see our changelog at https://github.com/about-code/glossarify-md/blob/master/CHANGELOG.md.
────────────────
`);
    return userConfData;
}

export function upgrade(userConfData, userConfFile, defaultConfData) {
    if (needsUpgrade(userConfData, defaultConfData)) {
        return updateConfig(userConfData, userConfFile, defaultConfData, applyUpgrades);
    } else if (hasUpdate(userConfData, defaultConfData)) {
        suggestUpdate(userConfData, defaultConfData);
        return Promise.resolve(userConfData);
    } else {
        return Promise.resolve(userConfData);
    }
}
