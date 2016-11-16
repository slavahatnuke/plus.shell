module.exports = (app) => {

    function done(err) {
        if (err) {
            console.log('[ERROR]', err, err.stack);
            return process.exit(1);
        }

        process.exit(0);
    }

    let program = require('commander');

    program
        .version(require('../package.json').version)
        .option("-p, --port [port]", "Port")
        .option("-h, --host [host]", "Host")
        .option("-k, --key [key]", "Key")
        .command('start')
        .action(() => app.Server.start().then(() => 'ok', done));

    return program;
};