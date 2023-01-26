const roleSpawn = require('./role.spawn');
const roleMiner = require('./role.miner');

module.exports.loop = function () {
  for (let spawnName in Game.spawns) {
    roleSpawn.run(spawnName);
  }

  for (let creepName in Game.creeps) {
    const creep = Game.creeps[creepName];
    if (creep.memory && creep.memory.role === 'miner') roleMiner.run(creep);
  }
};
