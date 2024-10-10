"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsExecutorNodeProperties = void 0;
exports.jsExecutorNodeProperties = [
    {
        displayName: 'Server URL',
        name: 'serverUrl',
        type: 'string',
        default: '',
        placeholder: 'e.g., http://n8n-js-vm:3000',
        description: 'The URL of the server where the JavaScript code will be executed',
    },
    {
        displayName: 'JavaScript Code',
        name: 'jsCode',
        type: 'string',
        typeOptions: {
            rows: 50,
            editor: 'jsEditor'
        },
        default: '',
        placeholder: 'e.g., const _ = require("lodash"); const inputData = input.data; const result = _.random(1, 10); saveOutput(result);',
        description: 'The JavaScript code to execute using the installed npm package(s). Variable input contains the input data from previous step. Function saveOutput(data) can be used to save data for next step.',
    },
];
//# sourceMappingURL=description.js.map