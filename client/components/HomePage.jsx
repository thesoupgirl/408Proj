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


class HomePage extends React.Component {
  
  constructor(props) {
  
   console.log("at home page")
    super(props)
   
  }

  
  
  

   render() {
    return (
      <div className='container'>
        <Jumbotron>
          <p>Welcome to Epstein.</p>
         


        

        </Jumbotron>
        
      </div>
      )
   }
  }
  export default HomePage


  