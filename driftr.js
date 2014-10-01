document.write("Hello, Javascript.<br />");

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

    function evolve(N, p, s, T) {
        var freq = [p];
        for (var t=0; t<T; ++t) {
            p = random_binomial(N, (1 + s) * p / (1 + s * p)) / N;
            freq.push(p);
        }
        return freq;
    }

    console.log(random_binomial(100, 0.3));
    var freq_history = evolve(100, 0.5, 0.01, 20);

    var svg_height = 320;
    var svg_width  = 640;

    d3.select("body").append("p").text("Hello, D3.js");

    d3.select("#table")
        .append("table")
        .append("tr")
        .selectAll("td")
        .data(freq_history)
        .enter()
        .append("td")
        .text(String);

    var svg = d3.select("#graph")
            .append("svg")
            .attr("width", svg_width)
            .attr("height", svg_height);
    var scale_x = d3.scale.linear()
            .domain([0, freq_history.length])
            .range([0, svg_width]);
    var scale_y = d3.scale.linear()
            .domain([0, 1])
            .range([svg_height, 0]);
    var line = d3.svg.line()
            .x(function(d, i) {return scale_x(i);})
            .y(function(d, i) {return scale_y(d);})
            .interpolate("linear");
    svg.append("path")
        .attr("d", line(freq_history))
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2);

})(d3);
