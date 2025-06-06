'use strict'
import { randomBernoulli, randomBinomial } from 'd3-random'

type qPrimeFun = (q: number, s: number) => number

export function wrightFisher(N: number, s: number, q0: number, T: number, qPrime: qPrimeFun, maxHistory: number) {
  let qt = q0
  const trajectory = [[0, q0]]
  const step = Math.max(Math.ceil(T / maxHistory), 1)
  for (let t = 1; t <= T; ++t) {
    qt = randomBinomial(N, qPrime(qt, s))() / N
    if (t % step === 0 || t === T) {
      trajectory.push([t, qt])
    }
  }
  return trajectory
}

export function wrightFisherHaploid(N: number, s: number, q0: number, T: number, maxHistory: number) {
  function qPrime(q: number, s: number) {
    const sq = s * q
    return (q + sq) / (1.0 + sq)
  }
  return wrightFisher(N, s, q0, T, qPrime, maxHistory)
}

export function wrightFisherDiploid(N: number, s: number, q0: number, T: number, maxHistory: number) {
  const h = 0.5
  function qPrime(q: number, s: number) {
    const sq = s * q
    const hsq = h * sq
    const sq2 = sq * q
    return (q + hsq - hsq * q + sq2) / (1.0 + 2.0 * hsq - 2 * hsq * q + sq2)
  }
  return wrightFisher(N, s, q0, T, qPrime, maxHistory)
}

export function heterozygoteAdvantage(N: number, s: number, q0: number, T: number, maxHistory: number) {
  function qPrime(q: number, s: number) {
    const spq = s * (1.0 - q) * q
    return (q + spq) / (1.0 + 2.0 * spq)
  }
  return wrightFisher(N, s, q0, T, qPrime, maxHistory)
}

export function moranHaploid(N: number, s: number, q0: number, T: number, maxHistory: number) {
  const s1 = s + 1
  let Nq = Math.round(N * q0)
  const trajectory = [[0, q0]]
  const step = Math.max(Math.ceil(T / maxHistory), 1)
  for (let t = 1; t <= T * N; ++t) {
    const pMutRep = s1 * Nq / (s1 * Nq + (N - Nq))
    if (randomBernoulli(Nq / N)()) { // a mutant dies
      if (!randomBernoulli(pMutRep)()) { --Nq }
    } else { // a wildtype dies
      if (randomBernoulli(pMutRep)()) { ++Nq }
    }
    if (t % (step * N) === 0 || t === T * N) {
      trajectory.push([t / N, Nq / N])
    }
  }
  return trajectory
}
