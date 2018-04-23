import React from 'react'
import { render } from 'react-dom'
import { ajax } from 'jquery'
import { isEmpty, filter, uniqBy, isEqual } from 'lodash'

import 'style/bootswatch'

import ImportPage from './ImportPage'
import LoginPage from './LoginPage'
import MainLayout from './MainLayout'
import UserPage from './UserPage'
import StressFormPage from './StressFormPage'

import Games from './Games'
import CalendarPage from './CalendarPage'
import ReschedulePage from './ReschedulePage'
import SettingsPage from './SettingsPage'
import HomePage from './HomePage'
import DestressPage from './DestressPage'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      advice: 'Got nothing',
      activeView: LoginPage,
      authorized: false,
      calendarList: [],
      eventList: [],
      ReschedulEventList: [],
      user: {},
      alert: true,
      apply: false,
      time: 0,
      yesOutlook: false,
      eventy: []
    }
  }

  // Component Lifecycle Methods

  componentDidMount() {
    this.getAuthorized()
    this.getAdvice()
  }

  componentDidUpdate() {
    const { authorized } = this.state

    if (!this.isActiveView(LoginPage) && !authorized) {
      this.setActiveView(LoginPage)
    }
  }

  // API Helpers

  responseIsJson(xhr) {
    const ct = xhr.getResponseHeader('content-type') || '';

    return (ct.indexOf('json') > -1)
  }

  // API Methods


