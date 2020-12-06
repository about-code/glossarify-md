const {copy, writeFile} = require("fs-extra");
const inquirer = require("inquirer");
const LATEST_SCHEMA_VERSION = 5;

function upgradeV4toV5(confData) {
    if (typeof confData.linking === "string") {
        confData.linking = { paths: confData.linking, terms: "all" };
    }
    if (typeof confData.baseUrl === "string") {
        confData.linking = Object.assign({}, confData.linking, { baseUrl: confData.baseUrl });
        delete confData.baseUrl;
    }
    if (confData.$schema) {
        confData.$schema = confData.$schema.replace("conf.schema.json", "conf/v5/schema.json");
    } else {
        confData.$schema = "https://raw.githubusercontent.com/about-code/glossarify-md/v5.0.0/conf/v5/schema.json";
    }
    return confData;
}

function performUpgrades(confData) {
    const upgrades = [upgradeV4toV5];
    let upgradeFn;
    for (upgradeFn of upgrades) {
        confData = upgradeFn(confData);
    }
    return confData;
}

function upgrade(confData, confFile) {
    const confVersion = getConfVersion(confData);
    if (confVersion >= LATEST_SCHEMA_VERSION) {
        // config is up to date.
        return Promise.resolve(confData);
    }
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
            const newConf = performUpgrades(confData, confFile);
            writeFile(confFile, JSON.stringify(newConf, null, 2), "utf-8", (err) => {
                if (err) { reject(err); }
                resolve(newConf);
            });
        });
    });
}

function getConfVersion(confData) {
    const schemaPath = confData.$schema;
    if (schemaPath) {
        const match = /^.*\/conf\/v(\d)\/schema.json/.exec(schemaPath);
        if (match) {
            return match[1];
        }
    }
    // no schema version given. Assume <= v4. This should likely trigger
    // an error in the next major version.
    return 4;
}


module.exports = upgrade;
