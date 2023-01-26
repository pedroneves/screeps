//@ts-check
const { createLightMinerFactory } = require('./role.miner');
const { createWorkflowStep, createWorkflow } = require('./utils.workflow');
const {
  getAmountOfMiners,
  getMinerBySerial,
  getEntityEnergyStorageLevels,
} = require('./utils.screeps');

/**
 * @typedef {import('./types').WorkflowStepExecutionResult} WorkflowStepExecutionResult
 */

const MAX_AMOUNT_MINERS = 5;

const checkMinerAmmount = createWorkflowStep({
  name: 'checkMinerAmmount',
  exec: (workflow, context, spawn) => {
    if (getAmountOfMiners() < MAX_AMOUNT_MINERS) {
      return { nextStepName: 'spawnLightMiner' };
    }
    return { nextStepName: 'checkSoldierAmount' };
  },
});

const spawnLightMiner = createWorkflowStep({
  name: 'spawnLightMiner',
  exec: (workflow, context, spawn) => {
    const factory = createLightMinerFactory({ spawn });

    const energy = getEntityEnergyStorageLevels(spawn);
    if (energy < factory.energyCost)
      return {
        nextStepName: 'checkMinerAmmount',
      };

    const { serial } = factory();
    return {
      nextStepName: 'checkLightMinerSpawned',
      dataUpdates: { spawningMinerWithSerial: serial },
    };
  },
});

const checkLightMinerSpawned = createWorkflowStep({
  name: 'checkLightMinerSpawned',
  exec: (workflow, context, spawn) => {
    const miner = getMinerBySerial(
      spawn.memory.state.data.spawningMinerWithSerial
    );
    if (miner.spawning) return { nextStepName: 'checkLightMinerSpawned' };
    return { nextStepName: 'checkMinerAmmount' };
  },
});

const steps = [checkMinerAmmount, spawnLightMiner, checkLightMinerSpawned];

const workflow = createWorkflow({
  name: 'spawn v0',
  startingStep: checkMinerAmmount,
  steps,
});

module.exports = workflow;
