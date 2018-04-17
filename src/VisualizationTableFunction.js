import React, { Component } from 'react'
import _ from 'lodash'
import * as TableData from './TestFunctions.js'
import TextField from 'material-ui/TextField'

const canvasSideSize = 600
const canvasOffset = 100
const unit = canvasSideSize / TableData.roomDimmensions[0]



export default class VisualizationTable extends Component {
  constructor(props) {
    super(props)
    this.state = {furnitures: [], score: 0}

    setTimeout(() => this.updateFurnituresState(TableData.getRandomizedFurnitures()), 100)
  }

  componentDidMount() {
    this.updateCanvas([])
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

  updateFurnituresState(furnitures) {
    let args = []
    furnitures.forEach(v => {
      args.push(v.x)
      args.push(v.y)
    })
    this.setState({furnitures: furnitures, score: TableData.roomFunction(args, furnitures)})
    this.updateCanvas(furnitures)
  }

  render() {
    return (
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
    )
  }

  renderRoom() {
    return (<canvas ref="canvas"  width={800} height={800}/>)
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
}
