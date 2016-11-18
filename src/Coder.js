"use strict";

var jwt = require('jsonwebtoken');
var es = require('event-stream');

module.exports = class Coder {
    constructor(options) {
        this.options = options;
    }

    encode(data) {
        return new Promise((resolve, reject) => {
            jwt.sign(data, this.options.get('key'),
                {expiresIn: this.options.get('keyExpiresIn')},
                (err, token) => {
                    if (err) return reject(err);
                    resolve(token);
                });
        });
    }

    decode(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this.options.get('key'), (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded);
            });
        });
    }

    encodeStream() {
        return es.map((text, next) => {
            return this.encode({text: text.toString()})
                .then((token) => next(null, token))
                .catch(next);
        });
    }

    decodeStream() {
        return es.map((token, next) => {
            return this.decode(token)
                .then((data) => next(null, data.text))
                .catch(next);
        });
    }
};
