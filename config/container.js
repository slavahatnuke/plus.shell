"use strict";

module.exports = (container) => {
  container.add('Commander', require('../src/Commander'), ['container']);

  container.add('Server', require('../src/Server'), ['Options', 'Worker', 'Coder']);
  container.add('Client', require('../src/Client'), ['Options', 'Coder']);
  container.add('Worker', require('../src/Worker'), ['ProcessKiller', 'Coder']);
  container.add('ProcessKiller', require('../src/ProcessKiller'), []);
  container.add('Coder', require('../src/Coder'), ['Options']);

  container.add('Options', require('../src/Options'), ['config', 'Commander']);
};