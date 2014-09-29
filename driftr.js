document.write("Hello, Javascript.<br />");

(function() {
    function bernoulli(prob) {
        return Math.random() < prob;
    }

    function binomial(size, prob) {
        var cnt = 0;
        for (var i=0; i<size; ++i) {
            if (bernoulli(prob)) {++cnt;}
        }
        return cnt;
    }

    var success = binomial(100, 0.3);
    console.log(success);
})()
