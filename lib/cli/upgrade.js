const {copySync, writeFile} = require("fs-extra");
const inquirer = require("inquirer");
const {needsUpgrade, hasUpgradePath, getVersion} = require("./upgrade/version");
const {v4To5} = require("./upgrade/v4to5");

const upgrades = [v4To5];


function performUpgrades(confData, effectiveVersion) {
    for (const upgradeFn of upgrades) {
        const confVersion = getVersion(confData);
        if (confVersion < effectiveVersion) {
            confData = upgradeFn(confData, confVersion) || confData;
        }
    }
    return confData;
}

function upgrade(confData, confFile, defaultConf) {
    const effectiveVersion = getVersion(defaultConf);
    if (! needsUpgrade(confData, effectiveVersion)) {
        hasUpgradePath(confData, effectiveVersion);
        return Promise.resolve(confData);
    } else {
        return inquirer.prompt([{
            message: "Your configuration needs an upgrade. Keep a copy of the old version?"
            ,type: "confirm"
            ,name: "keepBackup"
            ,required: true
            ,default: "y"
        }]).then((answers) => {
            return new Promise((resolve, reject) => {
                if (answers.keepBackup) {
                    const backupFile = confFile + ".old";
                    try {
                        copySync(confFile, backupFile);
                        console.info(`Backup of previous configuration in '${backupFile}'`);
                    } catch (err) {
                        reject(err);
                    }
                }
                const newConf = performUpgrades(confData, effectiveVersion);
                if (hasUpgradePath(newConf, effectiveVersion)) {
                    writeFile(confFile, JSON.stringify(newConf, null, 2), "utf-8", (err) => {
                        if (err) { reject(err); }
                        resolve(newConf);
                    });
                } else {
                    resolve(newConf);
                }
            });
        });
    }
}
module.exports = upgrade;
