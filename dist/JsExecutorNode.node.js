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
            version: 1,
            description: 'Execute JavaScript code using lodash',
            defaults: {
                name: 'Execute JS with NPM',
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
                    $json: items[i].json,
                    getInput: () => items[i].json,
                    saveOutput: (data) => {
                        try {
                            const jsonData = JSON.stringify(data);
                            console.log(jsonData);
                        }
                        catch (error) {
                            if (error instanceof Error) {
                                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Failed to convert data to JSON: ${error.message}`);
                            }
                        }
                    }
                };
                // Передаємо JavaScript-код і контекст на сервер через POST запит
                const response = await axios_1.default.post(serverUrl, {
                    code: jsCode,
                    context: context, // Передаємо контекст як частину даних запиту
                });
                // Результат, який повертає сервер
                let result = response.data;
                // Перевіряємо, чи результат є рядком, який потрібно парсити
                if (typeof result === 'string') {
                    try {
                        result = JSON.parse(result);
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
                // Додаємо результат до масиву для повернення
                returnData.push({
                    json: result,
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