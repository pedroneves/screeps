const configs = require('./configs');
const utils = require('./utils');
const roleMiner = require('./role.miner');

const STATE_IDLE = 'IDLE';
const STATE_BUILDING = 'BUILDING';

const run = (spawn) => {
  const initMemory = () => {
    if (!spawn.memory.state)
      spawn.memory.state = {
        status: STATE_IDLE,
      };
  };

  const say = (text = 'noOooOp...') => {
    new RoomVisual(configs.roomName).text(text, spawn.pos.x, spawn.pos.y - 2, {
      color: 'green',
      font: 1,
    });
  };

  const clearSaying = () => {
    new RoomVisual(configs.roomName).clear();
  };

  const isIdle = () => spawn.memory.state.status === STATE_IDLE;
  const isBuilding = () => spawn.memory.state.status === STATE_BUILDING;

  const spawnLightMiner = () => {
    spawn.memory.state.status = STATE_BUILDING;
    const incubateAt = roleMiner.createLightMinerFactory();
    incubateAt({ spawn });
  };

  const checkMinerAmount = () => {
    const minersAmount = utils.getAmountOfMiners();
    say(`Found ${minersAmount} miners`);

    if (minersAmount < configs.maxNumberMiners) {
      spawnLightMiner();
    }
  };

  // -------------------------------------------------------

  initMemory();
  checkMinerAmount();
};

module.exports = { run: (spawnName) => run(Game.spawns[spawnName]) };
