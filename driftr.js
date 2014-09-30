document.write("Hello, Javascript.<br />");

(function() {

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
        freq = [p];
        for (var t=0; t<T; ++t) {
            p = random_binomial(N, (1 + s) * p) / N;
            freq.push(p)
        }
        return freq;
    }

    console.log(random_binomial(100, 0.3));
    console.log(evolve(100, 0.5, 0.01, 100));

})()
