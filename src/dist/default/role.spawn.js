//@ts-check

/**
 * @typedef {import('./types').WorkflowContext} WorkflowContext
 */

const {
  createWorkflowContext,
  iterateWorkflow,
  updateContext,
} = require('./utils.workflow');
const workflow = require('./role.spawn.workflow.v0');

const createSpawnState = () =>
  createWorkflowContext({ initialStepName: workflow.startingStep.name });

const run = (spawn) => {
  const { memory } = spawn;

  const initMemory = () => {
    const { state } = memory;
    // Only creates the state, if not there yet
    if (!state) spawn.memory.state = createSpawnState();
  };

  // -------------------------------------------------------

  initMemory();

  if (memory.state) {
    const context = /** @type {WorkflowContext} */ (memory.state);
    const iteration = iterateWorkflow({ workflow, context, entity: spawn });
    spawn.memory.state = updateContext(context, {
      nextStepName: iteration.result.nextStepName,
      dataPatch: iteration.result.dataUpdates,
    });
  }
};

module.exports = { run };
