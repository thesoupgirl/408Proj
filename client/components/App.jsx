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



class App extends React.Component {
  constructor(props) {
    console.log("----app---");
    console.log(props);
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
      apply: false
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
           	url: 'calendar/suggest',
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
	           //   this.setState({ eventList: data.items })
	              //this.setState({alert: false})
	              this.setActiveView(ReschedulePage)
	        	console.log(response)
	        	this.getEventList()

	          },
	          error: (response, data )=> {
	              // TODO give feedback to user
	              console.log("error")
	              console.log(response)
	              console.log("data")
	               console.log(data)
	          }
      })
   /* ajax({
      url: 'calendar/suggest',
      type: 'get',
      contentType: 'application/json',
       data: JSON.stringify(data),
          success: (data, response) => {
          	//console.log("data")
          	//console.log(data)
	        //this.setState({ ReschedulEventList: response.items })
	      	this.setState({alert: true})
	      	this.setActiveView(ReschedulePage)
	        console.log(response)
	        this.getEventList()
	        //this.setState({alert: false})
       
      },
      error: response => {
        // TODO give feedback to user
        console.log(response)
      }
    })*/
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
            this.setActiveView(UserPage)
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



postImportCalendar() {
    const data = {
      userName: this.state.user.name
    }
    ajax({
      url: '/calendar/import',
      type: 'post',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: () => {
        // TODO give feedback to user
        console.log("Added Imported Calendar Successfully")
        this.getEventList()
        //this.setActiveView(UserPage)
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
          getLogout={() => this.getLogout()}
          postCalendarAdd={calId => this.postCalendarAdd(calId)}
          postCalendarEvent={(calEvent, stressValue, navigateTo) => this.postCalendarEvent(calEvent, stressValue, navigateTo)}
          unratedEvents={this.unratedEvents()}
          user={this.state.user}
          setActiveView={activeView => this.setActiveView(activeView)}
          apply = {this.state.apply}
          setApplyState={apply => this.setApplyState(apply)}
        />
      </div>
    )
  }
}


render(<App/>, document.getElementById('app'))
