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
const child_process_1 = require("child_process");
const ivm = __importStar(require("isolated-vm"));
const description_1 = require("./description");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class JsExecutorNode {
    constructor() {
        this.description = {
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
            properties: description_1.jsExecutorNodeProperties,
        };
    }
    async execute() {
        const npmPackage = this.getNodeParameter('npmPackage', 0);
        const jsCode = this.getNodeParameter('jsCode', 0);
        if (!npmPackage) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Please provide an npm package name.');
        }
        try {
            // Створення тимчасової директорії для встановлення npm пакетів
            const tempDir = path.join('/tmp', `npm_temp_${Date.now()}`);
            fs.mkdirSync(tempDir, { recursive: true });
            // Встановлення npm пакету в тимчасову директорію
            (0, child_process_1.execSync)(`npm install ${npmPackage}`, {
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