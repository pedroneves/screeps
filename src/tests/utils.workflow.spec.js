//@ts-check
const {
  createWorkflow,
  createWorkflowStep,
  createWorkflowContext,
  iterateWorkflow,
} = require('../dist/default/utils.workflow');

describe('Workflows', () => {
  test('create workflow', () => {
    const name = 'workflow name';
    const startingStep = createWorkflowStep({
      name: 'initial step',
      exec: () => ({ nextStepName: 'some step' }),
    });
    const steps = [startingStep];
    const workflow = createWorkflow({
      name,
      startingStep,
      steps,
    });

    expect(workflow).toEqual({
      isWorkflow: true,
      id: expect.any(Number),
      name,
      startingStep,
      steps,
      stepIndexByName: {
        [startingStep.name]: startingStep,
      },
    });
  });

  test('create workflow step', () => {
    const name = 'test step';
    const nextStepName = 'next test step';
    const exec = () => ({ nextStepName });

    const step = createWorkflowStep({
      name,
      exec,
    });

    expect(step).toEqual({
      isWorkflowStep: true,
      name,
      exec,
    });
    expect(step.exec({}, {}, {})).toEqual({ nextStepName });
  });

  test('create workflow context', () => {
    const initialStepName = 'initial step name';

    const context = createWorkflowContext({
      initialStepName,
    });

    expect(context).toEqual({
      isWorkflowContext: true,
      currentStepName: initialStepName,
      data: {},
    });
  });

  describe('Iterating over workflows', () => {
    test('execute current step', () => {
      const step1ExecBody = jest.fn();
      const step2ExecBody = jest.fn();
      const step1 = createWorkflowStep({
        name: 'step 1',
        exec: () => {
          step1ExecBody();
          return { nextStepName: 'step 2' };
        },
      });
      const step2 = createWorkflowStep({
        name: 'step 2',
        exec: () => {
          step2ExecBody();
          return { nextStepName: 'step 3' };
        },
      });
      const workflow = createWorkflow({
        name: 'test workflow',
        startingStep: step1,
        steps: [step1, step2],
      });
      const context = createWorkflowContext({
        initialStepName: workflow.startingStep.name,
      });

      expect(step1ExecBody).not.toHaveBeenCalled();
      expect(step2ExecBody).not.toHaveBeenCalled();
      expect(context).toEqual(
        expect.objectContaining({
          currentStepName: step1.name,
        })
      );

      const iteration = iterateWorkflow({ context, workflow, entity: {} });

      expect(step1ExecBody).toHaveBeenCalled();
      expect(step2ExecBody).not.toHaveBeenCalled();
      expect(context).toEqual(
        expect.objectContaining({
          currentStepName: step1.name,
        })
      );
      expect(iteration).toEqual({
        result: {
          nextStepName: step2.name,
        },
        duration: expect.any(Number),
      });
    });
  });
});
