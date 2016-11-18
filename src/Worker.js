"use strict";

module.exports = (ProcessKiller, Coder) => {
    var socketStream = require('socket.io-stream');
    var exec = require('child_process').exec;

    return class Worker {
        constructor(socket) {
            this.socket = socket;
            this.commands = [];

            this.bind();
        }

        bind() {
            this.socket.on('run', (command, next) => this.run(command).then((stream) => next(null, stream), next));
            this.socket.on('client.exit', () => this.kill());
        }

        kill() {
            return Promise
                .all(this.commands.map((command) => {
                    return Promise.resolve()
                        .then(() => {
                            if (command.process) {
                                ProcessKiller.kill(command.process.pid)
                                    .then(() => command.process && command.process.kill('SIGINT'))
                                    .then(() => console.log('>', command.command, ' - is killed'))
                                    .catch((err) => console.log('>', command.command, ' - can not kill', err.message));
                                command.process = null;
                            }
                        });
                }))
                .then(() => this.commands = []);
        }

        notifyExit() {
            this.socket.emit('server.exit');
        }

        run(command) {
            return Coder.decode(command).then((data) => {
                command = data.command;

                return new Promise((resolve, reject) => {
                    var stream = socketStream.createStream();
                    socketStream(this.socket).emit('log', stream);

                    var item = {
                        command: command,
                        process: null
                    };

                    console.log('>', item.command);

                    item.process = exec(item.command, {
                        maxBuffer: 1024 * 1024 * 1024 * 1024
                    }, (err) => {
                        if (err) {
                            this.commands = this.commands.filter((anItem) => anItem !== item);
                            return reject(err);
                        }
                    });

                    this.commands.push(item);

                    item.process.stdout.pipe(Coder.encodeStream()).pipe(stream);
                    item.process.stderr.pipe(Coder.encodeStream()).pipe(stream);

                    item.process.stdout.pipe(process.stdout);
                    item.process.stderr.pipe(process.stderr);

                    stream.on('end', () => {
                        this.commands = this.commands.filter((anItem) => anItem !== item);
                        resolve();
                    });
                });

            });
        }
    }
};