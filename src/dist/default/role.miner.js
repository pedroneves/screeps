//@ts-check

/**
 * @typedef {import('./types').WorkflowContext} WorkflowContext
 */

const { randomInteger } = require('./utils.fns');
const {
  createWorkflowContext,
  iterateWorkflow,
  updateContext,
} = require('./utils.workflow');
const { TYPES } = require('./role.miner.constants');
const workflow = require('./role.miner.workflow.v0');
const {
  partWork,
  partCarry,
  partMove,
  statusOK,
  statusValueToCode,
} = require('./utils.screeps');

/**
 * Creates a factory function for light miners
 * @param {object} options
 * @param {object} options.spawn The spawn from which the miners are being created
 */
const createLightMinerFactory = ({ spawn }) => {
  /**
   * @param {object} options
   * @param {string} [options.name]
   */
  const factory = ({ name } = {}) => {
    const serial = randomInteger();
    const actualName = name ? name : `Miner ${serial}`;
    const result = spawn.spawnCreep(
      [partWork(), partCarry(), partMove()],
      actualName,
      {
        memory: {
          serial,
          role: 'miner',
          type: TYPES.LIGHT,
          spawnerId: spawn.id,
        },
      }
    );

    if (result === statusOK()) return { serial };

    const erroCode = statusValueToCode(result);
    throw new Error(
      `Failed to spawn creep on Spawn "${spawn.name}" due to error: ${erroCode}`
    );
  };

  factory.energyCost = 200;

  return factory;
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
