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

import Plot from 'react-plotly.js'

const halfSquara = 5

class Visualization extends Component {
  constructor(props) {
    super(props)

    let surface = this.generateSurface()
    let maxZ = Math.max.apply(Math, _.flatten(surface.z))

    this.state = {surface: this.generateSurface(), maxZ: maxZ, showSurface: true, showTopPoints: true, show3dPoints: true}
  }

  handleChecboxChange = property => event => {
    this.setState({[property]: event.target.checked})
  }

  render() {
    return (
      <div style={{display: 'flex'}}>
        <div>
          {this.renderSurfacePanel()}
        </div>
        <div>
          {this.renderControlPanel()}
        </div>
      </div>
    )
  }

  renderSurfacePanel() {
    let agentsX = this.props.agents.map(v => v.x)
    let agentsY = this.props.agents.map(v => v.y)
    let agentsZ = this.props.agents.map(v => v.z)
    let agentxMaxZ = this.props.agents.map(v => this.state.maxZ)

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
        x: agentsX,
        y: agentsY,
        z: agentsZ,
        type: 'scatter3d',
        mode: 'markers',
        marker: {
          color: 'black'
        }
      })
    }

    if(this.state.showTopPoints) {
      dataLayers.push({
        x: agentsX,
        y: agentsY,
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
          layout={{width: this.props.width || 1000, height: this.props.height || 1000, title: 'Visualization'}}
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
