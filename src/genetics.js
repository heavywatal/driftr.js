'use strict';
import * as wtl_random from "./random.js";

export function wright_fisher(N, s, q0, T) {
    var qt = q0;
    var trajectory = [[0, q0]];
    var step = Math.max(T / 1000, 1);
    for (var t=1; t<=T; ++t) {
        qt = wtl_random.binomial(N, (1 + s) * qt / (1 + s * qt)) / N;
        if (t % step === 0) {
            trajectory.push([t, qt]);
        }
    }
    return trajectory;
}

export function moran(N, s, q0, T) {
    var s1 = s + 1;
    var Nq = Math.round(N * q0);
    var trajectory = [[0, q0]];
    var step = Math.max(T / 1000, 1);
    for (var t=1; t<=T * N; ++t) {
        var p_mutrep = s1 * Nq / (s1 * Nq  + (N - Nq));
        if (wtl_random.bernoulli(Nq / N)) {  // a mutant dies
            if (!wtl_random.bernoulli(p_mutrep)) {--Nq;}
        } else {  // a wildtype dies
            if (wtl_random.bernoulli(p_mutrep)) {++Nq;}
        }
        if (t % (step * N) === 0) {
            trajectory.push([t / N, Nq / N]);
        }
    }
    return trajectory;
}

export function evolve(N, s, q0, T, model) {
    if (model == 'wf') {
        return wright_fisher(N, s, q0, T);
    } else {
        return moran(N, s, q0, T);
    }
}
