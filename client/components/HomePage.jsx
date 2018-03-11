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
          <p>Welcome to Epstein. We are so glad you decided to use our smart calendar to help you manage and balance your day to day activities and alleviate your stress from the chaos of life! </p>
        </Jumbotron>


<img width={600} height={900} src={require('../image/flower.png')} style={{position: "relative", border: '50px solid pink', top: 100, left: 250}}/>


        
      </div>
      )
   }
  }
  export default HomePage


  