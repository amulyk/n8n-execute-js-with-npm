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
        let jsCode = this.getNodeParameter('jsCode', i) as string;

        // Створення контекстного об'єкта з вхідними даними
        const context = {
          $json: items[i].json, // Доступ до json вхідних даних
        };

        // Передаємо JavaScript-код і контекст на сервер через POST запит
        const response = await axios.post(serverUrl, {
          code: jsCode,
          context: context, // Передаємо контекст як частину даних запиту
        });

        // Результат, який повертає сервер
        let resource = response.data;
        let parsedResource;

        // Перевіряємо, чи результат є рядком, який потрібно парсити
        if (typeof resource === 'string') {
          try {
            parsedResource = JSON.parse(resource);
          } catch (parseError) {
            if (parseError instanceof Error) {
              throw new NodeOperationError(this.getNode(), `Failed to parse result as JSON: ${parseError.message}`);
            } else {
              throw new NodeOperationError(this.getNode(), 'Failed to parse result as JSON: An unknown error occurred.');
            }
          }
        }

        // Додаємо результат до масиву для повернення
        returnData.push({
          json: parsedResource.result,
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
