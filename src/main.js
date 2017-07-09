import * as d3 from "d3";
import * as wtl_genetics from "./genetics.js";

(function() {
    'use strict';

    var params = [
        ['Population size (<var>N</var>)',
         'popsize', 100, 10000, 100, 1000],
        ['Selection coefficient (<var>s<var>)',
         'selection', -0.025, 0.025, 0.001, 0.0],
        ['Initital frequency (<var>q<sub>0</sub></var>)',
         'frequency', 0.0, 1.0, 0.01, 0.1],
        ['Observation period',
         'observation', 100, 10000, 100, 100],
        ['Number of replicates',
         'replicates', 10, 50, 10, 20]
    ];

    d3.select('main').append('form');
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

    var input_items = d3.select('form')
        .selectAll('dl')
        .data(params, function(d) {return d;})
        .enter()
        .append('dl')
        .attr('id', function(d){return d[1];})
        .attr('class', 'parameter');

    input_items.append('label')
        .attr('class', 'value')
        .attr('for', function(d){return d[1];})
        .text(function(d){return d[5];});

    input_items.append('dt')
        .append('label')
        .attr('class', 'name')
        .attr('for', function(d){return d[1];})
        .html(function(d){return d[0];});

    var input_ranges = input_items.append('dd')
        .attr('class', 'param_range');
    input_ranges.append('input')
        .attr('type', 'range')
        .attr('name', function(d){return d[1];})
        .attr('min', function(d){return d[2];})
        .attr('max', function(d){return d[3];})
        .attr('step', function(d){return d[4];})
        .attr('value', function(d){return d[5];})
        .on('input', function(d){
            d3.select('#'+this.name+' label.value')
              .text(this.value);
            d[5] = this.value;
        });
    input_ranges.append('label')
        .attr('class', 'min')
        .attr('for', function(d){return d[1];})
        .text(function(d){return d[2];});
    input_ranges.append('label')
        .attr('class', 'max')
        .attr('for', function(d){return d[1];})
        .text(function(d){return d[3];});

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

    d3.select('main').append('div').attr('class', 'graph');
    var svg = d3.select('.graph').append('svg');

    var fixation_divs = d3.select('.graph')
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
    var panel_bg = plot.append('rect')
            .attr('class', 'panel_background')
            .attr('height', panel_height);
    var panel = plot.append('g')
            .attr('class', 'panel');

    var scale_x = d3.scaleLinear()
            .domain([0, parseInt(params[3][5])]);
    var scale_y = d3.scaleLinear()
            .domain([0, 1])
            .range([panel_height, 0]);
    var axis_x = plot.append('g')
            .attr('transform',
                  'translate(0,'+ panel_height +')')
            .call(d3.axisBottom(scale_x));
    /*var axis_y =*/ plot.append('g')
            .call(d3.axisLeft(scale_y));
    var axis_title_x = plot.append('text')
            .attr('class', 'axis_title_x')
            .attr('text-anchor', 'middle')
            .text('Time (generations)');
    /*var axis_title_y =*/ plot.append('text')
            .attr('class', 'axis_title_y')
            .attr('text-anchor', 'middle')
            .text('Derived Allele Frequency (q)')
            .attr('transform', 'translate(-50,'+ panel_height/2 +') rotate(-90)');
    var line = d3.line()
            .x(function(d, i) {return scale_x(i);})
            .y(function(d   ) {return scale_y(d);});

    function update_width() {
        var width = parseInt(d3.select('.graph').style('width'));
        var fixation_width = parseInt(d3.select('svg').style('padding-right'));
        svg.attr('width', width - fixation_width);
        var svg_width = parseInt(svg.attr('width'));
        var panel_width = svg_width - svg_padding.left - svg_padding.right;
        panel_bg.attr('width', panel_width);
        scale_x.range([0, panel_width]);
        axis_x.call(d3.axisBottom(scale_x));
        axis_title_x.attr('transform', 'translate('+
                          (panel_width / 2) +','+ (panel_height + 50) +')');
        panel.selectAll('path').remove();
        for (var i=0; i<results.length; ++i) {
            panel.append('path').attr('d', line(results[i]));
        }
    }

    function animation(trajectory, repl_delay) {
        var T = trajectory.length;
        var path = panel.append('path');
        for (var t=0; t<=T; ++t) {
            var part = trajectory.slice(0, t);
            path.transition().delay(repl_delay + 23 * t)
                .ease(d3.easeLinear)
                .attr('d', line(part));
        }
        var qT = trajectory.slice(-1)[0];
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

    var results = [];
    update_width();

    d3.select(window).on('resize', update_width);
    d3.select('.start').on('click', function(){
        results = [];
        panel.selectAll('path').remove();
        d3.selectAll('.fixation label.value').text(0);
        var N   = parseFloat(params[0][5]);
        var s   = parseFloat(params[1][5]);
        var q0  = parseFloat(params[2][5]);
        var T   = parseInt(  params[3][5]);
        var rep = parseInt(  params[4][5]);
        var model = d3.select('input[name="model"]:checked').node().value;
        axis_x.call(d3.axisBottom(scale_x.domain([0, T])));
        for (var i = 0; i < rep; ++i) {
            var trajectory = wtl_genetics.evolve(N, s, q0, T, model);
            var repl_delay = rep * trajectory.length / 5 + 600 * i / rep;
            animation(trajectory, repl_delay);
            results.push(trajectory);
        }
    });

})();
