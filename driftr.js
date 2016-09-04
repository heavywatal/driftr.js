(function(d3, x18n, t) {
    'use strict';

    function random_bernoulli(prob) {
        return Math.random() < prob;
    }

    function random_binomial(size, prob) {
        var cnt = 0;
        for (var i=0; i<size; ++i) {
            if (random_bernoulli(prob)) {++cnt;}
        }
        return cnt;
    }

    x18n.register('en', {
        params: {
            'popsize': 'Population size',
            'selection': 'Selection coefficient',
            'frequency': 'Initital frequency',
            'observation': 'Observation period',
            'replicates': 'Number of replicates'
        },
        axes: {
            'time': 'Time (generations)',
            'frequency': 'Frequency of mutant allele'
        },
        fixation: {
            'fixed': 'fixed',
            'polymorphic': 'polymorphic',
            'lost': 'lost'
        },
        footer: {
            'save': 'Save results',
            'download': 'Download driftr.js',
            'report': 'Send feedback'
        }
    });
    x18n.register('ja', {
        params: {
            'popsize': '集団サイズ',
            'selection': '選択係数',
            'frequency': '初期頻度',
            'observation': '観察期間',
            'replicates': '反復回数'
        },
        axes: {
            'time': '時間 (世代数)',
            'frequency': '変異型アリル頻度'
        },
        fixation: {
            'fixed': '固定',
            'polymorphic': '多型',
            'lost': '消失'
        },
        footer: {
            'save': '結果を保存',
            'download': 'driftr.jsをダウンロード',
            'report': '不具合報告・提案'
        }
    });

    var params = [
        [t('params.popsize') + ' (<var>N</var>)',
         'popsize', 100, 10000, 100, 1000],
        [t('params.selection') + ' (<var>s<var>)',
         'selection', -0.025, 0.025, 0.001, 0.0],
        [t('params.frequency') + ' (<var>q<sub>0</sub></var>)',
         'frequency', 0.0, 1.0, 0.01, 0.1],
        [t('params.observation'),
         'observation', 50, 400, 50, 100],
        [t('params.replicates'),
         'replicates', 10, 50, 10, 20]
    ];

    var params_now = {};
    for (var i=0; i<params.length; ++i) {
        var x = params[i];
        params_now[String(x[1])] = x[5];
    }

    function update_param(id, value) {
        input_items
            .select('#'+id+' label.value')
            .text(value);
        params_now[id] = value;
    }

    d3.select('main').append('form');
    var model = d3.select('form')
        .append('dl').attr('class', 'parameter');
    model.append('dt').append('label')
        .attr('class', 'name')
        .text('Model');
    model.append('dd')
        .each(function(d) {
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
        .on('input', function(d){update_param(d[1], this.value);});
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
            .attr('class', function(d){return 'name';})
            .text(function(d){return t('fixation.' + d);});
    fixation_divs.append('label')
            .attr('class', function(d){return 'value';});

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

    var scale_x = d3.scale.linear()
            .domain([0, parseInt(params_now.observation)]);
    var scale_y = d3.scale.linear()
            .domain([0, 1])
            .range([panel_height, 0]);
    var axis_func_x = d3.svg.axis()
            .scale(scale_x)
            .orient('bottom');
    var axis_func_y = d3.svg.axis()
            .scale(scale_y)
            .orient('left');
    var axis_x = plot.append('g')
            .attr('transform',
                  'translate(0,'+ panel_height +')')
            .call(axis_func_x);
    var axis_y = plot.append('g')
            .call(axis_func_y);
    var axis_title_x = plot.append('text')
            .attr('class', 'axis_title_x')
            .attr('text-anchor', 'middle')
            .text(t('axes.time'));
    var axis_title_y = plot.append('text')
            .attr('class', 'axis_title_y')
            .attr('text-anchor', 'middle')
            .text(t('axes.frequency') + ' (q)')
            .attr('transform', 'translate(-50,'+ panel_height/2 +') rotate(-90)');
    var line = d3.svg.line()
            .x(function(d, i) {return scale_x(i);})
            .y(function(d, i) {return scale_y(d);})
            .interpolate('linear');

    function update_width() {
        var width = parseInt(d3.select('.graph').style('width'));
        var fixation_width = parseInt(d3.select('svg').style('padding-right'));
        svg.attr('width', width - fixation_width);
        var svg_width = parseInt(svg.attr('width'));
        var panel_width = svg_width - svg_padding.left - svg_padding.right;
        panel_bg.attr('width', panel_width);
        scale_x.range([0, panel_width]);
        axis_x.call(axis_func_x.scale(scale_x));
        axis_title_x.attr('transform', 'translate('+
                          (panel_width / 2) +','+ (panel_height + 50) +')');
        panel.selectAll('path').remove();
        draw();
    }

    function wright_fisher(N, s, q0, T, rep) {
        for (var i=0; i<rep; ++i) {
            var qt = q0;
            var trajectory = [q0];
            var repl_delay = rep * T / 5 + 600 * i / rep;
            for (var t=1; t<=T; ++t) {
                qt = random_binomial(N, (1 + s) * qt / (1 + s * qt)) / N;
                trajectory.push(qt);
            }
            results.push(trajectory);
        }
        return results;
    }

    function moran(N, s, q0, T, rep) {
        var s1 = s + 1;
        for (var i=0; i<rep; ++i) {
            var Nq = Math.round(N * q0);
            var trajectory = [q0];
            var repl_delay = rep * T / 5 + 600 * i / rep;
            for (var t=1; t<=T * N; ++t) {
                var p_mutrep = s1 * Nq / (s1 * Nq  + (N - Nq));
                if (random_bernoulli(Nq / N)) {  // a mutant dies
                    if (!random_bernoulli(p_mutrep)) {--Nq;}
                } else {  // a wildtype dies
                    if (random_bernoulli(p_mutrep)) {++Nq;}
                }
                if (t % N === 0) {
                    trajectory.push(Nq / N);
                }
            }
            results.push(trajectory);
        }
        return results;
    }

    function simulation() {
        var N = parseFloat(params_now.popsize);
        var s = parseFloat(params_now.selection);
        var q0 = parseFloat(params_now.frequency);
        var T = parseInt(params_now.observation);
        var rep = parseInt(params_now.replicates);
        axis_x.call(axis_func_x.scale(scale_x.domain([0, T])));
        var model = d3.select('input[name="model"]:checked').node().value;
        if (model == 'wf') {
            wright_fisher(N, s, q0, T, rep);
        } else {
            moran(N, s, q0, T, rep);
        }
    }

    function draw() {
        var rep = results.length;
        for (var i=0; i<rep; ++i) {
            var trajectory = results[i];
            panel.append('path').attr('d', line(trajectory));
        }
    }

    function animation() {
        var rep = results.length;
        for (var i=0; i<rep; ++i) {
            var trajectory = results[i];
            var T = trajectory.length;
            var repl_delay = rep * T / 5 + 600 * i / rep;
            var path = panel.append('path');
            for (var t=0; t<=T; ++t) {
                var part = trajectory.slice(0, t);
                path.transition().delay(repl_delay + 23 * t).ease('linear')
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
    }

    function fixation_increment(id) {
        var label = d3.select(id + ' label.value');
        label.text(parseInt(label.text()) + 1);
    }

    var footer = d3.select('footer');
    var download_json = footer.append('a')
        .attr('class', 'button')
        .attr('download', 'driftr_result.json')
        .text(t('footer.save'));
    download_json.on('click', function(){
        var json = JSON.stringify(results);
        var blob = new Blob([json], {type: 'application/json'});
        var url = URL.createObjectURL(blob);
        download_json.attr('href', url);
    });
    footer.append('a')
        .attr('class', 'button')
        .attr('href', 'https://github.com/heavywatal/driftr.js/releases/latest')
        .text(t('footer.download'));
    footer.append('a')
        .attr('class', 'button')
        .attr('href', 'https://github.com/heavywatal/driftr.js/issues')
        .text(t('footer.report'));

    var results = [];
    update_width();

    d3.select(window).on('resize', update_width);
    d3.select('#start').on('click', function(){
        panel.selectAll('path').remove();
        d3.selectAll('#fixation label.value').text(0);
        results = [];
        simulation();
        animation();
    });

})(d3, x18n, t);
