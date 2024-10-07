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
                const jsCode = this.getNodeParameter('jsCode', i);
                // Виконуємо запит на сервер
                const response = await axios_1.default.post(serverUrl, { code: jsCode });
                const result = response.data;
                // Додаємо результат до масиву для повернення
                returnData.push({
                    json: {
                        serverUrl,
                        result,
                    },
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