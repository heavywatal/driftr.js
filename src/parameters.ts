const urlsearch = new URLSearchParams(window.location.search);

export default [
  {
    label: "Population size (<var>N</var>)",
    name: "popsize",
    symbol: "n",
    min: 10,
    max: 10000,
    step: 10,
    value: Number(urlsearch.get("n")) || 1000,
  },
  {
    label: "Selection coefficient (<var>s<var>)",
    name: "selection",
    symbol: "s",
    min: -0.03,
    max: 0.03,
    step: 0.001,
    value: Number(urlsearch.get("s")) || 0.0,
  },
  {
    label: "Initial frequency (<var>Nq<sub>0</sub></var>)",
    name: "frequency",
    symbol: "nq0",
    min: 1,
    max: Number(urlsearch.get("n")) || 1000,
    step: 1,
    value: Number(urlsearch.get("nq0")) || 100,
  },
  {
    label: "Observation period",
    name: "observation",
    symbol: "t",
    min: 100,
    max: 40000,
    step: 100,
    value: Number(urlsearch.get("t")) || 1000,
  },
  {
    label: "Number of replicates",
    name: "replicates",
    symbol: "rep",
    min: 1,
    max: 100,
    step: 1,
    value: Number(urlsearch.get("rep")) || 10,
  },
];
