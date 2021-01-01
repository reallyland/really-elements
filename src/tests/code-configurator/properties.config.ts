import type { PropertyValue } from '../../code-configurator/code-configurator.js';

const properties: PropertyValue[] = [
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

const cssProperties: PropertyValue[] = [
  {
    name: '--test-property-width',
    value: '2px',
  },
  {
    name: '--test-dummy-property',
    value: '',
  },
  {
    name: '--test-property-height',
    value: '2px',
  },
  {
    name: '--test-property-color',
    value: 'green',
  },
  {
    name: '--test-property-background-color',
    value: 'red',
  },
];

export { properties, cssProperties };
