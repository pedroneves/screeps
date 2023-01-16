const roleSpawn = require('./role.spawn');

module.exports.loop = function () {
  for (let spawnName in Game.spawns) {
    roleSpawn.run(spawnName);
  }
};
