"use strict";

var socketStream = require('socket.io-stream');
var es = require('event-stream');

module.exports = class Client {
    constructor(options, Coder) {
        this.options = options;
        this.Coder = Coder;

        this.getSocket();
        this.bind();
    }

    getSocket() {
        return new Promise((resolve, reject) => {
            var host = this.options.get('host');
            var port = this.options.get('port');

            if (this._socket) {
                return resolve(this._socket);
            }

            this.Coder.encode({})
                .then((token) => {
                    this._socket = require('socket.io-client')(`http://${host}:${port}?access_token=${token}`);
                })
                .then(() => resolve(this._socket))
                .catch(reject);
        });
    }

    bind() {

        process.on('SIGINT', () => this.onExit());
        process.on('exit', () => this.onExit());

        return this.getSocket().then((socket) => {
            socket.on("error", function (err) {
                console.log('[ERROR]', err);
                process.exit(1);
            });

            socket.on('server.exit', () => setTimeout(() => process.exit(1), 500));

            socketStream(socket).on('log', (stream) => {
                stream
                    .pipe(es.map((data, next) => next(null, data.toString())))
                    .pipe(this.Coder.decodeStream())
                    .pipe(es.map((data, next) => {
                        console.log(data);
                        next(null, data);
                    }));
            });


        });
    }

    onExit() {
        setTimeout(() => process.exit(0), 500);

        return this.getSocket().then((socket) => {
            socket.emit('client.exit');
        });
    }

    run(command) {
        return this.getSocket().then((socket) => {
            return this.Coder.encode({command: command}).then((token) => {
                return new Promise((resolve, reject) => {
                    socket.emit('run', token, (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });
        });
    }
};
