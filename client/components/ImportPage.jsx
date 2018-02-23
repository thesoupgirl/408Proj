import React from 'react'
import {
  Button,
  FormControl,
  FormGroup,
  Jumbotron
} from 'react-bootstrap'
import { map } from 'lodash'
import SweetAlert from 'react-bootstrap-sweetalert'


class ImportPage extends React.Component {
  constructor(props) {
   console.log("import page")
    console.log(props)
    super(props)

    this.state = {
      calID: '',
      alertVisible: false
    }
  }

  renderOptions() {
    const { calendarList } = this.props

    return map(calendarList, calendar => {
      return (<option key={calendar.id} value={calendar.id}>{calendar.summary}</option>)
    })
  }
  postTheCalID(calID) {
      const { postCalendarAdd, getEventList } = this.props

      if(calID =="") {
          this.setState({alertVisible: true})
          return
      }
      postCalendarAdd(calID)
      
  }
  renderAlert() {
      const { alertVisible } = this.state

      if (alertVisible) {
        return (
          <SweetAlert
            type="error"
            title="Error"
            onConfirm={() => this.setState({ alertVisible: false })}>
            <p><strong>Pick a Calendar to Import</strong></p>
          </SweetAlert>
        )
      }
      return null
  }

  render() {
    const { postCalendarAdd } = this.props
    const { calID } = this.state

    return (
      <div className='container'>
          {this.renderAlert()}
        <Jumbotron>
          <p>Please select a calendar to import from the dropdown below</p>
          <FormGroup controlId="formControlsSelect">
            <FormControl
              componentClass="select"
              onChange={e => this.setState({ calID: e.target.value })}
              placeholder="select"
            >
              {this.renderOptions()}
            </FormControl>
          </FormGroup>

          <Button
            bsStyle='primary'
            className='submit-button-right'
            onClick={() => this.postTheCalID(calID)}
          >
            Submit
          </Button>

        </Jumbotron>
      </div>
    )
  }
}

export default ImportPage
