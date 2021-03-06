"use strict";

module.exports = (app) => {

    function done(err) {
        if (err) {
            console.log('[ERROR]', err, err.stack || '');
            setTimeout(() => process.exit(1), 500);
            return false;
        }

        process.exit(0);
    }

    var program = require('commander');

    program
        .version(require('../package.json').version)
        .option("-p, --port [port]", "Port")
        .option("-h, --host [host]", "Host")
        .option("-k, --key [key]", "Key")
        .option("-d, --dir [dir]", "Work dir")
        .command('start')
        .action(() => app.Server.start().then(() => 'ok', done));

    program.command('run [command...]')
        .action((command) => app.Client.run(command.join(' ')).then(done, (err) => {
            setTimeout(() => {
                console.log('>', command.join(' '), '\n');
                console.log('ERROR >');
                console.log(err);
                console.log('\n');
                process.exit(1);
            }, 1000);
        }));

    return program;
};