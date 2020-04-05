class Logger {
    constructor({logger, prefixes = []}) {
        this.logger = logger
        this.prefixes = prefixes
        this._prefix = this._getPrefix()
    }

    _getPrefix() {
        let formatedPrefixes = []
        for (let prefix of this.prefixes) {
            formatedPrefixes.push(`[${prefix}]`)
        }
        return formatedPrefixes.join('')
    }

    log(level, message, data = {}) {
        let prefix = this._prefix
        if (message instanceof Error) {
            let err = message
            message = err.stack
            data = Object.assign({}, err, data)
        }
        return this.logger[level](`${prefix} ${message}`, data)
    }

    scope(prefix) {
        return new Logger({
            logger: this.logger,
            prefixes: [...this.prefixes, prefix]
        })
    }
}

for (let level of ['debug', 'info', 'warn', 'error']) {
    Logger.prototype[level] = function (message, data) {
        return this.log(level, message, data)
    }
}

module.exports = {
    Logger
}
