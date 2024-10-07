import {
  INodeExecutionData,
  NodeOperationError,
  IExecuteFunctions,
} from 'n8n-workflow';
import { jsExecutorNodeProperties } from './description';
import axios from 'axios';

export class JsExecutorNode {
  description = {
    displayName: 'JavaScript',
    name: 'executeJsWithNpm',
    group: ['transform'],
    version: 1,
    description: 'Execute JavaScript code using lodash',
    defaults: {
      name: 'Execute JS with NPM',
    },
    inputs: ['main', 'main'],
    outputs: ['main'],
    properties: jsExecutorNodeProperties,
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const serverUrl = `${this.getNodeParameter('serverUrl', 0) as string}/execute-js`;
    const jsCode = this.getNodeParameter('jsCode', 1) as string;

    try {
      // Відправка коду на сервер за допомогою POST-запиту
      const response = await axios.post(serverUrl, { code: jsCode });
      const result = response.data;

      // Повернення результату у форматі вкладеного масиву
      return [this.helpers.returnJsonArray({ serverUrl, result })];
    } catch (error) {
      if (error instanceof Error) {
        throw new NodeOperationError(this.getNode(), `Error executing code: ${error.message}`);
      } else {
        throw new NodeOperationError(this.getNode(), 'Error executing code: An unknown error occurred.');
      }
    }
  }
}
