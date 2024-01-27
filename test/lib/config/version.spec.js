import { strictEqual } from "node:assert";
import { hasUpdate, needsUpgrade } from "../../../lib/cli/upgrade/version.js";
import { getDefaultConfig } from "../../../lib/model/config.js";

/*
(function it_should_fail_when_schema_format_or_format_path_changes() {
    const actualFormatPath = currentFormatPath;
    const expectedFormatPath = "/conf/v5/schema.json";

    // const expectedSchemaUrl = "https://raw.githubusercontent.com/about-code/glossarify-md/0/conf/v0/schema.json";
    strictEqual(actualFormatPath, expectedFormatPath, "Changing the config schema format or format path is considered to be a BREAKING CHANGE. Make sure to have an upgrade procedure in place. Make sure to keep the old schema file, schema repository path and raw.githubusercontent.com/about-code/glossarify-md/ file URL available.");
})();*/

(function it_should_detect_update_available() {
    const config = (version) => {
        return { "$schema": version };
    };

    const oldReleaseVersion     = config("https://raw.githubusercontent.com/about-code/glossarify-md/v1.0.0/conf/v5/schema.json");
    const newFormatVersion      = config("https://raw.githubusercontent.com/about-code/glossarify-md/v1.0.0/conf/v6/schema.json");
    const newReleaseVersionBug  = config("https://raw.githubusercontent.com/about-code/glossarify-md/v1.0.1/conf/v5/schema.json");
    const newReleaseVersionFeat = config("https://raw.githubusercontent.com/about-code/glossarify-md/v1.1.0/conf/v5/schema.json");
    const newReleaseVersionMaj  = config("https://raw.githubusercontent.com/about-code/glossarify-md/v2.0.0/conf/v5/schema.json");
    const sameOldReleaseVersion = oldReleaseVersion;

    strictEqual(hasUpdate(oldReleaseVersion, newReleaseVersionBug), true, "It should detect newer bugfix versions available.");
    strictEqual(hasUpdate(oldReleaseVersion, newReleaseVersionFeat), true, "It should detect newer feature versions available.");
    strictEqual(hasUpdate(oldReleaseVersion, newReleaseVersionMaj), true, "It should detect newer major versions available.");
    strictEqual(hasUpdate(oldReleaseVersion, sameOldReleaseVersion), false, "It should not detect updates when versions match.");
    strictEqual(hasUpdate(newReleaseVersionMaj, oldReleaseVersion), true, "It should suggest updating config when given release version is newer.");
    strictEqual(hasUpdate(newReleaseVersionBug, oldReleaseVersion), true, "It should suggest updating config when given release version is newer.");
    strictEqual(hasUpdate(newReleaseVersionFeat, oldReleaseVersion), true, "It should suggest updating config when given release version is newer.");
    strictEqual(hasUpdate(oldReleaseVersion, newFormatVersion), false, "It should not detect updates when release version did not change but format version changed).");
    strictEqual(hasUpdate(newFormatVersion, oldReleaseVersion), false, "It should not detect updates when release version did not change but format version changed).");
})();

(function it_should_detect_upgrade_available() {
    const config = (version) => {
        return {
            "$schema": version
            ,"baseDir": "."
            ,"outDir": "/tmp"
        };
    };

    const defaultVersion = getDefaultConfig();
    const sameDefaultVersion = defaultVersion;

    const olderFormatVersionRemote = config("https://raw.githubusercontent.com/about-code/glossarify-md/v1.0.0/conf/v1/schema.json");
    const newerFormatVersionRemote = config("https://raw.githubusercontent.com/about-code/glossarify-md/v1.0.0/conf/v10000/schema.json");

    const olderFormatVersionLocal = config("./node_modules/glossarify-md/conf/v0/schema.json");
    const newerFormatVersionLocal = config("./node_modules/glossarify-md/conf/v10000/schema.json");

    strictEqual(needsUpgrade(olderFormatVersionRemote,  defaultVersion), true);
    strictEqual(needsUpgrade(olderFormatVersionLocal,   defaultVersion), true);
    strictEqual(needsUpgrade(sameDefaultVersion,        defaultVersion), false);
    strictEqual(needsUpgrade(newerFormatVersionLocal,   defaultVersion), true);
    strictEqual(needsUpgrade(newerFormatVersionRemote,  defaultVersion), true);
})();

// (function it_should_fail_when_format_version_greater_release_version() {
// })()
