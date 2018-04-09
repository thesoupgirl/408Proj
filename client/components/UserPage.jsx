import React from 'react'
import BigCalendar from 'react-big-calendar'
import { has } from 'lodash'
import { ajax } from 'jquery'
import moment from 'moment'
import SweetAlert from 'react-bootstrap-sweetalert'


BigCalendar.momentLocalizer(moment)

class UserPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            calID: ''
        }
        this.selectEvent = this.selectEvent.bind(this);
        this.selectSlot = this.selectSlot.bind(this);

    }

    accessor(time, event) {
        const dateTimeString = `${time}.dateTime`
        const dateString = `${time}.date`

        if (has(event, dateTimeString)) {
            return moment(event[time]['dateTime']).toDate()
        } else if (has(event, dateString)) {
            return moment(event[time]['date']).toDate()
        }
    }


    renderAlert() {
        const { alert } = this.props
        if (alert) {
            return (
                <SweetAlert
                    title="Loading User Data"
                    onConfirm={() => this.setState({alert:false})}
                    >
                    <div className="loader"></div>
                </SweetAlert>
            )
        }
        return (
            <div></div>
        )
    }
     selectEvent(event){
       alert(event.summary)
             
        
    }
    selectSlot(slotInfo){
         alert(
                    `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
                    `\nend: ${slotInfo.end.toLocaleString()}` 
            )
           
        
    }
   
     renderCalendar() {
        //console.log("arf" + this.props.eventList)
        //console.log("meow" + this.props.eventy)
        const { alert } = this.props
        if (!alert) {
            return (
                <BigCalendar
                    selectable
                    defaultView='week'
                    views={['day', 'week', 'month']}
                    events={this.props.eventList}
                    eventPropGetter={(event, start, end, isSelected) => this.eventPropGetter(event, start, end, isSelected)}
                    startAccessor={event => this.accessor('start', event)}
                    endAccessor={event => this.accessor('end', event)}
                    allDayAccessor={event => has(event, 'start.date') && has(event, 'end.date')}
                    titleAccessor='summary'

                   
                   

                    onSelectEvent={event => this.selectEvent(event)}
                    onSelectSlot={slotInfo => this.selectSlot(slotInfo)}
                />
            )
        }
        return (
             <div></div>
         )
    }
    eventPropGetter(event, start, end, isSelected) {
        const selected = isSelected ? '-selected' : ''

        if (event.stressValue === null || event.stressValue === undefined) {
            return { className: `event-unrated${selected}` }
        } else if (event.stressValue === 0) {
            return { className: `event-no-stress${selected}` }
        } else if (event.stressValue > 0 && event.stressValue <= 10) {
            return { className: `event-stress-${event.stressValue}${selected}` }
        } else if (event.stressValue < 0 && event.stressValue >= -10) {
            return { className: `event-destress-${Math.abs(event.stressValue)}${selected}`}
        }

        return { className: `event-unrated${selected}` }
    }

    render() {
        return (
            <div className='container'>
                {this.renderAlert()}
                {this.renderCalendar()}
            </div>
        )
    }
}

module.exports = UserPage
