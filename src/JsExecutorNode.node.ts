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
    inputs: ['main'],
    outputs: ['main'],
    properties: jsExecutorNodeProperties,
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData(); // Отримуємо всі вхідні дані
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        // Отримуємо параметри з кожного елемента
        const serverUrl = `${this.getNodeParameter('serverUrl', i) as string}/execute-js`;
        const jsCode = this.getNodeParameter('jsCode', i) as string;

        // Виконуємо запит на сервер
        const response = await axios.post(serverUrl, { code: jsCode });
        const result = response.data;

        // Додаємо результат до масиву для повернення
        returnData.push({
          json: {
            serverUrl,
            result,
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          throw new NodeOperationError(this.getNode(), `Error executing code for item ${i}: ${error.message}`);
        } else {
          throw new NodeOperationError(this.getNode(), `Error executing code for item ${i}: An unknown error occurred.`);
        }
      }
    }

    return [returnData];
  }
}
