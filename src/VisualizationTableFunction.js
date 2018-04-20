import React, { Component } from 'react'
import _ from 'lodash'
import * as TableData from './TestFunctions.js'
import TextField from 'material-ui/TextField'
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';
import PSO from './Algorithms/Pso.js'

const canvasSideSize = 400
const canvasOffset = 50
const unit = canvasSideSize / TableData.roomDimmensions[0]

export default class VisualizationTable extends Component {
  constructor(props) {
    super(props)

    this.state = {furnitures: [], score: 0, selectedAlghoritm: 'pso', swarm: [], swarmSize: 10}
    this.alghorith = new PSO()

    this.updateSwarmData = this.updateSwarmData.bind(this)
    setTimeout(() => this.updateFurnituresState(TableData.getRandomizedFurnitures()), 100)
  }



  componentDidMount() {
    this.updateCanvas([])
  }

  updateSwarmData() {
    this.setState({swarm: this.alghorith.getSwarm()})
  }

  updateCanvas(furnitures) {
        const canvas = this.refs.canvas
        const ctx = canvas.getContext('2d')
        ctx.lineWidth = 3

        ctx.clearRect(0, 0, 800, 800);
        ctx.beginPath()
        ctx.rect(canvasOffset, canvasOffset, TableData.roomDimmensions[0] * unit, TableData.roomDimmensions[1] * unit)

        this.drawObjOnCanvas(ctx, {x: TableData.roomDimmensions[0] / 2, y: TableData.roomDimmensions[1] / 2, xW: 1, yW: 1}, "#000000")
        this.drawObjOnCanvas(ctx, TableData.doors, "#336699")
        this.drawObjOnCanvas(ctx, TableData.mWindow, "#66ffff")
        furnitures.forEach(v => this.drawObjOnCanvas(ctx, v, v.color, false))
    }

  drawObjOnCanvas(ctx, obj, color = "#003300", fill = true) {
    ctx.fillStyle = color
    ctx.strokeStyle = color
    if(fill) {
      ctx.fillRect(canvasOffset + (obj.x - obj.xW/2) * unit, canvasOffset + (obj.y - obj.yW/2) * unit, obj.xW * unit, obj.yW * unit)
    } else {
      ctx.strokeRect(canvasOffset + (obj.x - obj.xW/2) * unit, canvasOffset + (obj.y - obj.yW/2) * unit, obj.xW * unit, obj.yW * unit)
      ctx.stroke()
    }
  }

  updateFurnituresState(furnitures, args = []) {
    if(_.isEmpty(args)) {
      furnitures.forEach(v => {
        args.push(v.x)
        args.push(v.y)
      })
    }

    this.setState({furnitures: furnitures, score: TableData.roomFunction(args, furnitures)})
    this.updateCanvas(furnitures)
  }

  render() {
    return (
      <div>
        <div style={{display: 'flex'}}>
          <div>
            <div>
              {`Score: ${this.state.score}`}
            </div>
            <div>
              {this.renderInputs()}
            </div>
          </div>
          <div>
            {this.renderRoom()}
          </div>
        </div>
        {this.renderSwarmSection()}
      </div>
    )
  }

  renderRoom() {
    return (<canvas ref="canvas"  width={canvasSideSize + 2 * canvasOffset} height={canvasSideSize + 2 * canvasOffset}/>)
  }

  renderInputs() {
    return this.state.furnitures.map((v, index) => (
      <div key={index}>
        <a onClick = {() => console.log(v)}>
          <div style={{display: 'inline-block', width: '50px', color: v.color, fontWeight: 'bold'}}>
            {v.type}
          </div>
        </a>
        <input type="number" label={'x'} defaultValue={v.x} onChange={(event) => {
          let furnitures = [...this.state.furnitures]
          furnitures[index].x = Number(event.target.value)
          this.updateFurnituresState(furnitures)
        }}/>
        <input type="number" label={'y'} defaultValue={v.y} onChange={(event) => {
          let furnitures = [...this.state.furnitures]
          furnitures[index].y = Number(event.target.value)
          this.updateFurnituresState(furnitures)
        }}/>
      </div>
    ))
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
                  this.alghorith.start(this.state.furnitures.length * 2, [0, TableData.roomDimmensions[0]], TableData.roomFunction, this.state.swarmSize)
                  this.updateSwarmData()
                }}>
                  Start Alghoritm
                </button>
                <button onClick={this.updateSwarmData}>
                  Update swarm data
                </button>
            </FormControl>
          </div>
          {
            !_.isEmpty(this.state.swarm) &&
            <button onClick={() => {
              console.log(this.alghorith.getBest().args)
              this.updateFurnituresState(this.state.furnitures, this.alghorith.getBest().args)
            }}>
              Best
            </button>
          }
          {
            !_.isEmpty(this.state.swarm) &&
            this.state.swarm.map((v, index) => (
              <button
                key={index}
                onClick={() => {
                  console.log(v)
                  this.updateFurnituresState(this.state.furnitures, v.args)
                }}>
                Unit: {' ' + index}
              </button>
            ))
          }
        </div>
      </div>
    )
  }
}
