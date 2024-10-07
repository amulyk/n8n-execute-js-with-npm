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
            inputs: ['main', 'main'],
            outputs: ['main'],
            properties: description_1.jsExecutorNodeProperties,
        };
    }
    async execute() {
        const serverUrl = `${this.getNodeParameter('serverUrl', 0)}/execute-js`;
        const jsCode = this.getNodeParameter('jsCode', 1);
        try {
            // Відправка коду на сервер за допомогою POST-запиту
            const response = await axios_1.default.post(serverUrl, { code: jsCode });
            const result = response.data;
            // Повернення результату у форматі вкладеного масиву
            return [this.helpers.returnJsonArray({ serverUrl, result })];
        }
        catch (error) {
            if (error instanceof Error) {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Error executing code: ${error.message}`);
            }
            else {
                throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Error executing code: An unknown error occurred.');
            }
        }
    }
}
exports.JsExecutorNode = JsExecutorNode;
//# sourceMappingURL=JsExecutorNode.node.js.map