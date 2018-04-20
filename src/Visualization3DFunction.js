import diff from 'deep-diff'
import React, { Component } from 'react'
import _ from 'lodash'
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form'
import Checkbox from 'material-ui/Checkbox'
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import PSO from './Algorithms/Pso.js'
import Plot from 'react-plotly.js'

const halfSquara = 5

class Visualization extends Component {
  constructor(props) {
    super(props)

    let surface = this.generateSurface()
    let maxZ = Math.max.apply(Math, _.flatten(surface.z))

    this.updateSwarmData = this.updateSwarmData.bind(this)
    this.alghorithm = new PSO()
    this.state = {surface: this.generateSurface(), maxZ: maxZ, showSurface: true, showTopPoints: true, show3dPoints: true, selectedAlghoritm: 'pso', swarm: [], swarmSize: 10}
    this.swarmUpdateInterval = null
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEmpty(diff(this.state, nextState))
  }

  componentWillUnmount() {
    if(this.swarmUpdateInterval) clearInterval(this.swarmUpdateInterval)
  }

  updateSwarmData() {
    console.log('Updating swarm data')
    this.setState({swarm: this.alghorithm.getSwarm()})
  }

  handleChecboxChange = property => event => {
    this.setState({[property]: event.target.checked})
  }

  render() {
    return (
      <div style={{display: 'flex'}}>
        <div style={{maxWitdh: '300px'}}>
          {this.renderSwarmSection()}
        </div>
        <div>
          {this.renderSurfacePanel()}
        </div>
        <div>
          {this.renderControlPanel()}
        </div>
      </div>
    )
  }

  renderSwarmSection() {
    return (
      <div>
        <div>
          <div>
            <FormControl style={{width: '200px'}}>
              <InputLabel htmlFor="age-native-simple">Swarm type</InputLabel>
              <Select
                value={this.state.selectedAlghoritm}
                onChange={(event) => this.setState({selectedAlghoritm: event.target.value})}
                input={<Input name="age" id="age-helper" />}
                >
                  <MenuItem value={'pso'}>PSO</MenuItem>
                  <MenuItem value={'fireFly'}>Fire Fly</MenuItem>
                  <MenuItem value={'bee'}>Bee</MenuItem>
                </Select>
                <input type='number' onChange={(event)=> this.setState({swarmSize: Number(event.target.value)})} value={Number(this.state.swarmSize)}/>
                <button onClick={() => console.log(this.state.swarm)}>Log swarm</button>
                <button onClick={() => {
                  this.alghorithm.start(2, [-50, 50], this.props.visFun, this.state.swarmSize)
                  this.updateSwarmData()
                  // this.swarmUpdateInterval = setInterval(this.updateSwarmData, 100)
                }}>
                  Start Alghoritm
                </button>
                <button onClick={this.updateSwarmData}>
                  Update swarm data
                </button>
            </FormControl>
          </div>
        </div>
      </div>
    )
  }

  renderSurfacePanel() {
    // let agentsX = this.props.agents.map(v => v.x)
    // let agentsY = this.props.agents.map(v => v.y)
    // let agentsZ = this.props.agents.map(v => v.z)
    let agentxMaxZ = this.state.swarm.map(v => this.state.maxZ)

    let dataLayers = []

    if(this.state.showSurface) {
      dataLayers.push({
        x: this.state.surface.x,
        y: this.state.surface.y,
        z: this.state.surface.z,
        type: 'surface',
        mode: 'lines',
        marker: {color: 'red'},
      })
    }

    if(this.state.show3dPoints) {
      dataLayers.push({
        x: this.state.swarm.map(v => v.args[0]),
        y: this.state.swarm.map(v => v.args[1]),
        z: this.state.swarm.map(v => v.fitScore),
        type: 'scatter3d',
        mode: 'markers',
        marker: {
          color: 'black'
        }
      })
    }

    if(this.state.showTopPoints) {
      dataLayers.push({
        x: this.state.swarm.map(v => v.args[0]),
        y: this.state.swarm.map(v => v.args[1]),
        z: agentxMaxZ,
        type: 'scatter3d',
        mode: 'markers',
        marker: {
          color: 'green'
        }
      })
    }

    return (
      <div>
        <Plot
          data={dataLayers}
          layout={{width: this.props.width || 600, height: this.props.height || 600, title: 'Visualization'}}
        />
      </div>
    )
  }

  renderControlPanel() {
    return (
      <FormControl component="fieldset">
        <FormLabel component="legend">Showed layers</FormLabel>
        <FormGroup>
          {['showSurface', 'showTopPoints', 'show3dPoints'].map(v => (
            <FormControlLabel
              key={v}
              control={
                <Checkbox
                  checked={this.state[v]}
                  onChange={this.handleChecboxChange(v)}
                  value="antoine"
                  color="primary"
                />
              }
              label={v}
            />
          ))}

        </FormGroup>
      </FormControl>
    )
  }

  generateSurface(x = [-halfSquara,halfSquara], y = [-halfSquara,halfSquara], freq = 0.1) {
    let xVals = _.range(x[0], x[1], freq)
    let yVals = _.range(y[0], y[1], freq)
    let zVals = []

    yVals.forEach(yVal => {
      let row = []
      xVals.forEach(xVal => {
        row.push(this.props.visFun(xVal, yVal))
      })
      zVals.push(row)
    })

    return {
      x: xVals,
      y: yVals,
      z: zVals
    }
  }
}

export default Visualization;
