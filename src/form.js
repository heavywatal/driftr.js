'use strict';
import * as d3 from "d3";

export default function(params) {
    d3.select('main').append('form');

    let input_items = d3.select('form')
        .selectAll('dl')
        .data(params)
        .enter()
        .append('dl')
        .attr('id', function(d){return d.name;})
        .attr('class', 'parameter');

    input_items.append('label')
        .attr('class', 'value')
        .attr('for', function(d){return d.name;})
        .text(function(d){return d.value;});

    input_items.append('dt')
        .append('label')
        .attr('class', 'name')
        .attr('for', function(d){return d.name;})
        .html(function(d){return d.label;});

    let input_ranges = input_items.append('dd')
        .attr('class', 'param_range');
    input_ranges.append('input')
        .attr('type', 'range')
        .attr('name',  function(d){return d.name;})
        .attr('min',   function(d){return d.min;})
        .attr('max',   function(d){return d.max;})
        .attr('step',  function(d){return d.step;})
        .attr('value', function(d){return d.value;})
        .on('input', function(d){
            d3.select('#'+this.name+' label.value')
              .text(this.value);
            d.value = this.value;
        });
    input_ranges.append('label')
        .attr('class', 'min')
        .attr('for', function(d){return d.name;})
        .text(function(d){return d.min;});
    input_ranges.append('label')
        .attr('class', 'max')
        .attr('for', function(d){return d.name;})
        .text(function(d){return d.max;});

    let input_model = d3.select('form')
        .append('dl').attr('class', 'parameter');
    input_model.append('dt').append('label')
        .attr('class', 'name')
        .text('Model');
    input_model.append('dd')
        .each(function() {
            d3.select(this).append('input')
                .attr('type', 'radio')
                .attr('name', 'model')
                .attr('value', 'wf')
                .attr('id', 'wf')
                .property('checked', true);
            d3.select(this).append('label')
                .attr('for', 'wf')
                .attr('class', 'radio')
                .text('Wright-Fisher');
            d3.select(this).append('br');
            d3.select(this).append('input')
                .attr('type', 'radio')
                .attr('name', 'model')
                .attr('value', 'moran')
                .attr('id', 'moran');
            d3.select(this).append('label')
                .attr('for', 'moran')
                .attr('class', 'radio')
                .text('Moran');
        });

    d3.select('form').append('button')
        .attr('type', 'button')
        .attr('class', 'start button')
        .text('START!');
}
