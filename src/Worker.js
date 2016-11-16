module.exports = () => {
    let socketStream = require('socket.io-stream');
    let exec = require('child_process').exec;

    return class Worker {
        constructor(socket) {
            this.socket = socket;
            this.runChild = null;
            this.runCommand = null;
            this.bind();
        }

        bind() {
            this.socket.on('run', (command, next) => this.run(command).then((stream) => next(null, stream), next));
            this.socket.on('client.exit', () => this.kill());
        }

        kill() {
            return Promise.resolve()
                .then(() => {
                    if (this.runChild) {
                        var runCommand = this.runCommand;
                        console.log('>', runCommand, ' - is killed');

                        var killer = 'which kill && kill ' + this.runChild.pid;
                        exec(killer, (err) => {
                            if (err) return console.log('>', runCommand, ' - can not kill');
                        });

                        this.runChild.kill('SIGINT');
                        this.runChild = null;
                        this.runCommand = null;
                    }
                });
        }

        notifyExit() {
            this.socket.emit('server.exit');
        }

        run(command) {
            return new Promise((resolve, reject) => {
                let stream = socketStream.createStream();
                socketStream(this.socket).emit('log', stream);

                this.runCommand = command;

                console.log('>', command);

                this.runChild = exec(command, {
                    maxBuffer: 1024 * 1024 * 1024 * 1024
                }, () => 'ok');


                this.runChild.stdout.pipe(stream);
                this.runChild.stderr.pipe(stream);

                this.runChild.stdout.pipe(process.stdout);
                this.runChild.stderr.pipe(process.stderr);

                stream.on('end', () => {
                    this.runChild = null;
                    this.runCommand = null;
                    resolve();
                });
            });
        }
    }
};