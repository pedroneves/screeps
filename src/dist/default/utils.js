const getAmountOfMiners = () => {
  return Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === 'miner'
  ).length;
};

const randomInteger = () => Math.ceil(1000000 * Math.random());

module.exports = {
  randomInteger,
  getAmountOfMiners,
};
