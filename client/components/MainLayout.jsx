import React from 'react'

import Navigation from './Navigation'


class MainLayout extends React.Component {
  render() {
    return (
      <div>

        <Navigation
          advice={this.props.advice}
          authorized={this.props.authorized}
          getCalendars={() => this.props.getCalendars()}
          getCalendarType={() => this.props.getCalendarType()}
          getLogout={() => this.props.getLogout()}
          setActiveView={activeView => this.props.setActiveView(activeView)}
          user={this.props.user}
        />
      
        <this.props.activeView
          calendarList={this.props.calendarList}
          eventList={this.props.eventList}
          alert={this.props.alert}
          getEventList={() => this.props.getEventList}
          postCalendarAdd={calID => this.props.postCalendarAdd(calID)}
          postCalendarEvent={(calEvent, stressValue, navigateTo) => this.props.postCalendarEvent(calEvent, stressValue, navigateTo)}
          unratedEvents={this.props.unratedEvents}
          user={this.props.user}
          setActiveView={activeView => this.props.setActiveView(activeView)}
          getCalendars={() => this.props.getCalendars()}
        />
      </div>
    )
  }
}

export default MainLayout
