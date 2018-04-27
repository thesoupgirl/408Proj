import React from 'react'
import BigCalendar from 'react-big-calendar'
import { has } from 'lodash'
import { ajax, when } from 'jquery'
import moment from 'moment'
import SweetAlert from 'react-bootstrap-sweetalert'
import { Button, Jumbotron } from 'react-bootstrap'
import UserPage from './UserPage'

class ReschedulePage extends React.Component {
  
  constructor(props) {
     console.log("props at start of Rescheduling page")
    console.log(props)

    super(props)
   
    this.applyFunc = this.applyFunc.bind(this);
     
    
  }

 accessor(time, event) {
       
             console.log("regular cal")
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
    renderCalendar() {
        const { alert } = this.props

        if (!alert) {
            return (
                <BigCalendar
                    defaultView= 'week'
                    views={['day', 'week', 'month']}
                    events={this.props.ReschedulEventList}
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

  applyFunc(){
      console.log("apply fun")
     const { apply } = this.props
      this.props.setApplyState(apply)
      this.setState({ apply: true })
     //  console.log(this.props.apply)
     // this.props.setActiveView(UserPage)
     console.log(this.prop)
     //var aj = this.props.getApplyReschedule().done(this.props.eventList().done(this.props.setActiveView(UserPage)).fail(error)).fail(error);
     ///when(aj).done( console.log("ajax done"));
    //var aj =  this.props.getApplyReschedule().done(this.props.eventList)
    //var changeView = when(aj).done(this.props.setActiveView(UserPage));
    //when(changeView).done( console.log("ajax done"));
   this.props.getApplyReschedule();
  //this.props.eventList;
   //this.props.setActiveView(UserPage);

    }

   render() {
    return (
      <div className='container'>
       {this.renderAlert()}
        {this.renderCalendar()}
        <Jumbotron>
          <p>Rescheduling Suggestions</p>
          <Button bsStyle='primary' className='Applybtn' onClick={() => {this.applyFunc()}}> Apply </Button>
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button bsStyle='primary' className='Cancelbtn'onClick={() => this.props.setActiveView(UserPage)} > Cancel </Button>
          
        </Jumbotron>
        
      </div>
      )
   }
  }
  export default ReschedulePage


  