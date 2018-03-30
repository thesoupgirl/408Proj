import React from 'react'
import BigCalendar from 'react-big-calendar'
import { has } from 'lodash'
import { ajax } from 'jquery'
import moment from 'moment'
import SweetAlert from 'react-bootstrap-sweetalert'
import { Button, Jumbotron } from 'react-bootstrap'





BigCalendar.momentLocalizer(moment)


class UserPage extends React.Component {
    constructor(props) {
        
        super(props)
        console.log("calendar")
        console.log(props)
        console.log("apply")
        console.log(this.props.apply)
        this.state = {
            calID: ''
        }

         this.RescheduleAction = this.RescheduleAction.bind(this);
         this.props.getWaitTime()
         this.start =  new Date().getTime()/1000;
         
    }

    accessor(time, event) {
        if(this.props.apply){
            console.log("applying resch cal changes")

            const dateTimeString = `${time}.dateTime`
            const dateString = `${time}.date`
            var daty = moment(event[time]['dateTime']).toDate()

            if (has(event, dateTimeString)) {
                var dat = moment(event[time]['dateTime']).toDate()
                dat = moment(daty).set({ hour: parseInt((dat.getHours() + 25), 10)}).toDate()
                return dat
                } 
            else if (has(event, dateString)) {
                return moment(event[time]['date']).toDate()
                }

            }
        else {
             console.log("regular cal")
            const dateTimeString = `${time}.dateTime`
            const dateString = `${time}.date`

            if (has(event, dateTimeString)) {
                return moment(event[time]['dateTime']).toDate()
            } else if (has(event, dateString)) {
                return moment(event[time]['date']).toDate()
            }
        }
         //this.props.setApplyState(this.props.apply)
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
    renderCalendar() {
        const { alert } = this.props

        if (!alert) {
            return (
                <BigCalendar
                    defaultView= 'week'
                    views={['day', 'week', 'month']}
                    events={this.props.eventList}
                    eventPropGetter={(event, start, end, isSelected) => this.eventPropGetter(event, start, end, isSelected)}
                    startAccessor={event => this.accessor('start', event)}
                    endAccessor={event => this.accessor('end', event)}
                    allDayAccessor={event => has(event, 'start.date') && has(event, 'end.date')}
                    titleAccessor='summary'
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

    RescheduleAction(){
        var end = new Date().getTime()/1000;
        this.props.getReschedule()
        console.log("time")
        console.log(end - this.start)
        this.props.setTime(end - this.start)
        this.props.postWaitTime(end - this.start)


    }

    render() {
        return (
            <div className='container'>
                {this.renderAlert()}
                {this.renderCalendar()}
                <Jumbotron>
                <Button bsStyle='primary' className='Reschedulebtn' onClick={() => this.RescheduleAction()}> Reschedule </Button>
                 </Jumbotron>
            </div>
        )
    }
}

module.exports = UserPage
