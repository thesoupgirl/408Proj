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





class ApplicationGuide extends React.Component {
	
  constructor(props) {
    super(props)
  }

  
  
   render() {
    return (
      <div className='container'>
        <Jumbotron>
   

          <p style={{color: "black", fontWeight: 'bold', fontSize: '50px', textDecorationStyle: "solid", border:'10px solid #000000', textAlign: 'center' }}> Application Guide </p>

     
        </Jumbotron>



<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> Hello and welcome to Epstein’s application guide! We hope this application guide will help you navigate through our application in the best way possible. Here is a video tour of our application, Epstein: </p>
<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> Navigation Bar </p>
<p> First off, Epstein has a navigation bar to make the user’s life simple while navigating through the application. This bar which is located at the top right of the page under ‘Tools’ will show the user all the different pages they can access on the web version of the application. </p>
  <img  width={400} height={500} alt="400x400"  src={require('../image/NavigationBar.png')} style={{position: "relative",   left: 125, right: 125}} />

<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> Home Page </p>
<p> The ‘Home Page’ tab gives a brief overview of our application’s purpose and various features on our Web and Mobile (Android) versions. </p>

  <img  width={900} height={600} alt="900x600"  src={require('../image/HomePage.png')} style={{position: "relative",   left: 125, right: 125}} />

<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> Choose Calendar Service </p>
<p> The ‘Choose Calendar Service’ tab will allow the user to choose which calendar service they would like, either Google or Outlook. </p>

  <img  width={900} height={600} alt="900x600"  src={require('../image/TypeOfCalendar.png')} style={{position: "relative",   left: 125, right: 125}} />

<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> Import Calendar </p>
<p> The ‘Import Calendar’ tab will allow the user to select a calendar from their Google or Outlook account to import using a dropdown menu.</p>

  <img  width={900} height={600} alt="900x600"  src={require('../image/ImportCalendar.png')} style={{position: "relative",   left: 125, right: 125}} />

<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> Rate Events </p>
<p> The ‘Rate Events’ tab allows the user to rate an event based on its stress level on a scale from negative ten to ten. </p>

  <img  width={900} height={600} alt="900x600"  src={require('../image/StressRatings.png')} style={{position: "relative",   left: 125, right: 125}} />

<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> Calendar </p>
<p> The ‘Calendar’ tab is where the user can view all their events on the calendar with the various stress ratings in day, week, or month view, see a legend which shows the different colors that go with the different stress ratings for an event, reschedule an event, and navigate to different days, weeks, and months in the calendar using the today, back, and next buttons.</p>

  <img  width={900} height={600} alt="900x600"  src={require('../image/Calendar.png')} style={{position: "relative",   left: 125, right: 125}} />

<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> Destress Page </p>
<p> The ‘Destress Page’ tab offers the user information on recommendations on de-stressing activities. To be specific, there is concise information available for our users for understanding stress symptoms, information on seeking psychological help, information on a safety plan, information on de-stressing methods. </p>

  <img  width={900} height={600} alt="900x600"  src={require('../image/DestressingMethods.png')} style={{position: "relative",   left: 125, right: 125}} />

<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> Entertainment </p>
<p> The ‘Entertainment’ tab can be explored for a plethora of fun methods for de-stressing. The user can easily access and play multiple, different games, listen to soothing Spotify music playlists, and watch YouTube videos with de-stressing music. </p>

  <img  width={900} height={600} alt="900x600"  src={require('../image/Entertainment.png')} style={{position: "relative",   left: 125, right: 125}} />

<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> Advice </p>
<p> The ‘Advice’ tab gives the user different advice and motivational quotes based on the day of the week it is! </p>

  <img  width={900} height={600} alt="900x600"  src={require('../image/Advice.png')} style={{position: "relative",   left: 125, right: 125}} />

<p style={{color: "blue", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> Settings </p>
<p> The ‘Settings’ tab will allow the user to choose different colors for the text as well as choose different colors for the backgrounds of all of the various pages of the application. </p>

  <img  width={900} height={600} alt="900x600"  src={require('../image/Settings.png')} style={{position: "relative",   left: 125, right: 125}} />

<p style={{color: "red", fontWeight: 'bold', fontSize: '20px',  textDecorationLine: "underline", textDecorationStyle: "solid"}}> Panic </p>
<p> The ‘PANIC’ tab can be pressed by the user if they feel overwhelmingly stressed out. The user can satisfyingly watch all of their events just fade away for a second before they reappear on the calendar again. </p>

  <img  width={900} height={600} alt="900x600"  src={require('../image/Panic.png')} style={{position: "relative",   left: 125, right: 125}} />

      </div>
      )
   }
  }
  export default ApplicationGuide