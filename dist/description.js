"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsExecutorNodeProperties = void 0;
exports.jsExecutorNodeProperties = [
    {
        displayName: 'JavaScript Code',
        name: 'jsCode',
        type: 'string',
        typeOptions: {
            rows: 5,
        },
        default: '',
        placeholder: 'e.g., const _ = require("lodash"); console.log(_.random(1, 10));',
        description: 'The JavaScript code to execute using the installed npm package(s)',
    },
];
//# sourceMappingURL=description.js.map