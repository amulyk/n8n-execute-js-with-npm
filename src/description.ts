import {
  INodeProperties,
} from 'n8n-workflow';

export const jsExecutorNodeProperties: INodeProperties[] = [
  {
    displayName: 'npm Package Name',
    name: 'npmPackage',
    type: 'string',
    default: '',
    placeholder: 'e.g., lodash',
    description: 'The name of the npm package to install dynamically.',
  },
  {
    displayName: 'JavaScript Code',
    name: 'jsCode',
    type: 'string',
    typeOptions: {
      rows: 5,
    },
    default: '',
    placeholder: 'e.g., const _ = require("lodash"); console.log(_.random(1, 10));',
    description: 'The JavaScript code to execute using the installed npm package',
  },
];
