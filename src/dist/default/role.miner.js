//@ts-check

/**
 * @typedef {import('./types').WorkflowContext} WorkflowContext
 */

// Declare variables so the JS Doc stop complaining
/** @global */

const { randomInteger } = require('./utils.fns');
const {
  createWorkflowContext,
  iterateWorkflow,
  updateContext,
} = require('./utils.workflow');
const { TYPES } = require('./role.miner.constants');
const workflow = require('./role.miner.workflow.v0');
const { partWork, partCarry, partMove } = require('./utils.screeps');

/**
 *
 * @param {object} options
 * @param {string} options.name
 * @returns
 */
const createLightMinerFactory = () => {
  return ({ name = `Miner ${randomInteger()}`, spawn }) => {
    spawn.spawnCreep([partWork(), partCarry(), partMove()], name, {
      memory: { role: 'miner', type: TYPES.LIGHT, spawnerId: spawn.id },
    });
  };
};

const lightMinerStateFactory = () => {
  return createWorkflowContext({ initialStepName: workflow.startingStep.name });
};

const createMinerState = (type) => {
  const typeFactory = {
    [TYPES.LIGHT]: lightMinerStateFactory,
  }[type];

  if (!typeFactory)
    throw new Error(
      `Unknown type "${type}" while instantiating the miner state`
    );

  return typeFactory();
};

const run = (miner) => {
  const { memory, spawning } = miner;

  const initMemory = () => {
    const { type, state } = memory;
    // Only creates the state, if not there yet
    if (!state) miner.memory.state = createMinerState(type);
  };

  // =====================================================================================

  // Do nothing if spawning
  initMemory();

  if (spawning) return;
  const { state } = memory;

  const context = /** @type {WorkflowContext} */ (state);
  const iteration = iterateWorkflow({ workflow, context, entity: miner });
  miner.memory.state = updateContext(context, {
    nextStepName: iteration.result.nextStepName,
    dataPatch: iteration.result.dataUpdates,
  });
};

module.exports = {
  createLightMinerFactory,
  run,
};
