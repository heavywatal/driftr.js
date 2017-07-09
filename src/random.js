export function bernoulli(prob) {
    return Math.random() < prob;
}

export function binomial(size, prob) {
    var cnt = 0;
    for (var i=0; i<size; ++i) {
        if (bernoulli(prob)) {++cnt;}
    }
    return cnt;
}
