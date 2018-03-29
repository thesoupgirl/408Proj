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
import SettingsPage from './SettingsPage'
import HomePage from './HomePage'


class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      advice: 'Got nothing',
      activeView: LoginPage,
      authorized: false,
      calendarList: [],
      eventList: [],
      user: {},
      alert: true,
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
   getOutlook() {
    console.log("meow :" + this.state.eventList)
    this.state.eventList.push("\{ \"created\" : \"2017-03-28T20:30:49.000Z\",\"creator\" : \{ \"email\" : \"campb215@purdue.edu\", \"self\" : false \},\"end\" : \{\"dateTime\" : \"2018-02-05T11:00:00.000-08:00\",\"timeZone\" : \"America/New_York\"\},\"etag\" : \"\"2981603602346000\"\",\"htmlLink\" : \"https://www.google.com/calendar/event?eid=NnVybjk3aTRtaDRtMjdyNG5zam42MmhkYjBfMjAxODAyMDVUMTUwMDAwWiBvdGVzdGluZzY5QG0\", \"iCalUID\" : \"6urn97i4mh4m27r4nsjn62hdb0@google.com\",\"id\" : \"6urn97i4mh4m27r4nsjn62hdb0_20180205T150000Z\",\"kind\" : \"calendar#event\",\"organizer\" : \{\"email\" : \"campb215@purdue.edu\",\"self\" : false \},\"originalStartTime\" : \{\"dateTime\" : \"2018-02-05T10:00:00.000-08:00\",\"timeZone\" : \"America/New_York\"\}, \"recurringEventId\" : \"6urn97i4mh4m27r4nsjn62hdb0\", \"reminders\" : \{ \"useDefault\" : true\},\"sequence\" : 0,\"start\" : \{\"dateTime\" : \"2018-02-05T10:00:00.000-08:00\", \"timeZone\" : \"America/New_York\"\},\"status\" : \"confirmed\",\"summary\" : \"407 Meeting\",\"updated\" : \"2017-03-29T15:36:41.173Z\",\"stressValue\" : 0\}")
    console.log(" arf" + this.state.eventList)
    this.setState({yesOutlook: true})
   // this.setState{eventy: getEventList().push("\{ \"created\" : \"2017-03-28T20:30:49.000Z\",\"creator\" : \{ \"email\" : \"campb215@purdue.edu\", \"self\" : false \},\"end\" : \{\"dateTime\" : \"2018-02-05T11:00:00.000-08:00\",\"timeZone\" : \"America/New_York\"\},\"etag\" : \"\"2981603602346000\"\",\"htmlLink\" : \"https://www.google.com/calendar/event?eid=NnVybjk3aTRtaDRtMjdyNG5zam42MmhkYjBfMjAxODAyMDVUMTUwMDAwWiBvdGVzdGluZzY5QG0\", \"iCalUID\" : \"6urn97i4mh4m27r4nsjn62hdb0@google.com\",\"id\" : \"6urn97i4mh4m27r4nsjn62hdb0_20180205T150000Z\",\"kind\" : \"calendar#event\",\"organizer\" : \{\"email\" : \"campb215@purdue.edu\",\"self\" : false \},\"originalStartTime\" : \{\"dateTime\" : \"2018-02-05T10:00:00.000-08:00\",\"timeZone\" : \"America/New_York\"\}, \"recurringEventId\" : \"6urn97i4mh4m27r4nsjn62hdb0\", \"reminders\" : \{ \"useDefault\" : true\},\"sequence\" : 0,\"start\" : \{\"dateTime\" : \"2018-02-05T10:00:00.000-08:00\", \"timeZone\" : \"America/New_York\"\},\"status\" : \"confirmed\",\"summary\" : \"407 Meeting\",\"updated\" : \"2017-03-29T15:36:41.173Z\",\"stressValue\" : 0\}")}
    ajax({
      url: '/outlooksignin',
      type: 'get',
      success: (data) => {
       // this.setActiveView(UserPage)
        console.log("outlook success")
        console.log(data)
        window.location = data
       
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
          getEventList={() => this.getEventList()}
          getCalendars={() => this.getCalendars()}
          getOutlook={() => this.getOutlook()}
          getLogout={() => this.getLogout()}
          postCalendarAdd={calId => this.postCalendarAdd(calId)}
          postCalendarEvent={(calEvent, stressValue, navigateTo) => this.postCalendarEvent(calEvent, stressValue, navigateTo)}
          unratedEvents={this.unratedEvents()}
          user={this.state.user}
          setActiveView={activeView => this.setActiveView(activeView)}
        />
      </div>
    )
  }
}


render(<App/>, document.getElementById('app'))
