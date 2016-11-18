"use strict";

module.exports = class Server {
    constructor(options, Worker, Coder) {
        this.httpServer = null;
        this.options = options;
        this.workers = [];
        this.Worker = Worker;
        this.Coder = Coder;
    }


    onExit() {
        this.workers.forEach((worker) => worker.notifyExit());
        process.exit(0);
    }

    start() {
        this.httpServer = require('http').createServer((req, res) => null);
        this.io = require('socket.io')(this.httpServer);

        this.io.use((req, accept) => {
            if (req.handshake.query && req.handshake.query.access_token) {
                this.Coder.decode(req.handshake.query.access_token)
                    .then(() => accept())
                    .catch(() => accept(new Error('No access')));
            } else {
                console.log('no access');
                accept(new Error('No access'));
            }
        });

        this.io.on('connection', (socket) => {
            var worker = new this.Worker(socket);

            this.workers.push(worker);
            socket.on('disconnect', () => {
                this.workers = this.workers.filter((aSocket) => aSocket === socket);
                worker.kill();
            });
        });

        var dir = this.options.get('dir');

        if (dir) {
            try {
                process.chdir(dir);
            } catch (err) {
                console.log(`plus.shell dir -> was not changed`);
                console.log(` > chdir: ${err}`);
            }

            console.log(`plus.shell dir -> ${process.cwd()}`);
        }

        process.on('SIGINT', () => this.onExit());
        process.on('exit', () => this.onExit());

        return new Promise((resolve, reject) => {
            var port = this.options.get('port');
            var serverMask = this.options.get('serverMask');

            this.httpServer.listen(port, serverMask, (err) => {
                if (err) return reject(err);
                console.log(`plus.shell -> ${serverMask}:${port}`);
                resolve();
            });
        });
    }
};
