const {copy, writeFile} = require("fs-extra");
const inquirer = require("inquirer");

const upgrades = [v4To5];

// =================/ Upgrades \=================
function v4To5(confData, confVersion) {
    if (confVersion > 4) {
        return;
    }
    if (typeof confData.linking === "string") {
        confData.linking = { paths: confData.linking, mentions: "all" };
    }
    if (typeof confData.baseUrl === "string") {
        confData.linking = Object.assign({}, confData.linking, { baseUrl: confData.baseUrl });
        delete confData.baseUrl;
    }
    if (confData.$schema) {
        confData.$schema = confData.$schema.replace("conf.schema.json", "conf/v4/schema.json");
    }
    liftSchemaVersion("5.0.0", confData);
    return confData;
}
// =================\ Upgrades /=================


const searchPathVersion = /\/conf\/v\d\/schema.json/;
const searchTagVersion  = /\/glossarify-md\/v([\d.]+){1,}\//;
function liftSchemaVersion(targetVersion, confData) {
    const targetMajor = targetVersion[0];
    if (confData.$schema) {
        confData.$schema = confData.$schema.replace(searchPathVersion, `/conf/v${targetMajor}/schema.json`);
        confData.$schema = confData.$schema.replace(searchTagVersion,  `/glossarify-md/v${targetVersion}/`);
    } else {
        confData.$schema = `https://raw.githubusercontent.com/about-code/glossarify-md/v${targetVersion}/conf/v${targetVersion[0]}/schema.json`;
    }
}

function getConfVersion(confData) {
    const schemaPath = confData.$schema;
    if (schemaPath) {
        const match = /^.*\/conf\/v(\d)\/schema.json/.exec(schemaPath);
        if (match) {
            return parseInt(match[1]);
        }
    }
    return 0;
}

function hasUpgradePath(resultConfData, effectiveVersion) {
    const confVersion = getConfVersion(resultConfData);
    if (confVersion !== effectiveVersion) {
        console.log(
            `⚠ Warning: Missing upgrade path from your config version (v${confVersion}) to effective schema version (v${effectiveVersion})!`
        );
        return false;
    } else {
        return true;
    }
}

function needsUpgrade(confData, effectiveVersion) {
    const userConfVersion  = getConfVersion(confData);
    return userConfVersion !== effectiveVersion;
}

function performUpgrades(confData, effectiveVersion) {
    for (const upgradeFn of upgrades) {
        const confVersion = getConfVersion(confData);
        if (confVersion < effectiveVersion) {
            confData = upgradeFn(confData, confVersion) || confData;
        }
    }
    return confData;
}

function upgrade(confData, confFile, defaultConf) {
    const effectiveVersion = getConfVersion(defaultConf);
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
                    copy(confFile, backupFile, (err) => {
                        if (err) { reject(err); }
                        console.info(`Backup of previous configuration in '${backupFile}'`);
                    });
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
