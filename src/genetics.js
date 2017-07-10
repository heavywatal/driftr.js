'use strict';
import * as wtl_random from "./random.js";

export function wright_fisher(N, s, q0, T, q_prime) {
    let qt = q0;
    let trajectory = [[0, q0]];
    let step = Math.max(T / 1000, 1);
    for (let t=1; t<=T; ++t) {
        qt = wtl_random.binomial(N, q_prime(qt, s)) / N;
        if (t % step === 0) {
            trajectory.push([t, qt]);
        }
    }
    return trajectory;
}

export function wright_fisher_haploid(N, s, q0, T) {
    function q_prime(q, s) {
        let sq = s * q;
        return (q + sq) / (1.0 + sq);
    }
    return wright_fisher(N, s, q0, T, q_prime);
}

export function wright_fisher_diploid(N, s, q0, T) {
    let h = 0.5;
    function q_prime(q, s) {
        let sq = s * q;
        let hsq = h * sq;
        let sq2 = sq * q;
        return (q + hsq - hsq * q + sq2) / (1.0 + 2.0 * hsq - 2 * hsq * q + sq2);
    }
    return wright_fisher(N, s, q0, T, q_prime);
}

export function heterozygote_advantage(N, s, q0, T) {
    function q_prime(q, s) {
        var spq = s * (1.0 - q) * q;
        return (q + spq) / (1.0 + 2.0 * spq);
    }
    return wright_fisher(N, s, q0, T, q_prime);
}

export function moran_haploid(N, s, q0, T) {
    let s1 = s + 1;
    let Nq = Math.round(N * q0);
    let trajectory = [[0, q0]];
    let step = Math.max(T / 1000, 1);
    for (let t=1; t<=T * N; ++t) {
        let p_mutrep = s1 * Nq / (s1 * Nq  + (N - Nq));
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
