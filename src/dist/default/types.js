/**
 * @typedef {object} Workflow
 * @property {boolean} isWorkflow
 * @property {number} id
 * @property {string} name
 * @property {WorkflowStep} startingStep
 * @property {WorkflowStep[]} steps
 * @property {Record<string, WorkflowStep>} stepIndexByName
 *
 * @typedef {object} WorkflowStep
 * @property {boolean} isWorkflowStep
 * @property {string} name
 * @property {(Workflow, WorkflowContext, any) => WorkflowStepExecutionResult} exec
 *
 * @typedef {object} WorkflowContext
 * @property {boolean} isWorkflowContext
 * @property {string} currentStepName
 * @property {Record<string, any>} data
 *
 * @typedef {object} WorkflowStepExecutionResult
 * @property {string} nextStepName
 * @property {Record<string, any>} [dataUpdates]
 *
 * @typedef {object} WorkflowStepExecutionData
 * @property {WorkflowStepExecutionResult} result
 * @property {number} duration
 */

module.exports = {};
