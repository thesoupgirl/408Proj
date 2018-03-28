import React from 'react'
import { has } from 'lodash'
import { ajax } from 'jquery'
import moment from 'moment'
import SweetAlert from 'react-bootstrap-sweetalert'
import { Button, Jumbotron } from 'react-bootstrap'
import UserPage from './UserPage'

class ReschedulePage extends React.Component {
  
  constructor(props) {
     console.log("props at start of calendar page")
    console.log(props)

    super(props)
     //this.setActiveView = this.setActiveView.bind(this);
    console.log("choose calendar service")
    console.log(this.props)
    this.applyFunc = this.applyFunc.bind(this);
     
    
  }

  renderAlert() {
        const { alert } = this.props
        if (alert) {
            return (
                <SweetAlert
                    title="Loading User Data"
                    onConfirm={() => this.setState({alert:false})}
                    >
                    <div className="loader"></div>
                </SweetAlert>
            )
        }
        return (
            <div></div>
        )
    }

  applyFunc(){
      console.log("apply fun")
      const { apply } = this.props
      this.props.setApplyState(apply)
      //this.setState({ apply: true })
       console.log(this.props.apply)
      this.props.setActiveView(UserPage)
    }

   render() {
    return (
      <div className='container'>
       {this.renderAlert()}
        <Jumbotron>
          <p>Rescheduling Suggestions</p>
          <Button bsStyle='primary' className='Applybtn' onClick={() => {this.applyFunc()}}> Apply </Button>
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button bsStyle='primary' className='Cancelbtn'onClick={() => this.props.setActiveView(UserPage)} > Cancel </Button>
          
        </Jumbotron>
        
      </div>
      )
   }
  }
  export default ReschedulePage


  