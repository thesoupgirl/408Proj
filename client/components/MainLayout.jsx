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
          getReschedule={() => this.props.getReschedule()}
          getOutlook={() => this.props.getOutlook()}
          getLogout={() => this.props.getLogout()}
          setActiveView={activeView => this.props.setActiveView(activeView)}
          user={this.props.user}
          yesOutlook={this.props.yesOutlook}
          getApplyReschedule = {() => this.props.getApplyReschedule() }
          setOutlookState={yesOutlook => this.props.setOutlookState(yesOutlook)}

        />
        <this.props.activeView
          calendarList={this.props.calendarList}
          eventList={this.props.eventList}
          ReschedulEventList ={this.props.ReschedulEventList}
          alert={this.props.alert}
          getEventList={() => this.props.getEventList}
          postCalendarAdd={calID => this.props.postCalendarAdd(calID)}
          postCalendarEvent={(calEvent, stressValue, navigateTo) => this.props.postCalendarEvent(calEvent, stressValue, navigateTo)}
          unratedEvents={this.props.unratedEvents}
          user={this.props.user}
          setActiveView={activeView => this.props.setActiveView(activeView)}
          getCalendars={() => this.props.getCalendars()}
          getReschedule={() => this.props.getReschedule()}
          apply={this.props.apply}
          setApplyState={apply => this.props.setApplyState(apply)}
          getWaitTime={() => this.props.getWaitTime()}
          postWaitTime={timeTaken => this.props.postWaitTime()}
          time={this.props.time}
          setTime={time => this.props.setTime(time)}
          getOutlook={() => this.props.getOutlook()}
          getApplyReschedule = {() => this.props.getApplyReschedule() }
          setOutlookState={yesOutlook => this.props.setOutlookState(yesOutlook)}

        />
      </div>
    )
  }
}

export default MainLayout
