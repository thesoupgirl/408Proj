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

import ImportPage from './ImportPage'
import StressFormPage from './StressFormPage'
import UserPage from './UserPage'
import Navigation from './Navigation'


class CalendarPage extends React.Component {
	
  constructor(props) {
     console.log("props at start of calendar page")
    console.log(props)

    super(props)
     //this.setActiveView = this.setActiveView.bind(this);
    console.log("choose calendar service")
    console.log(this.props)
    console.log("before" + this.props.eventList)
    //var str = "{ hello: 'world', places: ['Africa', 'America', 'Asia', 'Australia'] }";
    //var json = JSON.stringify(eval("(" + str + ")"));
    //var jsony = [{"countryName":"Afghanistan","year":"1960","cases":"887"},{"countryName":"Afghanistan","year":"1965","cases":"218"}];
    //var jsony = [{"created" : "2017-03-28T20:30:49.000Z","creator" : { "email" : "campb215@purdue.edu", "self" : false },"end" : {"dateTime" : "2018-02-05T11:00:00.000-08:00","timeZone" : "America/New_York"},"etag" : "2981603602346000","htmlLink" : "https://www.google.com/calendar/event?eid=NnVybjk3aTRtaDRtMjdyNG5zam42MmhkYjBfMjAxODAyMDVUMTUwMDAwWiBvdGVzdGluZzY5QG0", "iCalUID" : "6urn97i4mh4m27r4nsjn62hdb0@google.com","id" : "6urn97i4mh4m27r4nsjn62hdb0_20180205T150000Z","kind" : "calendar#event","organizer" : {"email" : "campb215@purdue.edu","self" : false },"originalStartTime" : {"dateTime" : "2018-02-05T10:00:00.000-08:00","timeZone" : "America/New_York"}, "recurringEventId" : "6urn97i4mh4m27r4nsjn62hdb0", "reminders" : { "useDefault" : true},"sequence" : 0,"start" : {"dateTime" : "2018-02-05T10:00:00.000-08:00", "timeZone" : "America/New_York"},"status" : "confirmed","summary" : "407 Meeting","updated" : "2017-03-29T15:36:41.173Z","stressValue" : 0},{ "created": "2017-03-28T20:30:49.000Z",  "creator": {    "email": "campb215@purdue.edu",   "self": false },  "end": {    "dateTime": "2018-02-05T11:00:00.000-08:00",    "timeZone": "America/New_York"  },  "etag": "2981603602346000", "htmlLink": "https://www.google.com/calendar/event?eid=NnVybjk3aTRtaDRtMjdyNG5zam42MmhkYjBfMjAxODAyMDVUMTUwMDAwWiBvdGVzdGluZzY5QG0",  "iCalUID": "6urn97i4mh4m27r4nsjn62hdb0@google.com", "id": "6urn97i4mh4m27r4nsjn62hdb0_20180205T150000Z",  "kind": "calendar#event", "organizer": {    "email": "campb215@purdue.edu",   "self": false },  "originalStartTime": {    "dateTime": "2018-02-05T10:00:00.000-08:00",    "timeZone": "America/New_York"  },  "recurringEventId": "6urn97i4mh4m27r4nsjn62hdb0", "reminders": {    "useDefault": true  },  "sequence": 0,  "start": {    "dateTime": "2018-02-05T10:00:00.000-08:00",    "timeZone": "America/New_York"  },  "status": "confirmed",  "summary": "407 Meeting", "updated": "2017-03-29T15:36:41.173Z",  "stressValue": 0}];
    //var json = JSON.stringify(eval("(" + jsony + ")"));
    //this.props.eventList.push(JSON.parse(json))
    console.log ("kill me" + this.props.eventList)
      this.calendarType = ''
      this.calendarExist =  false
     this.GoogleFunc = this.GoogleFunc.bind(this);
  }

  GoogleFunc(){
    const { getCalendars, setActiveView } = this.props
     //this.calendarType = 'Google'
     //getCalendars()


  }
  
  // buttons for importing google and outlook calendars

   render() {
    return (
      <div className='container'>
        <Jumbotron>
          <p>Choose type of calendar to import.</p>
        <Button bsStyle='primary' className='Googlebtn' onClick={() => this.props.getCalendars()}> Google </Button>
        <p>     </p>
        <Button bsStyle='primary' className='Outlookbtn' onClick={() => this.props.getOutlook()}> Outlook </Button>
        
        </Jumbotron>
        
      </div>
      )
   }
  }
  export default CalendarPage


	