import React from 'react'
import {
  Button,
  FormControl,
  FormGroup,
  Jumbotron,
  MenuItem,
  Nav,
  Navbar,
  NavDropdown,
  Image,
  Grid,
  Row, 
  Col
} from 'react-bootstrap'
import { map } from 'lodash'
import SweetAlert from 'react-bootstrap-sweetalert'
import flower from '../image/flower.png'


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
 
  
    <img  width={900} height={600} alt="900x600"  src={require('../image/flower.png')} /> 
      

        
      </div>
      )
   }
  }
  export default HomePage


  