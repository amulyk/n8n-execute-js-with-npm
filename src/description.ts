import {
  INodeProperties,
} from 'n8n-workflow';

export const jsExecutorNodeProperties: INodeProperties[] = [
  {
    displayName: 'Server URL',
    name: 'serverUrl',
    type: 'string',
    default: '',
    placeholder: 'e.g., http://127.0.0.1:3000',
    description: 'The URL of the server where the JavaScript code will be executed',
  },
  {
    displayName: 'JavaScript Code',
    name: 'jsCode',
    type: 'string',
    typeOptions: {
      rows: 10,
      editor: 'jsEditor'
    },
    default: '',
    placeholder: 'e.g., const _ = require("lodash"); console.log(_.random(1, 10));',
    description: 'The JavaScript code to execute using the installed npm package(s)',
  },
];
