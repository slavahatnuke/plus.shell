"use strict";

module.exports = class Options {
    constructor(config, commander) {
        this.config = config;
        this.commander = commander;
    }

    get(name) {
        return this.commander[name] || this.config.get(name);
    }
};