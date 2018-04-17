import React, { Component } from 'react'
import Visualization3DFunction from './Visualization3DFunction.js'
import VisualizationTableFunction from './VisualizationTableFunction.js'
import {ackleyFunction} from './TestFunctions.js'
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

const mTestFun = ackleyFunction()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {selectedView: 'room'}
  }

  render() {
    return (
      <div className="App">
        <div>
          <FormControl style={{width: '200px'}}>
            <InputLabel htmlFor="age-native-simple">Function type</InputLabel>
            <Select
              value={this.state.selectedView}
              onChange={(event) => this.setState({selectedView: event.target.value})}
              input={<Input name="age" id="age-helper" />}
              >
                <MenuItem value={'3dFunction'}>3D function</MenuItem>
                <MenuItem value={'room'}>Room</MenuItem>
              </Select>
          </FormControl>
        </div>
        {
          this.state.selectedView == '3dFunction' &&
          <Visualization3DFunction
            visFun={mTestFun}
          />
        }
        {this.state.selectedView == 'room' && <VisualizationTableFunction/>}
      </div>
    )
  }
}

export default App;
