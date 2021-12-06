'use strict'
import * as random from './random.js'

export function wrightFisher (N, s, q0, T, qPrime) {
  let qt = q0
  const trajectory = [[0, q0]]
  const step = Math.max(T / 1000, 1)
  for (let t = 1; t <= T; ++t) {
    qt = random.binomial(N, qPrime(qt, s)) / N
    if (t % step === 0) {
      trajectory.push([t, qt])
    }
  }
  return trajectory
}

export function wrightFisherHaploid (N, s, q0, T) {
  function qPrime (q, s) {
    const sq = s * q
    return (q + sq) / (1.0 + sq)
  }
  return wrightFisher(N, s, q0, T, qPrime)
}

export function wrightFisherDiploid (N, s, q0, T) {
  const h = 0.5
  function qPrime (q, s) {
    const sq = s * q
    const hsq = h * sq
    const sq2 = sq * q
    return (q + hsq - hsq * q + sq2) / (1.0 + 2.0 * hsq - 2 * hsq * q + sq2)
  }
  return wrightFisher(N, s, q0, T, qPrime)
}

export function heterozygoteAdvantage (N, s, q0, T) {
  function qPrime (q, s) {
    const spq = s * (1.0 - q) * q
    return (q + spq) / (1.0 + 2.0 * spq)
  }
  return wrightFisher(N, s, q0, T, qPrime)
}

export function moranHaploid (N, s, q0, T) {
  const s1 = s + 1
  let Nq = Math.round(N * q0)
  const trajectory = [[0, q0]]
  const step = Math.max(T / 1000, 1)
  for (let t = 1; t <= T * N; ++t) {
    const pMutrep = s1 * Nq / (s1 * Nq + (N - Nq))
    if (random.bernoulli(Nq / N)) { // a mutant dies
      if (!random.bernoulli(pMutrep)) { --Nq }
    } else { // a wildtype dies
      if (random.bernoulli(pMutrep)) { ++Nq }
    }
    if (t % (step * N) === 0) {
      trajectory.push([t / N, Nq / N])
    }
  }
  return trajectory
}
