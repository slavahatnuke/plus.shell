var socketStream = require('socket.io-stream');
var eventStream = require('event-stream');

module.exports = class Client {
    constructor(options) {
        this.options = options;

        var host = this.options.get('host');
        var port = this.options.get('port');
        this.socket = require('socket.io-client')(`http://${host}:${port}`);

        this.bind();
    }

    bind() {
        socketStream(this.socket).on('log', (stream) => {
            stream.pipe(eventStream.map((data, next) => {
                console.log(data.toString());
                next();
            }));
        });
    }

    run(command) {
        return new Promise((resolve, reject) => {
            this.socket.emit('run', command, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
    }
};
