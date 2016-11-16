module.exports = (container) => {
  container.add('Commander', require('../src/Commander'), ['container']);

  container.add('Server', require('../src/Server'), ['Options', 'Worker']);
  container.add('Client', require('../src/Client'), ['Options']);
  container.add('Worker', require('../src/Worker'), ['ProcessKiller']);
  container.add('ProcessKiller', require('../src/ProcessKiller'), []);

  container.add('Options', require('../src/Options'), ['config', 'Commander']);
};