'use strict'

export default [
  {
    label: 'Population size (<var>N</var>)',
    name: 'popsize',
    min: 100,
    max: 10000,
    step: 100,
    value: 1000
  },
  {
    label: 'Selection coefficient (<var>s<var>)',
    name: 'selection',
    min: -0.025,
    max: 0.025,
    step: 0.001,
    value: 0.0
  },
  {
    label: 'Initial frequency (<var>q<sub>0</sub></var>)',
    name: 'frequency',
    min: 0.0,
    max: 1.0,
    step: 0.01,
    value: 0.1
  },
  {
    label: 'Observation period',
    name: 'observation',
    min: 500,
    max: 40000,
    step: 500,
    value: 1000
  },
  {
    label: 'Number of replicates',
    name: 'replicates',
    min: 10,
    max: 50,
    step: 10,
    value: 20
  }
]
