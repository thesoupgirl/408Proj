import React from 'react'
import {
  Button,
  FormControl,
  FormGroup,
  Jumbotron,
  MenuItem,
  Nav,
  Navbar,
  NavDropdown
} from 'react-bootstrap'
import { map } from 'lodash'
import SweetAlert from 'react-bootstrap-sweetalert'





class SettingsPage extends React.Component {
	
  constructor(props) {
  
   console.log("at settings page")
    super(props)
   
     this.customizeBackground = this.customizeBackground.bind(this)
  }

  customizeBackground(){
   
      
       document.body.style.backgroundColor = '#33ccff'
  

  }
  
  

   render() {
    return (
      <div className='container'>
        <Jumbotron>
          <p>Welcome to the settings page where you can customize your Epstein experience.</p>
          <p>Choose  a color for the background.</p>
        <Button bsStyle='primary' className='blue' onClick={() => console.log( document.body.style.backgroundColor = '#e5ffff')}> Blue </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button bsStyle='primary' className='purple' onClick={() => console.log( document.body.style.backgroundColor = '#edc4e3')} > Purple </Button>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button bsStyle='primary' className='green' onClick={() => console.log( document.body.style.backgroundColor = '#d8e6ad')} > Green </Button>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button bsStyle='primary' className='Orange' onClick={() => console.log( document.body.style.backgroundColor = '#ffd194')} > Orange </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button bsStyle='primary' className='Pink' onClick={() => console.log( document.body.style.backgroundColor = '#ffcccc')} > Pink </Button>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button bsStyle='primary' className='Red' onClick={() => console.log( document.body.style.backgroundColor = '#ff6b6b')} > Red </Button>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button bsStyle='primary' className='Grey' onClick={() => console.log( document.body.style.backgroundColor = '#abbaab')} > Grey </Button>
        
        

        </Jumbotron>
        
      </div>
      )
   }
  }
  export default SettingsPage


	