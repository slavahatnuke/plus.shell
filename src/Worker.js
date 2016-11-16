module.exports = () => {
    var socketStream = require('socket.io-stream');

    return class Worker {
        constructor(socket) {
            this.socket = socket;
            this.bind();
        }

        bind() {
            this.socket.on('run', (command, next) => this.run(command).then((stream) => next(null, stream), next))
        }

        run(command) {
            return new Promise((resolve, reject) => {
                var stream = socketStream.createStream();
                socketStream(this.socket).emit('log', stream);

                let exec = require('child_process').exec;

                console.log('>', command);

                let child = exec(command, {
                    maxBuffer: 1024 * 1024 * 1024 * 1024
                }, () => 'ok');

                child.stdout.pipe(stream);
                child.stderr.pipe(stream);

                child.stdout.pipe(process.stdout);
                child.stderr.pipe(process.stderr);

                stream.on('end', resolve);
            });
        }
    }
};