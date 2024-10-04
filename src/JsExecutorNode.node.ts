import {
  INodeExecutionData,
  NodeOperationError,
  IExecuteFunctions,
} from 'n8n-workflow';

import { execSync } from 'child_process';
import * as ivm from 'isolated-vm';
import { jsExecutorNodeProperties } from './description';
import * as fs from 'fs';
import * as path from 'path';

export class JsExecutorNode {
  description = {
    displayName: 'Execute JS with NPM',
    name: 'executeJsWithNpm',
    group: ['transform'],
    version: 1,
    description: 'Execute JavaScript code using npm packages',
    defaults: {
      name: 'Execute JS with NPM',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: jsExecutorNodeProperties,
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const npmPackage = this.getNodeParameter('npmPackage', 0) as string;
    const jsCode = this.getNodeParameter('jsCode', 0) as string;

    if (!npmPackage) {
      throw new NodeOperationError(this.getNode(), 'Please provide an npm package name.');
    }

    try {
      // Створення тимчасової директорії для встановлення npm пакетів
      const tempDir = path.join('/tmp', `npm_temp_${Date.now()}`);
      fs.mkdirSync(tempDir, { recursive: true });

      // Встановлення npm пакету в тимчасову директорію
      execSync(`npm install ${npmPackage}`, {
        cwd: tempDir,
        stdio: 'inherit',
      });

      // Виконання коду з використанням Isolated VM
      const isolate = new ivm.Isolate({ memoryLimit: 128 }); // memoryLimit in MB
      const context = await isolate.createContext();
      const jail = context.global;
      await jail.set('global', jail.derefInto());

      // Додавання функції require в ізольоване середовище
      const script = await isolate.compileScript(`
        global.require = (requestedModule) => {
          if (requestedModule === npmPackage) {
            return require(requestedModule);
          } else {
            throw new Error('Only the specified npm package is allowed.');
          }
        };
        ${jsCode}
      `);

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
