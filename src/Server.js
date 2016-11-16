module.exports = class Server {
    constructor(options) {
        this.httpServer = null;
        this.options = options;
    }

    start() {
        this.httpServer = require('http').createServer(() => null);
        this.io = require('socket.io')(this.httpServer);

        return new Promise((resolve, reject) => {
            var port = this.options.get('port');
            var ip = this.options.get('ip');

            this.httpServer.listen(port, ip, (err) => {
                if (err) return reject(err);
                console.log(`plus.shell -> ${ip}:${port}`);
                resolve();
            });
        });
    }
};
