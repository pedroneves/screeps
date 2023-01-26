//@ts-check
const { createWorkflowStep, createWorkflow } = require('./utils.workflow');
const {
  getSources,
  getEntityRoom,
  getObjectById,
  statusOK,
  getEntityEnergyStorageLevels,
  getEntityEnergyStorageCapacity,
  getKeyFromEntityMemory,
  resourceEnergy,
  statusErrNotInRange,
} = require('./utils.screeps');

/**
 * @typedef {import('./types').WorkflowStepExecutionResult} WorkflowStepExecutionResult
 */

const hasTargetSource = createWorkflowStep({
  name: 'hasTargetSource',
  exec: (workflow, context, miner) => {
    const { targetSourceId } = context.data;

    if (!targetSourceId) return { nextStepName: 'findSource' };

    return { nextStepName: 'moveToSource' };
  },
});

const findSource = createWorkflowStep({
  name: 'findSource',
  exec: (workflow, context, entity) => {
    const room = getEntityRoom(entity);
    const sources = getSources(room.name);

    const closestSource = sources.reduce((closestSource, source) => {
      const range = entity.pos.getRangeTo(source);
      if (!closestSource || range < entity.pos.getRangeTo(closestSource))
        return source;
      return closestSource;
    }, null);

    /** @type {WorkflowStepExecutionResult} */
    const result = {
      nextStepName: 'moveToSource',
      dataUpdates: { targetSourceId: closestSource.id },
    };

    return result;
  },
});

const moveToSource = createWorkflowStep({
  name: 'moveToSource',
  exec: (workflow, context, miner) => {
    const source = getObjectById(context.data.targetSourceId);
    if (miner.harvest(source) === statusOK()) return { nextStepName: 'mine' };

    miner.say('⏩⛏️');
    miner.moveTo(source);
    return { nextStepName: 'moveToSource' };
  },
});

const mine = createWorkflowStep({
  name: 'mine',
  exec: (workflow, context, miner) => {
    miner.say('⏳⛏️');

    const source = getObjectById(context.data.targetSourceId);
    miner.harvest(source);

    const storage = getEntityEnergyStorageLevels(miner);
    const capacity = getEntityEnergyStorageCapacity(miner);

    if (storage >= capacity) return { nextStepName: 'moveToSpawn' };

    return { nextStepName: 'mine' };
  },
});

const moveToSpawn = createWorkflowStep({
  name: 'moveToSpawn',
  exec: (workflow, context, miner) => {
    miner.say('⏩🏡');
    const spawnerId = getKeyFromEntityMemory(miner, 'spawnerId');
    const spawn = getObjectById(spawnerId);

    if (miner.transfer(spawn, resourceEnergy()) === statusErrNotInRange()) {
      miner.moveTo(spawn);
      return { nextStepName: 'moveToSpawn' };
    }

    return { nextStepName: 'unload' };
  },
});

const unload = createWorkflowStep({
  name: 'unload',
  exec: (workflow, context, miner) => {
    miner.say('⚡️');
    const spawnerId = getKeyFromEntityMemory(miner, 'spawnerId');
    const spawn = getObjectById(spawnerId);

    miner.transfer(spawn, resourceEnergy());

    const storage = getEntityEnergyStorageLevels(miner);

    if (storage > 0) return { nextStepName: 'unload' };

    return { nextStepName: 'hasTargetSource' };
  },
});

const steps = [
  hasTargetSource,
  findSource,
  moveToSource,
  mine,
  moveToSpawn,
  unload,
];

const workflow = createWorkflow({
  name: 'miner v0',
  startingStep: hasTargetSource,
  steps,
});

module.exports = workflow;
