import React, { useState, useEffect } from 'react';
import { getScheduleData } from '../util/CalendarUtil';
import TimeLabelContainer from './TimeLabelContainer';
import EventsContainer from './EventsContainer';
import '../style/Calendar.css';

function Calendar(props) {
  const urlParams = new URLSearchParams(window.location.search);
  const sharedScheduleId = urlParams.get('id');
  const [masterSchedule, setMasterSchedule] = useState();
  const [filteredSchedule, setFilteredSchedule] = useState();
  const [dayIndex, setDayIndex] = useState(0);

  useEffect(() => {
    getScheduleData(sharedScheduleId, masterSchedule, setMasterSchedule, setFilteredSchedule);
  }, [sharedScheduleId]);

  const handleDayClick = (i) => {
    return () => {
      setDayIndex(i);
    }
  }

  const daysList = (masterSchedule && 
    masterSchedule.schedule.map((d, i) => 
      <li className={i === dayIndex ? "selected" : ""} onClick={handleDayClick(i)}>{d.name}</li>
    )) || [];

  return (
    <div>
      <h1>Schedule</h1>
      { filteredSchedule && 
      <div>
        <ul class="dayPicker">{daysList}</ul>

        <div id="calendarContainer">
        <TimeLabelContainer startTime={masterSchedule.startTime} endTime={masterSchedule.endTime} />
        {sharedScheduleId 
          ? <EventsContainer startTime={masterSchedule.startTime} endTime={masterSchedule.endTime} filteredSchedule={filteredSchedule[dayIndex]} />
          : <i style={{padding: 20}}>No schedule loaded. <a href="/">Click here</a> to build a schedule.</i>
        }
        </div>
      </div>}
      <span class="buildLink"><a href="/">Build your own schedule!</a></span>
    </div>
  )
}

export default Calendar;