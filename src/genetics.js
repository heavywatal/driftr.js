import * as wtl_random from "./random.js";

export function wright_fisher(N, s, q0, T, rep) {
    var results = [];
    for (var i=0; i<rep; ++i) {
        var qt = q0;
        var trajectory = [q0];
        for (var t=1; t<=T; ++t) {
            qt = wtl_random.binomial(N, (1 + s) * qt / (1 + s * qt)) / N;
            trajectory.push(qt);
        }
        results.push(trajectory);
    }
    return results;
}

export function moran(N, s, q0, T, rep) {
    var results = [];
    var s1 = s + 1;
    for (var i=0; i<rep; ++i) {
        var Nq = Math.round(N * q0);
        var trajectory = [q0];
        for (var t=1; t<=T * N; ++t) {
            var p_mutrep = s1 * Nq / (s1 * Nq  + (N - Nq));
            if (wtl_random.bernoulli(Nq / N)) {  // a mutant dies
                if (!wtl_random.bernoulli(p_mutrep)) {--Nq;}
            } else {  // a wildtype dies
                if (wtl_random.bernoulli(p_mutrep)) {++Nq;}
            }
            if (t % N === 0) {
                trajectory.push(Nq / N);
            }
        }
        results.push(trajectory);
    }
}
