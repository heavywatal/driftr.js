(function(d3, x18n, t) {
    "use strict";

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

    x18n.register("en", {
        params: {
            "popsize": "Population size",
            "selection": "Selection coefficient",
            "frequency": "Initital frequency",
            "observation": "Observation period",
            "replicates": "Number of replicates"
        },
        axes: {
            "time": "Time (generations)",
            "frequency": "Frequency of mutant allele"
        },
        fixation: {
            "fixed": "fixed",
            "polymorphic": "poly",
            "lost": "lost"
        }
    });
    x18n.register("ja", {
        params: {
            "popsize": "集団サイズ",
            "selection": "選択係数",
            "frequency": "初期頻度",
            "observation": "観察期間",
            "replicates": "反復回数"
        },
        axes: {
            "time": "時間 (世代数)",
            "frequency": "変異型アリル頻度"
        },
        fixation: {
            "fixed": "固定",
            "polymorphic": "多型",
            "lost": "消失"
        }
    });

    var params = [
        [t("params.popsize") + " (N)",
         "popsize", 100, 10000, 100, 1000],
        [t("params.selection") + " (s)",
         "selection", -0.025, 0.025, 0.001, 0.0],
        [t("params.frequency") + " (q0)",
         "frequency", 0.0, 1.0, 0.01, 0.1],
        [t("params.observation"),
         "observation", 50, 400, 50, 100],
        [t("params.replicates"),
         "replicates", 10, 50, 10, 20]
    ];

    var params_now = {};
    for (var i=0; i<params.length; ++i) {
        var x = params[i];
        params_now[String(x[1])] = x[5];
    }

    var input_items = d3.select("form")
        .selectAll("dl")
        .data(params)
        .enter()
        .append("dl")
        .attr("id", function(d){return d[1];})
        .attr("class", "parameter");

    input_items.append("dt")
        .append("label")
        .attr("class", "param_name")
        .attr("for", function(d){return d[1];})
        .text(function(d){return d[0];});

    var input_ranges = input_items.append("dd")
        .attr("class", "param_range");

    input_ranges.append("label")
        .attr("class", "min")
        .attr("for", function(d){return d[1];})
        .text(function(d){return d[2];});
    input_ranges.append("label")
        .attr("class", "max")
        .attr("for", function(d){return d[1];})
        .text(function(d){return d[3];});
    input_ranges.append("br");

    input_ranges.append("input")
        .attr("type", "range")
        .attr("name", function(d){return d[1];})
        .attr("min", function(d){return d[2];})
        .attr("max", function(d){return d[3];})
        .attr("step", function(d){return d[4];})
        .attr("value", function(d){return d[5];})
        .on("input", function(d){update_param(d[1], this.value);});

    input_ranges.append("label")
        .attr("class", "value")
        .attr("for", function(d){return d[1];})
        .text(function(d){return d[5];});

    function update_param(id, value) {
        input_ranges
            .select("#"+id+" label.value")
            .text(value);
        params_now[id] = value;
    }

    d3.select("form").append("button")
        .attr("type", "button")
        .attr("id", "go")
        .text("Go!");

    var svg_padding = {
        top:    20,
        right:  80,
        bottom: 60,
        left:   80
    };

    var svg = d3.select("#graph")
            .append("svg")
            .attr("height", 400);

    var fixation_divs = d3.select("#graph")
            .append("div")
            .attr("id", "fixation")
            .selectAll("label")
            .data(["fixed", "polymorphic", "lost"])
            .enter()
            .append("div")
            .attr("id", function(d){return d;});
    fixation_divs.append("label")
            .attr("class", function(d){return "name";})
            .text(function(d){return t("fixation." + d) + ":";});
    fixation_divs.append("label")
            .attr("class", function(d){return "value";});

    var panel = svg.append("g")
            .attr("class", "panel")
            .attr("transform",
                  "translate("+svg_padding.left+","+svg_padding.top+")")
            .attr("height",
                  svg.attr("height") - svg_padding.top - svg_padding.bottom);
    var panel_bg = panel.append("rect")
            .attr("class", "panel_background")
            .attr("height", panel.attr("height"));

    var scale_x = d3.scale.linear()
            .domain([0, 100]);
    var scale_y = d3.scale.linear()
            .domain([0, 1])
            .range([panel.attr("height"), 0]);
    var line = d3.svg.line()
            .x(function(d, i) {return scale_x(i);})
            .y(function(d, i) {return scale_y(d);})
            .interpolate("linear");
    var x_axis = d3.svg.axis()
            .scale(scale_x)
            .orient("bottom");
    var y_axis = d3.svg.axis()
            .scale(scale_y)
            .orient("left");
    var x_axis_label = panel.append("text")
            .text(t("axes.time"))
            .attr("text-anchor", "middle");
    var y_axis_label = panel.append("text")
            .text(t("axes.frequency") + " (q)")
            .attr("text-anchor", 'middle');

    function update_width() {
        var col_width = 40;
        var width = parseInt(d3.select("#main").style("width"));
        svg.attr("width", width - col_width);
        scale_x.range([0, width - svg_padding.left - svg_padding.right - col_width]);
    }

    function draw(only_axis) {
        var svg_width = parseInt(svg.attr("width"));
        var panel_width = svg_width - svg_padding.left - svg_padding.right;
        var panel_height = parseInt(panel.attr("height"));
        var N = parseFloat(params_now["popsize"]);
        var s = parseFloat(params_now["selection"]);
        var q = parseFloat(params_now["frequency"]);
        var T = parseInt(params_now["observation"]);
        var rep = parseInt(params_now["replicates"]);
        panel.selectAll("path").remove();
        panel.selectAll("g").remove();

        panel_bg.attr("width", panel_width);
        scale_x.domain([0, T]);

        panel.append("g")
            .attr("transform",
                  "translate(0," + panel.attr("height") + ")")
            .call(x_axis);
        panel.append("g")
            .call(y_axis);

        x_axis_label.attr("transform", "translate("+
              ((svg_width - svg_padding.left - svg_padding.right) / 2)
              +","+ (panel_height + 50) +")");
        y_axis_label.attr("transform",
              "translate(-50,"+ panel_height/2 +")rotate(-90)");

        d3.selectAll("#fixation label.value").text(0);

        if (only_axis) {rep=0;}
        for (var i=0; i<rep; ++i) {
            var path = panel.append("path");
            var freq = [q];
            var repl_delay = rep * T / 5 + 600 * i / rep;
            for (var t=0; t<T; ++t) {
                var qt = freq[t];
                freq.push(random_binomial(N, (1 + s) * qt / (1 + s * qt)) / N);
                path.transition().delay(repl_delay + 23 * t).ease("linear")
                    .attr("d", line(freq));
            }
            if (freq.slice(-1)[0] == 1) {
                fixation_increment("#fixed");
            } else if (freq.slice(-1)[0] == 0) {
                fixation_increment("#lost");
            } else {
                fixation_increment("#polymorphic");
            }
        }
    }

    function fixation_increment(id) {
        var label = d3.select(id + " label.value");
        label.text(parseInt(label.text()) + 1);
    }

    update_width();
    draw(true);

    d3.select(window).on("resize", update_width);
    d3.select("#go").on("click", draw);

})(d3, x18n, t);
