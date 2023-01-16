const utils = require('./utils');

const createLightMiner = (name = `Miner ${utils.randomInteger()}`) => {
  return (spawn) => {
    spawn.spawnCreep([WORK, CARRY, MOVE], name, { memory: { role: 'miner' } });
  };
};

const run = (miner) => {};

module.exports = {
  createLightMiner,
  run: (minerName) => run(Game.creeps[minerName]),
};
