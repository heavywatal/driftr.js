(function(d3) {

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

    function evolve(N, s, q, T) {
        var freq = [q];
        for (var t=0; t<T; ++t) {
            q = random_binomial(N, (1 + s) * q / (1 + s * q)) / N;
            freq.push(q);
        }
        return freq;
    }

    var params = [
        ["Population size (N)",
         "popsize", 100, 10000, 100, 1000],
        ["Selection coefficient (s)",
         "selection", -0.02, 0.02, 0.001, 0.01],
        ["Initial frequency (q)",
         "frequency", 0.0, 0.5, 0.02, 0.1],
        ["Observation period",
         "observation", 50, 400, 50, 100],
        ["Number of replicates",
         "replicates", 10, 50, 10, 10]
    ];

    var input_items = d3.select("form")
        .selectAll("div")
        .data(params)
        .enter()
        .append("div")
        .attr("class", "parameter");

    input_items.append("label")
        .attr("for", function(d){return d[1];})
        .text(function(d){return d[0];});

    input_items.append("input")
        .attr("type", "number")
        .attr("id", function(d){return d[1];})
        .attr("name", function(d){return d[1];})
        .attr("min", function(d){return d[2];})
        .attr("max", function(d){return d[3];})
        .attr("step", function(d){return d[4];})
        .attr("value", function(d){return d[5];});

    d3.select("form").append("button")
        .attr("type", "button")
        .attr("id", "go")
        .text("Go!");

    var svg = d3.select("#graph")
            .append("svg")
            .attr("height", 400);
    var scale_x = d3.scale.linear()
            .domain([0, 100]);
    var scale_y = d3.scale.linear()
            .domain([0, 1])
            .range([svg.attr("height"), 0]);
    var line = d3.svg.line()
            .x(function(d, i) {return scale_x(i);})
            .y(function(d, i) {return scale_y(d);})
            .interpolate("linear");

    function update_width() {
        var width = parseInt(d3.select("#main").style("width")) - 8;
        svg.attr("width", width);
        scale_x.range([0, width]);
    }

    function draw() {
        var N = parseInt(document.getElementById("popsize").value);
        var s = parseFloat(document.getElementById("selection").value);
        var q = parseFloat(document.getElementById("frequency").value);
        var T = parseInt(document.getElementById("observation").value);
        var rep = parseInt(document.getElementById("replicates").value);
        svg.selectAll("path").remove();
        scale_x.domain([0, T]);
        for (var i=0; i<rep; ++i) {
            var trajectory = evolve(N, s, q, T);
            svg.append("path").attr("d", line(trajectory));
        }
    }

    update_width();
    draw();

    d3.select(window).on("resize", update_width);
    d3.select("#go").on("click", draw);

})(d3);
