module.exports = class ProcessKiller {
    constructor() {
        this.exec = require('child_process').exec;
        this.psTree = require('ps-tree');
    }

    run(command) {
        return new Promise((resolve, reject) => {
            this.exec(command, (err) => {
                if (err) return reject(err);
                resolve(true);
            });
        });
    }

    psKill(pid) {
        return this.run('ps')
            .catch(() => false)
            .then((hasCommand) => {

                if (!hasCommand) {
                    return Promise.resolve();
                }

                return new Promise((resolve, reject) => {
                    this.psTree(pid, (err, children) => {
                        if (err) return reject(err);

                        var pids = children.map((p) => p.PID);
                        if (!pids.length) return resolve();

                        var command = 'kill -s 9 ' + pids.join(' ');
                        this.run(command)
                            .then(resolve, reject);
                    });
                });
            })
            .catch(() => Promise.resolve());
    }

    kill(pid) {
        return this.psKill(pid)
            .then(() => {
                return new Promise((resolve, reject) => {
                    setTimeout(resolve, 100);
                });
            })
            .then(() => this.run('kill -s 9 ' + pid))
            .catch(() => true);
    }
};
