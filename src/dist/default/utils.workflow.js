// @ts-check
const { randomInteger } = require('./utils.fns');
const { getObjectById } = require('./utils.screeps');

/**
 * @typedef {import('./types').Workflow} Workflow
 * @typedef {import('./types').WorkflowStep} WorkflowStep
 * @typedef {import('./types').WorkflowContext} WorkflowContext
 * @typedef {import('./types').WorkflowStepExecutionResult} WorkflowStepExecutionResult
 * @typedef {import('./types').WorkflowStepExecutionData} WorkflowStepExecutionData
 */

class WorkflowError extends Error {
  constructor({ message }) {
    super(message);
  }
}

class ParamIsIncorrectType extends WorkflowError {
  constructor({ paramName, typeName }) {
    super({
      message: `Param "${paramName}" must be a valid "${typeName}" type object`,
    });
  }
}

/**
 * Creates a new, empty Workflow object
 * @param {object} options
 * @param {string} [options.name]
 * @param {WorkflowStep} options.startingStep
 * @param {WorkflowStep[]} options.steps
 * @returns {Workflow}
 */
const createWorkflow = ({
  name = `Workflow #${randomInteger()}`,
  startingStep,
  steps = [],
}) => {
  if (!startingStep || !startingStep.isWorkflowStep)
    throw new ParamIsIncorrectType({
      paramName: 'startingStep',
      typeName: 'Workflow Step',
    });

  const validSteps = steps.filter((step) => step.isWorkflowStep);

  /** @type {Workflow['stepIndexByName']} */
  const stepIndexByName = {};

  validSteps.forEach((step, index) => {
    stepIndexByName[step.name] = step;
  });

  return {
    isWorkflow: true,
    id: randomInteger(),
    name,
    startingStep: startingStep,
    steps: validSteps,
    stepIndexByName,
  };
};

/**
 * Creates a Workflow Step object
 * @param {object} options
 * @param {string} options.name
 * @param {(Workflow, WorkflowContext) => WorkflowStepExecutionResult} options.exec
 * @returns {WorkflowStep}
 */
const createWorkflowStep = ({ name = `Step #${randomInteger()}`, exec }) => {
  if (!exec.call)
    throw new ParamIsIncorrectType({
      paramName: 'exec',
      typeName: 'function',
    });

  const step = {
    isWorkflowStep: true,
    name,
    exec,
  };

  return step;
};

/**
 * Returns an Workflow Step, from a given Workflow, by the provided Step ID
 * @param {object} options
 * @param {string} options.stepName
 * @param {Workflow} options.workflow
 * @returns {WorkflowStep}
 */
const getWorkflowStepByName = ({ stepName, workflow }) => {
  if (workflow.stepIndexByName[stepName] === undefined)
    throw new WorkflowError({
      message: `Workflow "${workflow.name}" does not have the Step "${stepName}"`,
    });

  return workflow.stepIndexByName[stepName];
};

/**
 * Creates a new, empty, Workflow Context object.
 * This object is used to hold context data about Workflow execution
 *
 * @param {object} options
 * @param {string} options.initialStepName
 * @returns {WorkflowContext}
 */
const createWorkflowContext = ({ initialStepName }) => {
  const context = {
    isWorkflowContext: true,
    currentStepName: initialStepName,
    data: {},
  };

  return context;
};

/**
 * Executes one step of a given Wokflow, provided it's context.
 * @param {object} options
 * @param {Workflow} options.workflow
 * @param {WorkflowContext} options.context
 * @param {*} options.entity
 * @returns {WorkflowStepExecutionData}
 */
const iterateWorkflow = ({ workflow, context, entity }) => {
  if (!workflow.isWorkflow)
    throw new ParamIsIncorrectType({
      paramName: 'workflow',
      typeName: 'Workflow',
    });

  if (!context.isWorkflowContext)
    throw new ParamIsIncorrectType({
      paramName: 'context',
      typeName: 'Workflow Context',
    });

  const step = getWorkflowStepByName({
    stepName: context.currentStepName,
    workflow,
  });

  const execTimeStart = Date.now();
  const result = step.exec(workflow, context, entity);
  const duration = Date.now() - execTimeStart;

  return { result, duration };
};

/**
 * Generates a new Workflow Context based on the one sent as parameter,
 * updating
 * @param {WorkflowContext} context Context object to be updated
 * @param {object} options Object with properties to update the context
 * @param {string} [options.nextStepName] Sets the context `currentStepName`
 * @param {Record<string, any>} [options.dataPatch] Properties to be included into the `context.data`.
 * @param {Record<string, any>} [options.dataOverride] Overrides the entire `context.data`, replacing the object
 * @returns {WorkflowContext}
 */
const updateContext = (
  context,
  { nextStepName, dataPatch, dataOverride } = {}
) => {
  const currentStepName = nextStepName ? nextStepName : context.currentStepName;
  const data = dataOverride ? dataOverride : { ...context.data, ...dataPatch };

  return {
    ...context,
    currentStepName,
    data,
  };
};

module.exports = {
  createWorkflow,
  createWorkflowStep,
  createWorkflowContext,
  iterateWorkflow,
  updateContext,
};
