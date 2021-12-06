'use strict'
import * as d3 from 'd3'
import * as genetics from './genetics.js'
import params from './parameters.js'
import createForm from './form.js';

(function () {
  createForm(params)

  const svgPadding = {
    top: 20,
    right: 30,
    bottom: 60,
    left: 80
  }

  d3.select('main').append('div').attr('class', 'plot')
  const svg = d3.select('.plot').append('svg')

  const fixationDivs = d3.select('.plot')
    .append('div')
    .attr('class', 'fixation')
    .selectAll('label')
    .data(['fixed', 'polymorphic', 'lost'])
    .enter()
    .append('div')
    .attr('id', function (d) { return d })
  fixationDivs.append('label')
    .attr('class', function () { return 'name' })
    .text(function (d) { return d })
  fixationDivs.append('label')
    .attr('class', function () { return 'value' })

  const panelHeight = parseInt(svg.style('height')) - svgPadding.top - svgPadding.bottom
  const plot = svg.append('g')
    .attr('class', 'plot')
    .attr('transform',
      'translate(' + svgPadding.left + ',' + svgPadding.top + ')')
  plot.append('rect')
    .attr('class', 'panel_background')
    .attr('height', panelHeight)
  plot.append('g')
    .attr('class', 'panel')

  const scaleX = d3.scaleLinear()
    .domain([0, params[3].value])
  const scaleY = d3.scaleLinear()
    .domain([0, 1])
    .range([panelHeight, 0])
  const axisX = d3.axisBottom(scaleX)
  const axisY = d3.axisLeft(scaleY)

  plot.append('g')
    .attr('class', 'axis x')
    .attr('transform',
      'translate(0,' + panelHeight + ')')
    .call(axisX)
  plot.append('g')
    .attr('class', 'axis y')
    .call(axisY)
  plot.append('text')
    .attr('class', 'title x')
    .attr('text-anchor', 'middle')
    .text('Time (generations)')
  plot.append('text')
    .attr('class', 'title y')
    .attr('text-anchor', 'middle')
    .text('Derived Allele Frequency (q)')
    .attr('transform', 'translate(-50,' + panelHeight / 2 + ') rotate(-90)')
  const line = d3.line()
    .x(function (d) { return scaleX(d[0]) })
    .y(function (d) { return scaleY(d[1]) })

  function updateWidth () {
    const plotWidth = parseInt(d3.select('.plot').style('width'))
    svg.attr('width', plotWidth - parseInt(svg.style('padding-right')))
    const svgWidth = parseInt(svg.attr('width'))
    const panelWidth = svgWidth - svgPadding.left - svgPadding.right
    svg.select('.panel_background').attr('width', panelWidth)
    scaleX.range([0, panelWidth])
    axisX.scale(scaleX)
    svg.select('.x').call(axisX)
    svg.select('.title.x')
      .attr('transform',
        'translate(' + (panelWidth / 2) + ',' + (panelHeight + 50) + ')')
    svg.selectAll('.panel path').remove()
    for (let i = 0; i < results.length; ++i) {
      svg.select('.panel').append('path').attr('d', line(results[i]))
    }
  }

  function animation (trajectory, replDelay) {
    function len () { return this.getTotalLength() }
    svg.select('.panel').append('path')
      .attr('d', line(trajectory))
      .attr('stroke-dasharray', len)
      .attr('stroke-dashoffset', len)
      .transition()
      .delay(replDelay)
      .duration(2000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)
    const qT = trajectory.slice(-1)[0][1]
    if (qT === 1) {
      fixationIncrement('#fixed')
    } else if (qT === 0) {
      fixationIncrement('#lost')
    } else {
      fixationIncrement('#polymorphic')
    }
  }

  function fixationIncrement (id) {
    const label = d3.select(id + ' label.value')
    label.text(parseInt(label.text()) + 1)
  }

  let results = []

  function start () {
    results = []
    svg.select('.panel').selectAll('path').remove()
    d3.selectAll('.fixation label.value').text(0)
    const N = parseInt(params[0].value)
    const s = parseFloat(params[1].value)
    const q0 = parseFloat(params[2].value)
    const T = parseInt(params[3].value)
    const rep = parseInt(params[4].value)
    const model = d3.select('input[name="model"]:checked').node().value
    svg.select('.axis.x').call(axisX.scale(scaleX.domain([0, T])))
    for (let i = 0; i < rep; ++i) {
      const trajectory = genetics[model](N, s, q0, T)
      const replDelay = T / 100 + 600 * i / rep
      animation(trajectory, replDelay)
      results.push(trajectory)
    }
  }

  const footer = d3.select('footer')
  const downloadJson = footer.append('a')
    .attr('class', 'button')
    .attr('download', 'driftr_result.json')
    .text('Save results')
  downloadJson.on('click', function () {
    const json = JSON.stringify(results)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    downloadJson.attr('href', url)
  })
  footer.append('a')
    .attr('class', 'button')
    .attr('href', 'https://github.com/heavywatal/driftr.js/releases/latest')
    .text('Download driftr.js')
  footer.append('a')
    .attr('class', 'button')
    .attr('href', 'https://github.com/heavywatal/driftr.js/issues')
    .text('Send feedback')

  updateWidth()
  d3.select(window).on('resize', updateWidth)
  d3.select('.start').on('click', start)
})()
