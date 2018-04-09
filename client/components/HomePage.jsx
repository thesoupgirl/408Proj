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
  Col,
  Glyphicon, Carousel, CarouselItem, CarouselCaption
} from 'react-bootstrap'
import { map } from 'lodash'
import SweetAlert from 'react-bootstrap-sweetalert'
import flower from '../image/flower.png'
import sun from '../image/sun.png'
import ocean from '../image/ocean.png'
import UserPage from './UserPage'
import Games from './Games'
import CalendarPage from './CalendarPage'


class HomePage extends React.Component {
  
  constructor(props) {
  
   console.log("at home page")
    super(props)
   
  }

  
  
  

   render() {
    return (
      <div className='container'>
    
 
    <Carousel prevIcon ="<--" nextIcon = "-->">

     
      <Carousel.Item>
       <img  width={600} height={300} alt="900x600"  src={require('../image/EpsteinIcon.png')} style={{position: "relative", left: 250}} onClick={() => this.props.setActiveView(UserPage)} /> 
        <Carousel.Caption>
          <h3>Welcome to Epstein</h3>
          <h4>A smart calendar to help users recognize and manage the chaos of life. 
          </h4>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
      <img  width={900} height={600} alt="900x600"  src={require('../image/EpsteinOne.png')} style={{position: "relative",   left: 125, right: 125}} onClick={() => this.props.setActiveView(Games)} /> 
      <Carousel.Caption>
        <h3>Relax</h3>
      </Carousel.Caption>
      </Carousel.Item>


    <Carousel.Item>
       <img  width={900} height={600} alt="900x600"  src={require('../image/EpsteinTwo.png')} style={{position: "relative",  left: 125, right: 125}} onClick={() => this.props.setActiveView(UserPage)} /> 
      <Carousel.Caption>
        <h3>Plan it</h3>
      </Carousel.Caption>
    </Carousel.Item>
    </Carousel>

      <img  width={700} height="auto" alt="900x600"  src={require('../image/features.png')} style={{position: "relative", left: 250}} onClick={() => this.props.setActiveView(CalendarPage)} /> 

       <h3  style={{textAlign: "center"}}>Try Epstein on Android.
         </h3>
      <img  width={700} height="auto" alt="900x600"  src={require('../image/EpsteinThree.png')} style={{position: "relative", left: 250}} onClick={() => this.props.setActiveView(CalendarPage)} /> 


      

        
      </div>
      )
   }
  }
  export default HomePage


  