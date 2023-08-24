
/**
 * Error being thrown when an invalid configuration was detected.
 * May be handled like a validation error, so may not need to
 * terminate process abnormaly with process.exit(1) but could
 * be handled to terminate process with process.exit(0).
 *
 * @implements Error
 */
export class ConfigError extends Error {

    constructor(message) {
        super(message);
    }

    get code() {
        return ConfigError.ERR_CONF;
    }
}
ConfigError.code = "ERR_CONF";