getReschedule() {
	
	
      ajax({
           	url: 'calendar/suggest/' + this.state.user.name,
      	   	type: 'get',
      		//contentType: 'application/json',
	       	//data: JSON.stringify(data),
	          success: (data,response) => {
	          	console.log("calling resch endpoint")
	          	console.log("data")
          		console.log(data)
          		console.log("response")
          		console.log(response)
	      		this.setState({alert: true})
	           	this.setState({ ReschedulEventList: data.items })
	             
	            this.setActiveView(ReschedulePage)
	        	this.getEventList()
	        	//this.setState({alert: false})

	          },
	          error: (response, data )=> {
	              // TODO give feedback to user
	              console.log("error with resch suggest")
	              console.log(response)
	              console.log("data")
	               console.log(data)
	          }
      })
  }
  
  getWaitTime() {
    ajax({
      url: '/calendar/suggest/wait/' + this.state.user.name,
      type: 'get',
      success: (data,response) => {
        		console.log("Expected wait time")
	          	console.log("data")
          		console.log(data)
          		console.log("response")
          		console.log(response)
       
      },
      error: response => {
        // TODO give feedback to user
        console.log("Error in Expected wait time")
        console.log(response)
      }
  	})
  }
   

  getCalendarType() {
    ajax({
      url: '/calendar/import',
      type: 'get',
      success: () => {
        this.setActiveView(CalendarPage)
       
      },
      error: response => {
        // TODO give feedback to user
        console.log(response)
      }
    })
  }


  getAdvice() {
    ajax({
      url: '/advice',
      type: 'get',
      success: (data, status, xhr) => {
        this.setState({ advice: data.advice })
      },
      error: response => {
        // TODO give feedback to user
        console.log(response)
      }
    })
  }

  getAuthorized() {
    ajax({
      url: '/me',
      type: 'get',
      success: (user, status, xhr) => {
        if (this.responseIsJson(xhr)) {
            this.setState({ user, authorized: true })
            this.setActiveView(HomePage)
            this.getEventList()
          return
        }

        this.setState({ user: {}, authorized: false })
      },
      error: response => {
        this.setState({ user: {}, authorized: false })
      }
    })
  }
  getEventList() {
  		console.log("is it outlook")
  		console.log(this.yesOutlook)
      

  	 if (this.yesOutlook){
  		window.location.href = 'http://localhost:8080/'

		 	
  	 		ajax({
		      url: '/outlook/events',
		      type: 'get',
		      contentType: 'application/json',
          	  data: JSON.stringify(data),
		      success: (data, xhr) => {

		      		console.log("outlook event success")
		        	console.log(data)
		        	window.location.href = 'http://localhost:8080/'
		          	this.setState({ eventList: data.items })
		          	this.setActiveView(UserPage)
		          	this.setState({alert: false})

		       
		      },
		      error: response => {
		        // TODO give feedback to user
		        console.log("error outlook event success")
		        console.log(response)
		      }
		    })
  	 }
  	 else {
      const data = {
          userName: this.state.user.name
      }

      ajax({
          url: '/api/calendar/events',
          type: 'post',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: (data) => {
              this.setState({ eventList: data.items })
              this.setState({alert: false})

          },
          error: response => {
              // TODO give feedback to user
              console.log(response)
          }
      });
  	}
  }

  getCalendars() {
    ajax({
      url: '/calendar/list',
      type: 'get',
      success: (data, status, xhr) => {
        if (this.responseIsJson(xhr)) {
          this.setState({ calendarList: data.items })

        }

        this.setActiveView(ImportPage)
      },
      error: response => {
        // TODO give feedback to user
        console.log(response)
      }
    })
  }
   getOutlook() {
    console.log("meow :" + this.state.eventList)
    //this.state.eventList.push("\{ \"created\" : \"2017-03-28T20:30:49.000Z\",\"creator\" : \{ \"email\" : \"campb215@purdue.edu\", \"self\" : false \},\"end\" : \{\"dateTime\" : \"2018-02-05T11:00:00.000-08:00\",\"timeZone\" : \"America/New_York\"\},\"etag\" : \"\"2981603602346000\"\",\"htmlLink\" : \"https://www.google.com/calendar/event?eid=NnVybjk3aTRtaDRtMjdyNG5zam42MmhkYjBfMjAxODAyMDVUMTUwMDAwWiBvdGVzdGluZzY5QG0\", \"iCalUID\" : \"6urn97i4mh4m27r4nsjn62hdb0@google.com\",\"id\" : \"6urn97i4mh4m27r4nsjn62hdb0_20180205T150000Z\",\"kind\" : \"calendar#event\",\"organizer\" : \{\"email\" : \"campb215@purdue.edu\",\"self\" : false \},\"originalStartTime\" : \{\"dateTime\" : \"2018-02-05T10:00:00.000-08:00\",\"timeZone\" : \"America/New_York\"\}, \"recurringEventId\" : \"6urn97i4mh4m27r4nsjn62hdb0\", \"reminders\" : \{ \"useDefault\" : true\},\"sequence\" : 0,\"start\" : \{\"dateTime\" : \"2018-02-05T10:00:00.000-08:00\", \"timeZone\" : \"America/New_York\"\},\"status\" : \"confirmed\",\"summary\" : \"407 Meeting\",\"updated\" : \"2017-03-29T15:36:41.173Z\",\"stressValue\" : 0\}")
    console.log(" arf" + this.state.eventList)
    //this.setState({yesOutlook: true})
   // this.setState{eventy: getEventList().push("\{ \"created\" : \"2017-03-28T20:30:49.000Z\",\"creator\" : \{ \"email\" : \"campb215@purdue.edu\", \"self\" : false \},\"end\" : \{\"dateTime\" : \"2018-02-05T11:00:00.000-08:00\",\"timeZone\" : \"America/New_York\"\},\"etag\" : \"\"2981603602346000\"\",\"htmlLink\" : \"https://www.google.com/calendar/event?eid=NnVybjk3aTRtaDRtMjdyNG5zam42MmhkYjBfMjAxODAyMDVUMTUwMDAwWiBvdGVzdGluZzY5QG0\", \"iCalUID\" : \"6urn97i4mh4m27r4nsjn62hdb0@google.com\",\"id\" : \"6urn97i4mh4m27r4nsjn62hdb0_20180205T150000Z\",\"kind\" : \"calendar#event\",\"organizer\" : \{\"email\" : \"campb215@purdue.edu\",\"self\" : false \},\"originalStartTime\" : \{\"dateTime\" : \"2018-02-05T10:00:00.000-08:00\",\"timeZone\" : \"America/New_York\"\}, \"recurringEventId\" : \"6urn97i4mh4m27r4nsjn62hdb0\", \"reminders\" : \{ \"useDefault\" : true\},\"sequence\" : 0,\"start\" : \{\"dateTime\" : \"2018-02-05T10:00:00.000-08:00\", \"timeZone\" : \"America/New_York\"\},\"status\" : \"confirmed\",\"summary\" : \"407 Meeting\",\"updated\" : \"2017-03-29T15:36:41.173Z\",\"stressValue\" : 0\}")}
    ajax({
      url: '/outlooksignin',
      type: 'get',
      async: false,
      success: (data) => {
       // this.setActiveView(UserPage)
        console.log("outlook success")
        console.log(data)
        window.location = data
         this.setState({yesOutlook: true})
       
      },
      error: response => {
        // TODO give feedback to user
        console.log(response)
      }
    })

  /*  ajax({
      url: '/outlook/events',
      type: 'get',
      async: false,
      success: (data, xhr) => {

      	if (this.responseIsJson(xhr)) {
      		console.log("outlook event success")
        	console.log(data)
          	this.setState({ eventList: data.items })
            this.setState({alert: false})
          	this.setActiveView(UserPage)
    

        }
       
       
      },
      error: response => {
        // TODO give feedback to user
        console.log(response)
      }
    })*/
}
  getLogout() {
      ajax({
          url: '/logout',
          type: 'get',
          success: (data, status, xhr) => {
              this.setState({ authorized: false })
              this.setState({ apply: false })
          },
          error: response => {
              // TODO give feedback to user
              console.log(response)
          }
      })
  }
  postCalendarAdd(calID) {
    const data = {
      calID,
      userName: this.state.user.name
    }
    ajax({
      url: '/calendar/add',
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: () => {
        // TODO give feedback to user
        console.log("Added Calendar Successfully")
        this.getEventList()
        this.setActiveView(UserPage)
      },
      error: response => {
        // TODO give feedback to user
        console.log(response)
      }
    })
  }

  postCalendarEvent(calEvent, stressValue, navigateTo) {
    const data = {
      calEvent,
      stressValue,
      userName: this.state.user.name
    }

    ajax({
      url: '/calendar/event',
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: () => {
        console.log(`Added stressValue ${stressValue} to event with id ${calEvent}`)
        this.setState({alert: true})
        if (navigateTo) {
          this.setActiveView(navigateTo)
        }
        this.getEventList()
      },
      error: response => {
        // TODO give feedback to user
        console.log(response)
      }
    })
  }

  postWaitTime(timeTaken) {
  	 const { time } = this.state
  	 const data = {
          timeTaken: 17.35
      }
      console.log("time taken--------------")
      console.log(timeTaken)
      console.log("time--------------")
       console.log(this.state.time)
        console.log(this.time)
         console.log(time)

      console.log("what is json")
      console.log(JSON.stringify(data))


    ajax({
      url: '/calendar/suggest/train/' + this.state.user.name ,
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify(data),

      success: (data,response) => {
        		console.log("post time it took to press button")
	          	console.log("data")
          		console.log(data)
          		console.log("response")
          		console.log(response)
       
      },
      error: response => {
        // TODO give feedback to user
        console.log("error in postWaitTime")
        console.log(response)
      }
  	})
  }
 

  // App Methods

  isActiveView(view) {
    return view === this.state.activeView
  }

  setActiveView(activeView) {
    this.setState({ activeView })
  }
  setApplyState(apply){
  	if(apply){
  		this.setState({ apply: false })
  	}
  	else {
  		this.setState({ apply: true })
  	}
  }
  setTime(time) {
    this.setState({ time: time })
  }

  unratedEvents() {
    var temp = filter(this.state.eventList, event =>
        {return event.stressValue === null || event.stressValue === undefined});
    var fin = uniqBy(temp, "id");
    fin = uniqBy(temp, "summary")
    console.log(fin.length+"   "+temp.length);
    return fin;
  }

  render() {
    return (
      <div className="container">
        <MainLayout
          activeView={this.state.activeView}
          advice={this.state.advice}
          alert={this.state.alert}
          authorized={this.state.authorized}
          calendarList={this.state.calendarList}
          eventList={this.state.eventList}
          ReschedulEventList ={this.state.ReschedulEventList}
          getEventList={() => this.getEventList()}
          getCalendars={() => this.getCalendars()}
          getCalendarType={() => this.getCalendarType()}
          getReschedule={() => this.getReschedule()}
          getOutlook={() => this.getOutlook()}
          getLogout={() => this.getLogout()}
          postCalendarAdd={calId => this.postCalendarAdd(calId)}
          postCalendarEvent={(calEvent, stressValue, navigateTo) => this.postCalendarEvent(calEvent, stressValue, navigateTo)}
          unratedEvents={this.unratedEvents()}
          user={this.state.user}
          setActiveView={activeView => this.setActiveView(activeView)}
          apply = {this.state.apply}
          setApplyState={apply => this.setApplyState(apply)}
          getWaitTime={() => this.getWaitTime()}
          postWaitTime={timeTaken => this.postWaitTime()}
          time={this.state.time}
          setTime={time => this.setTime(time)}


        />
      </div>
    )
  }
}


render(<App/>, document.getElementById('app'))
