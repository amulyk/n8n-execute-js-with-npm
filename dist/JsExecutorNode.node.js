"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsExecutorNode = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const ivm = __importStar(require("isolated-vm"));
const description_1 = require("./description");
const _ = __importStar(require("lodash"));
class JsExecutorNode {
    constructor() {
        this.description = {
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
            properties: description_1.jsExecutorNodeProperties,
        };
    }
    async execute() {
        const jsCode = this.getNodeParameter('jsCode', 0);
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