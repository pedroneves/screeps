const getAmountOfMiners = () => {
  return Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === 'miner'
  ).length;
};

const randomInteger = (min = 0, max = 1000000) =>
  min + Math.floor((max - min) * Math.random());

const randomItemFromArray = (arr = []) => {
  if (!arr.length) return;
  return arr[randomInteger(0, arr.length)];
};

module.exports = { getAmountOfMiners, randomInteger, randomItemFromArray };
