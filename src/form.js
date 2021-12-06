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
        .on('input', function(event, d){
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
            d3.select(this).append('input').attr('type', 'radio').attr('name', 'model')
                .attr('value', 'wright_fisher_haploid')
                .attr('id', 'wright_fisher_haploid')
                .property('checked', true);
            d3.select(this).append('label').attr('class', 'radio')
                .attr('for', 'wright_fisher_haploid')
                .text('Wright-Fisher haploid');
            d3.select(this).append('br');
            d3.select(this).append('input').attr('type', 'radio').attr('name', 'model')
                .attr('value', 'wright_fisher_diploid')
                .attr('id', 'wright_fisher_diploid');
            d3.select(this).append('label').attr('class', 'radio')
                .attr('for', 'wright_fisher_diploid')
                .text('Wright-Fisher diploid (h=0.5)');
            d3.select(this).append('br');
            d3.select(this).append('input').attr('type', 'radio').attr('name', 'model')
                .attr('value', 'heterozygote_advantage')
                .attr('id', 'heterozygote_advantage');
            d3.select(this).append('label').attr('class', 'radio')
                .attr('for', 'heterozygote_advantage')
                .text('Wright-Fisher heterozygote advantage');
            d3.select(this).append('br');
            d3.select(this).append('input').attr('type', 'radio').attr('name', 'model')
                .attr('value', 'moran_haploid')
                .attr('id', 'moran_haploid');
            d3.select(this).append('label').attr('class', 'radio')
                .attr('for', 'moran_haploid')
                .text('Moran haploid');
        });

    d3.select('form').append('button')
        .attr('type', 'button')
        .attr('class', 'start button')
        .text('START!');
}
