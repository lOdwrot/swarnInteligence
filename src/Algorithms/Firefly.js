// https://en.wikipedia.org/wiki/Firefly_algorithm
import _ from 'lodash'

const iterations = 1000
const param1 = 0.01
const param2 = 0.05

const absorptionCoefficient = 0.5
const fitScoreMultiplayer = 2
const paramToAnother = 0.5

export default class PSO {
  constructor() {
    this.swarm = []
    this.bestUnit = {fitScore: -10000}
  }

  getSwarm() {
    return this.swarm
  }

  getBest() {
    return this.bestUnit
  }

  start(dimmensions, initedValueBorders, examFunction, particles = 10) {
    this.init(dimmensions, particles, initedValueBorders, examFunction)
  }

  init(dimmensions, particles, initedValueBorders, examFunction) {
    this.dimmensions = dimmensions
    this.examFunction = examFunction
    window.examFunction = examFunction
    this.swarm = []

    for(let x = 0; x < particles; x++) {
      let args = []
      for(let i = 0; i < dimmensions; i++) {
        args.push(Math.random() * (initedValueBorders[1] - initedValueBorders[0]) + initedValueBorders[0])
      }

      let fitScore = examFunction(args)
      let posiotions = args
      let velocity = args.map((v, index) =>
        (index % 2 == 0 ? 1 : -1) * Math.random() * Math.abs(initedValueBorders[0] - initedValueBorders[1]) / 2)

      this.swarm.push({
        args: args,
        fitScore: fitScore,
        bestFitScore: fitScore,
        bestArgs: posiotions,
        velocity: velocity
      })
    }

    this.updateBestSwarmStats()

    let i = 0
    // let interval = setInterval(
    //   () => {
    //     if(i++ < iterations) this.particlesRoutine()
    //     else clearInterval(interval)
    //   }, 10
    // )
    while (i++ < iterations) this.particlesRoutine()
  }

  particlesRoutine() {
    this.swarm.forEach(particle => {
      let bestNearest = getBestNearestParticel(particle)

      for(let d = 0; d < this.dimmensions; d++) {
        let rp = Math.random()

        // calculate velocity
        let velocity = (
          param1 * particle.velocity[d] +
          param2 * rp * (particle.bestArgs[d] - particle.args[d]) +
          (bestNearest.isBetter ? paramToAnother * (bestNearest.particle.args[d] - particle.args[d]) : 0)
        )

        // update particle data in single dimmension
        particle.velocity[d] = velocity
        particle.args[d] = particle.args[d] + velocity
      }

      // update overall stats
      particle.fitScore = this.examFunction(particle.args)
      if (particle.fitScore > particle.bestFitScore) {
        particle.bestFitScore = particle.fitScore
        particle.bestArgs = particle.args
      }
    })

    this.updateBestSwarmStats()
  }

  getBestNearestParticel(particle) {
    let bestAttractiveness = -99999999999999
    let bestNearestParticle
    this.swarm.forEach(v => {
      if(v == particle) return
      let distance = 0
      for(d in particle.args) distance += Math.abs(v.args[d] - particle.args[d])
      let attractiveness = Math.exp(-absorptionCoefficient * distance) + fitScoreMultiplayer * v.fitScore

      if(attractiveness > bestAttractiveness) {
        bestAttractiveness = attractiveness
        bestNearestParticle = v
      }
    })

    return {
      isBetter: bestNearestParticle.fitScore > particle.fitScore,
      particle: bestNearestParticle
    }
  }

  updateBestSwarmStats() {
    let bestParticle = this.swarm.reduce((v, acc) => v.fitScore > acc.bestFitScore ? v : acc, this.bestUnit)
    if(bestParticle.fitScore > this.bestUnit.fitScore) {
      console.log('Firefly found new best particle:')
      this.bestUnit = _.cloneDeep(bestParticle)
      console.log(this.bestUnit)
    }
  }
}
