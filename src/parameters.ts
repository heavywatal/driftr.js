'use strict'

export default [
  {
    label: 'Population size (<var>N</var>)',
    name: 'popsize',
    min: 10,
    max: 10000,
    step: 10,
    value: 1000
  },
  {
    label: 'Selection coefficient (<var>s<var>)',
    name: 'selection',
    min: -0.03,
    max: 0.03,
    step: 0.001,
    value: 0.0
  },
  {
    label: 'Initial frequency (<var>Nq<sub>0</sub></var>)',
    name: 'frequency',
    min: 1,
    max: 1000,
    step: 1,
    value: 100
  },
  {
    label: 'Observation period',
    name: 'observation',
    min: 100,
    max: 40000,
    step: 100,
    value: 1000
  },
  {
    label: 'Number of replicates',
    name: 'replicates',
    min: 1,
    max: 100,
    step: 1,
    value: 10
  }
]
