import React from 'react'

import Navigation from './Navigation'

class MainLayout extends React.Component {
  render() {
    return (
      <div>
        <Navigation
          authorized={this.props.authorized}
          getCalendars={() => this.props.getCalendars()}
          getLogout={() => this.props.getLogout()}
          user={this.props.user}
          setActiveView={activeView => this.props.setActiveView(activeView)}

        />
        <this.props.activeView
          calendarList={this.props.calendarList}
          unratedEvents={this.props.unratedEvents}
          eventList={this.props.eventList}
          postCalendarAdd={calID => this.props.postCalendarAdd(calID)}
        />
      </div>
    )
  }
}

export default MainLayout
