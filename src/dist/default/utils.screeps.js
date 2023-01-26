// @ts-check

// Global variables
var Game, FIND_SOURCES, OK, RESOURCE_ENERGY, ERR_NOT_IN_RANGE;
var WORK, CARRY, MOVE;
var ERR_NOT_IN_RANGE,
  ERR_NOT_OWNER,
  ERR_NO_PATH,
  ERR_NAME_EXISTS,
  ERR_BUSY,
  ERR_NOT_FOUND,
  ERR_NOT_ENOUGH_ENERGY,
  ERR_NOT_ENOUGH_RESOURCES,
  ERR_INVALID_TARGET,
  ERR_FULL,
  ERR_INVALID_ARGS,
  ERR_TIRED,
  ERR_NO_BODYPART,
  ERR_NOT_ENOUGH_EXTENSIONS,
  ERR_RCL_NOT_ENOUGH,
  ERR_GCL_NOT_ENOUGH;

exports.statusOK = () => OK;
exports.statusErrNotInRange = () => ERR_NOT_IN_RANGE;
exports.statusErrNotOwner = () => ERR_NOT_OWNER;
exports.statusErrNoPath = () => ERR_NO_PATH;
exports.statusErrNameExists = () => ERR_NAME_EXISTS;
exports.statusErrBusy = () => ERR_BUSY;
exports.statusErrNotFound = () => ERR_NOT_FOUND;
exports.statusErrNotEnoughEnergy = () => ERR_NOT_ENOUGH_ENERGY;
exports.statusErrNotEnoughResources = () => ERR_NOT_ENOUGH_RESOURCES;
exports.statusErrInvalidTarget = () => ERR_INVALID_TARGET;
exports.statusErrFull = () => ERR_FULL;
exports.statusErrInvalidArgs = () => ERR_INVALID_ARGS;
exports.statusErrTired = () => ERR_TIRED;
exports.statusErrNoBodypart = () => ERR_NO_BODYPART;
exports.statusErrNotEnoughExtensions = () => ERR_NOT_ENOUGH_EXTENSIONS;
exports.statusErrRclMotEnough = () => ERR_RCL_NOT_ENOUGH;
exports.statusErrGclNotEnough = () => ERR_GCL_NOT_ENOUGH;
exports.statusValueToCode = (code) =>
  ({
    [OK]: 'OK',
    [ERR_NOT_IN_RANGE]: 'ERR_NOT_IN_RANGE',
    [ERR_NOT_OWNER]: 'ERR_NOT_OWNER',
    [ERR_NO_PATH]: 'ERR_NO_PATH',
    [ERR_NAME_EXISTS]: 'ERR_NAME_EXISTS',
    [ERR_BUSY]: 'ERR_BUSY',
    [ERR_NOT_FOUND]: 'ERR_NOT_FOUND',
    [ERR_NOT_ENOUGH_ENERGY]: 'ERR_NOT_ENOUGH_ENERGY',
    [ERR_NOT_ENOUGH_RESOURCES]: 'ERR_NOT_ENOUGH_RESOURCES',
    [ERR_INVALID_TARGET]: 'ERR_INVALID_TARGET',
    [ERR_FULL]: 'ERR_FULL',
    [ERR_INVALID_ARGS]: 'ERR_INVALID_ARGS',
    [ERR_TIRED]: 'ERR_TIRED',
    [ERR_NO_BODYPART]: 'ERR_NO_BODYPART',
    [ERR_NOT_ENOUGH_EXTENSIONS]: 'ERR_NOT_ENOUGH_EXTENSIONS',
    [ERR_RCL_NOT_ENOUGH]: 'ERR_RCL_NOT_ENOUGH',
    [ERR_GCL_NOT_ENOUGH]: 'ERR_GCL_NOT_ENOUGH',
  }[code]);

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

exports.getAmountOfMiners = () => {
  return Object.values(Game.creeps).filter(
    (creep) => creep.memory.role === 'miner'
  ).length;
};

exports.getMinerBySerial = (serial) => {
  return Object.values(Game.creeps).find(
    (creep) => creep.memory.serial === serial
  );
};
