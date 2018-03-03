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
        <Button style={{fontSize: 20, color: 'black', backgroundColor: 'blue'}} bsStyle='primary' className='Blue' onClick={() => console.log( document.body.style.backgroundColor = '#e5ffff')}> Blue </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button style={{fontSize: 20, color: 'black', backgroundColor: 'purple'}} bsStyle='primary' className='Purple' onClick={() => console.log( document.body.style.backgroundColor = '#edc4e3')}> Purple </Button>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button style={{fontSize: 20, color: 'black', backgroundColor: 'green'}} bsStyle='primary' className='Green' onClick={() => console.log( document.body.style.backgroundColor = '#d8e6ad')} > Green </Button>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button style={{fontSize: 20, color: 'black', backgroundColor: 'orange'}} bsStyle='primary' className='Orange' onClick={() => console.log( document.body.style.backgroundColor = '#ffd194')} > Orange </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button style={{fontSize: 20, color: 'black', backgroundColor: 'pink'}} bsStyle='primary' className='Pink' onClick={() => console.log( document.body.style.backgroundColor = '#ffcccc')} > Pink </Button>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button style={{fontSize: 20, color: 'black', backgroundColor: 'red'}} bsStyle='primary' className='Red' onClick={() => console.log( document.body.style.backgroundColor = '#ff6b6b')} > Red </Button>
         &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button style={{fontSize: 20, color: 'black', backgroundColor: 'grey'}} bsStyle='primary' className='Grey' onClick={() => console.log( document.body.style.backgroundColor = '#abbaab')} > Grey </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button style={{fontSize: 20, color: 'black', backgroundColor: 'white'}} bsStyle='primary' className='Grey' onClick={() => console.log( document.body.style.backgroundColor = '#ffffff')} > White </Button>
        </Jumbotron>
        
      </div>
      )
   }
  }
  export default SettingsPage


