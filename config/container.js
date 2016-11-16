module.exports = (container) => {
  container.add('Commander', require('../src/Commander'), ['container']);

  container.add('Server', require('../src/Server'), ['Options']);
  container.add('Options', require('../src/Options'), ['config', 'Commander']);
};