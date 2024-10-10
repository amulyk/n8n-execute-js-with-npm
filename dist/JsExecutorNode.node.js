"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsExecutorNode = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const description_1 = require("./description");
const axios_1 = __importDefault(require("axios"));
class JsExecutorNode {
    constructor() {
        this.description = {
            displayName: 'JavaScript',
            name: 'executeJsWithNpm',
            group: ['transform'],
            icon: 'file:icon.svg',
            version: 1,
            description: 'Execute JavaScript code with NPM packages',
            defaults: {
                name: 'JavaScript',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: description_1.jsExecutorNodeProperties,
        };
    }
    async execute() {
        const items = this.getInputData(); // Отримуємо всі вхідні дані
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                // Отримуємо параметри з кожного елемента
                const serverUrl = `${this.getNodeParameter('serverUrl', i)}/execute-js`;
                let jsCode = this.getNodeParameter('jsCode', i);
                // Створення контекстного об'єкта з вхідними даними
                const context = {
                    $json: items[i].json, // Доступ до json вхідних даних
                };
                // Передаємо JavaScript-код і контекст на сервер через POST запит
                const response = await axios_1.default.post(serverUrl, {
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
                    }
                    catch (parseError) {
                        if (parseError instanceof Error) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Failed to parse result as JSON: ${parseError.message}`);
                        }
                        else {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Failed to parse result as JSON: An unknown error occurred.');
                        }
                    }
                }
                else if (typeof resource === 'object') {
                    if (resource.result === undefined) {
                        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'The response from the server is missing the "result" property.');
                    }
                    else {
                        parsedResource = resource.result;
                    }
                }
                // Додаємо результат до масиву для повернення
                returnData.push({
                    json: parsedResource,
                });
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error executing code for item ${i}: ${error.message}`);
                }
                else {
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error executing code for item ${i}: An unknown error occurred.`);
                }
            }
        }
        return [returnData];
    }
}
exports.JsExecutorNode = JsExecutorNode;
//# sourceMappingURL=JsExecutorNode.node.js.map