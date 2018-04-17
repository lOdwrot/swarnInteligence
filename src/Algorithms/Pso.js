// source: https://en.wikipedia.org/wiki/Particle_swarm_optimization

const iterations = 100

export default class PSO {
  constructor() {
    this.swarm = []
  }

  getSwarm() {
    return this.swarm
  }

  start(dimmensions, initedValueBorders, examFunction, particles = 10) {
    this.init(dimmensions, particles, initedValueBorders, examFunction)
  }

  init(dimmensions, particles, initedValueBorders, examFunction) {
    this.swarm = []
    for(let x = 0; x < particles; x++) {
      let args = []
      for(let i = 0; i < dimmensions; i++) {
        args.push(Math.random() * (initedValueBorders[1] - initedValueBorders[0]) + initedValueBorders[0])
      }
      this.swarm.push({args: args, fitScore: examFunction(args)})
    }
  }
}
