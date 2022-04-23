// @ts-check

/**
 * @typedef {(string|Error)} LoggerMessage
 */

/**
 * @typedef RealLogger
 * @property {RealLogger_log} log
 */
/**
 * @callback RealLogger_log
 * @param {string} level
 * @param {string} message
 * @param {Object} data
 */

export class Logger {
    /**
     * @param {Object} options
     * @param {RealLogger} options.realLogger
     * @param {Array<string>} options.namespaces
     */
    constructor({ realLogger, namespaces = [] }) {
        this.realLogger = realLogger;
        this.namespaces = namespaces;
        this._messagePrefix = this._getMessagePrefix();
    }

    /**
     * @returns {string}
     */
    _getMessagePrefix() {
        const prefixParts = [];
        for (const namespace of this.namespaces) {
            prefixParts.push(`[${namespace}]`);
        }
        return prefixParts.join('');
    }

    /**
     * @param {string} level
     * @param {LoggerMessage} message
     * @param {Object} data
     */
    log(level, message, data = {}) {
        if (message instanceof Error) {
            const err = message;
            message = err.stack;
            data = Object.assign({}, err, data);
        }
        this.realLogger.log(level, `${this._messagePrefix} ${message}`, data);
    }

    /**
     * @param {string} namespace
     * @returns {Logger}
     */
    scope(namespace) {
        return new Logger({
            realLogger: this.realLogger,
            namespaces: [...this.namespaces, namespace]
        });
    }
}

for (const level of ['debug', 'info', 'warn', 'error']) {
    /**
     * @param {LoggerMessage} message
     * @param {Object} data
     */
    Logger.prototype[level] = function (message, data) {
        this.log(level, message, data);
    };
}
