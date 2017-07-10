'use strict';
import {randomNormal} from "d3-random";

export function bernoulli(prob) {
    return Math.random() < prob;
}

export function binomial(size, prob) {
    if (prob === 0) {return 0;}
    if (prob === 1) {return size;}
    let cnt = 0;
    let np = size * prob;
    let q = 1.0 - prob;
    if (np > 10 && size * q > 10) {
        cnt = randomNormal(np, Math.sqrt(np * q))();
        cnt = Math.floor(cnt + 0.5);
        return Math.max(Math.min(cnt, size), 0);
    }
    for (var i=0; i<size; ++i) {
        if (Math.random() < prob) {++cnt;}
    }
    return cnt;
}
