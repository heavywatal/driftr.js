'use strict';
import * as d3 from "d3";
import * as wtl_genetics from "./genetics.js";
import params from "./parameters.js";

(function() {

    d3.select('main').append('form');

    var input_items = d3.select('form')
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

    var input_ranges = input_items.append('dd')
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

    var model = d3.select('form')
        .append('dl').attr('class', 'parameter');
    model.append('dt').append('label')
        .attr('class', 'name')
        .text('Model');
    model.append('dd')
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

    var svg_padding = {
        top:    20,
        right:  20,
        bottom: 60,
        left:   80
    };

    d3.select('main').append('div').attr('class', 'plot');
    var svg = d3.select('.plot').append('svg');

    var fixation_divs = d3.select('.plot')
            .append('div')
            .attr('class', 'fixation')
            .selectAll('label')
            .data(['fixed', 'polymorphic', 'lost'])
            .enter()
            .append('div')
            .attr('id', function(d){return d;});
    fixation_divs.append('label')
            .attr('class', function(){return 'name';})
            .text(function(d){return d;});
    fixation_divs.append('label')
            .attr('class', function(){return 'value';});

    var panel_height = parseInt(svg.style('height')) - svg_padding.top - svg_padding.bottom;
    var plot = svg.append('g')
            .attr('class', 'plot')
            .attr('transform',
                  'translate('+svg_padding.left+','+svg_padding.top+')');
    plot.append('rect')
            .attr('class', 'panel_background')
            .attr('height', panel_height);
    plot.append('g')
            .attr('class', 'panel');

    var scale_x = d3.scaleLinear()
            .domain([0, params[3].value]);
    var scale_y = d3.scaleLinear()
            .domain([0, 1])
            .range([panel_height, 0]);
    var axis_x = d3.axisBottom(scale_x);
    var axis_y = d3.axisLeft(scale_y);

    plot.append('g')
            .attr('class', 'axis x')
            .attr('transform',
                  'translate(0,'+ panel_height +')')
            .call(axis_x);
    plot.append('g')
            .attr('class', 'axis y')
            .call(axis_y);
    plot.append('text')
            .attr('class', 'title x')
            .attr('text-anchor', 'middle')
            .text('Time (generations)');
    plot.append('text')
            .attr('class', 'title y')
            .attr('text-anchor', 'middle')
            .text('Derived Allele Frequency (q)')
            .attr('transform', 'translate(-50,'+ panel_height/2 +') rotate(-90)');
    var line = d3.line()
            .x(function(d) {return scale_x(d[0]);})
            .y(function(d) {return scale_y(d[1]);});

    function update_width() {
        var plot_width = parseInt(d3.select('.plot').style('width'));
        svg.attr('width', plot_width - parseInt(svg.style('padding-right')));
        var svg_width = parseInt(svg.attr('width'));
        var panel_width = svg_width - svg_padding.left - svg_padding.right;
        svg.select('.panel_background').attr('width', panel_width);
        scale_x.range([0, panel_width]);
        axis_x.scale(scale_x);
        svg.select('.x').call(axis_x);
        svg.select('.title.x')
           .attr('transform',
                 'translate('+ (panel_width / 2) +','+ (panel_height + 50) +')');
        svg.selectAll('.panel path').remove();
        for (var i=0; i<results.length; ++i) {
            svg.select('.panel').append('path').attr('d', line(results[i]));
        }
    }

    function animation(trajectory, repl_delay) {
        function len() {return this.getTotalLength()}
        svg.select('.panel').append('path')
            .attr('d', line(trajectory))
            .attr("stroke-dasharray", len)
            .attr("stroke-dashoffset", len)
            .transition()
            .delay(repl_delay)
            .duration(2000)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
        var qT = trajectory.slice(-1)[0][1];
        if (qT == 1) {
            fixation_increment('#fixed');
        } else if (qT === 0) {
            fixation_increment('#lost');
        } else {
            fixation_increment('#polymorphic');
        }
    }

    function fixation_increment(id) {
        var label = d3.select(id + ' label.value');
        label.text(parseInt(label.text()) + 1);
    }

    var results = [];

    function start() {
        results = [];
        svg.select('.panel').selectAll('path').remove();
        d3.selectAll('.fixation label.value').text(0);
        var N   = parseInt(params[0].value);
        var s   = parseFloat(params[1].value);
        var q0  = parseFloat(params[2].value);
        var T   = parseInt(params[3].value);
        var rep = parseInt(params[4].value);
        var model = d3.select('input[name="model"]:checked').node().value;
        svg.select('.axis.x').call(axis_x.scale(scale_x.domain([0, T])));
        for (var i = 0; i < rep; ++i) {
            var trajectory = wtl_genetics.evolve(N, s, q0, T, model);
            var repl_delay = T / 100 + 600 * i / rep;
            animation(trajectory, repl_delay);
            results.push(trajectory);
        }
    }

    var footer = d3.select('footer');
    var download_json = footer.append('a')
        .attr('class', 'button')
        .attr('download', 'driftr_result.json')
        .text('Save results');
    download_json.on('click', function(){
        var json = JSON.stringify(results);
        var blob = new Blob([json], {type: 'application/json'});
        var url = URL.createObjectURL(blob);
        download_json.attr('href', url);
    });
    footer.append('a')
        .attr('class', 'button')
        .attr('href', 'https://github.com/heavywatal/driftr.js/releases/latest')
        .text('Download driftr.js');
    footer.append('a')
        .attr('class', 'button')
        .attr('href', 'https://github.com/heavywatal/driftr.js/issues')
        .text('Send feedback');

    update_width();
    d3.select(window).on('resize', update_width);
    d3.select('.start').on('click', start);

})();
