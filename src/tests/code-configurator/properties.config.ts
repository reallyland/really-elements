import type { PropertyValue } from '../../code-configurator/types.js';

export const cssProperties: PropertyValue[] = [
  {
    name: '--test-element-width',
    value: '2px',
  },
  {
    name: '--test-dummy-element',
    value: '',
  },
  {
    name: '--test-element-height',
    value: '2px',
  },
  {
    name: '--test-element-color',
    value: 'green',
  },
  {
    name: '--test-element-background-color',
    value: 'red',
  },
];

export const properties: PropertyValue[] = [
  {
    name: 'propertyString',
    value: 'property',
    type: 'string',
  },
  {
    name: 'propertyStringEmpty',
    value: '',
    type: 'string',
  },
  {
    name: 'propertyNumber',
    value: 0,
    type: 'number',
  },
  {
    name: 'propertyBoolean',
    value: true,
    type: 'boolean',
  },
  {
    name: 'propertyBooleanFalse',
    value: false,
    type: 'boolean',
  },
  {
    name: 'propertyWithSelectableOptions',
    value: 'option-1',
    type: 'string',
    options: [
      {
        label: 'option-1',
        value: 'option-1',
      },
      {
        label: 'option-2',
        value: 'option-2',
      },
      {
        label: 'option-3',
        value: 'option-3',
      },
    ],
  },
];
