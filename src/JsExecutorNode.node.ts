import {
  INodeExecutionData,
  NodeOperationError,
  IExecuteFunctions,
} from 'n8n-workflow';

import ivm from 'isolated-vm';
import { jsExecutorNodeProperties } from './description';
import * as _ from 'lodash';

export class JsExecutorNode {
  description = {
    displayName: 'Execute JS with NPM',
    name: 'executeJsWithNpm',
    group: ['transform'],
    version: 1,
    description: 'Execute JavaScript code using lodash',
    defaults: {
      name: 'Execute JS with NPM',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: jsExecutorNodeProperties,
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const jsCode = this.getNodeParameter('jsCode', 0) as string;

    try {
      // Виконання коду з використанням Isolated VM
      const isolate = new ivm.Isolate({ memoryLimit: 128 }); // memoryLimit in MB
      const context = await isolate.createContext();
      const jail = context.global;
      await jail.set('global', jail.derefInto());

      // Додавання lodash в ізольоване середовище
      await jail.set('_', _);

      // Додавання користувацького коду в ізольоване середовище
      const script = await isolate.compileScript(jsCode);
      const result = await script.run(context);

      // Повернення результату у форматі вкладеного масиву
      return [this.helpers.returnJsonArray({ result })];
    } catch (error) {
      if (error instanceof Error) {
        throw new NodeOperationError(this.getNode(), `Error executing code: ${error.message}`);
      } else {
        throw new NodeOperationError(this.getNode(), 'Error executing code: An unknown error occurred.');
      }
    }
  }
}
