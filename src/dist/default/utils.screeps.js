// @ts-check

// Global variables
var Game, FIND_SOURCES, OK, RESOURCE_ENERGY, ERR_NOT_IN_RANGE;
var WORK, CARRY, MOVE;

exports.statusOK = () => OK;
exports.statusErrNotInRange = () => ERR_NOT_IN_RANGE;

exports.resourceEnergy = () => RESOURCE_ENERGY;

exports.partWork = () => WORK;
exports.partCarry = () => CARRY;
exports.partMove = () => MOVE;

/**
 * Return an Screep object by its ID
 * @param {string} id
 * @returns
 */
exports.getObjectById = (id) => {
  return Game.getObjectById(id);
};

exports.getRoom = (roomName) => {
  return Game.rooms[roomName];
};

exports.getSources = (roomName) => {
  return exports.getRoom(roomName).find(FIND_SOURCES);
};

exports.getEntityRoom = (entity) => {
  return entity.room;
};

exports.getEntityEnergyStorageLevels = (entity) => {
  return entity.store[exports.resourceEnergy()];
};

exports.getEntityEnergyStorageCapacity = (entity) => {
  return entity.store.getCapacity(exports.resourceEnergy());
};

exports.getEntityMemory = (entity) => entity.memory;

exports.getKeyFromEntityMemory = (entity, key) =>
  exports.getEntityMemory(entity)[key];

exports.setKeyOnEntityMemory = (entity, key, value) => {
  entity.memory[key] = value;
};
