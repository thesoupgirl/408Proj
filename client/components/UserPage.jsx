import React from 'react'
import BigCalendar from 'react-big-calendar'
import { has } from 'lodash'
import { ajax } from 'jquery'
import moment from 'moment'
import SweetAlert from 'react-bootstrap-sweetalert'
import {AdviceProvider} from './AdviceProvider.jsx'
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
import ImportPage from './ImportPage'

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
         this.message = this.message.bind(this);
         this.prompt = this.prompt.bind(this);
        // this.props.getWaitTime()
         this.start =  new Date().getTime()/1000;
        // this.setState({alert:true})




       // setTimeout(function(){ alert("Looks like you are having a stressful week.\nWould you like some rescheduling suggestions?\nCheck out all our resources in the toolbar\n "); },20000);

        this.selectEvent = this.selectEvent.bind(this);
        this.selectSlot = this.selectSlot.bind(this);


            
         
    }

    accessor(time, event) {
      /*  if(this.props.apply){
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
        else {*/
             console.log("regular cal")
            const dateTimeString = `${time}.dateTime`
            const dateString = `${time}.date`

            if (has(event, dateTimeString)) {
                return moment(event[time]['dateTime']).toDate()
            } else if (has(event, dateString)) {
                return moment(event[time]['date']).toDate()
            }
        //}
         //this.props.setApplyState(this.props.apply)
    }
    
    renderAlert() {
        const { alert } = this.props
        if (alert) {
            var totle = AdviceProvider();
            console.log(totle);
            return (
                <SweetAlert
                    title={ totle }
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
      if(confirm("Would you like to reschedule this event:\n\n" + event.summary)){
        this.RescheduleAction()
      }
             
        
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
             <div>

<img  width={100} height={100} alt="100x100"  src={require('../image/Legend.png')} style={{position: "relative",   left: 125, right: 125}} />

             </div>
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
    message(){
        alert("Looks like you are having a stressful week.\n Would you like some rescheduling suggestions? \n")
    }
    prompt(){
        const { alert } = this.props
        setTimeout(this.message() , 10000000);
        
    }

    render() {
        return (
            <div className='container'>
                {this.renderAlert()}
                <img  width={1000} height={300} alt="1000x300"  src={require('../image/Legend.png')} style={{position: "right",  left: 100, right: 100, bottom: 100, top: 100}} />
                {this.renderCalendar()}

                <Jumbotron>
                <Button bsStyle='primary' className='Reschedulebtn' onClick={() => this.RescheduleAction()}> Reschedule </Button>
                 </Jumbotron>
            </div>
            )
            return (
            <div className='calendar'>
            {this.renderCalendar(), <img  width={300} height={300} alt="300x300"  src={require('../image/Legend.png')} style={{position: "right",  left: 100, right: 100, bottom: 100, top: 100}} />}
            </div>
        )

    }

}

module.exports = UserPage
