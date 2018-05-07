// source: https://en.wikipedia.org/wiki/Particle_swarm_optimization
import _ from 'lodash'

const iterations = 1000
const param1 = 0.15
const param2 = 0.25
const param3 = 0.01

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
    while (i++ < iterations) this.particlesRoutine()
  }

  particlesRoutine() {
    this.swarm.forEach(particle => {
      for(let d = 0; d < this.dimmensions; d++) {
        let rp = Math.random()
        let rb = Math.random()

        // calculate velocity
        let velocity = (
          param1 * particle.velocity[d] +
          param2 * rp * (particle.bestArgs[d] - particle.args[d]) +
          param3 * rb * (this.bestUnit.args[d] - particle.args[d])
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

  updateBestSwarmStats() {
    let bestParticle = this.swarm.reduce((v, acc) => v.fitScore > acc.bestFitScore ? v : acc, this.bestUnit)
    if(bestParticle.fitScore > this.bestUnit.fitScore) {
      this.bestUnit = _.cloneDeep(bestParticle)
    }
  }
}
