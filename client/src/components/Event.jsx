import React from 'react';
import '../style/Event.css';

function TimeLabel(props) {
  const timeSlotHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--timeSlotHeight"));
  const style = {
    top: (props.event.startTime - props.startTime) * timeSlotHeight,
    height: (props.event.endTime - props.event.startTime) * timeSlotHeight - 2,
    left: (props.position) * 50 + "%",
    width: `calc(100% / ${props.maxConflicts + 1} - 1px)`
  };

  function getTime(time) {
      const hours = Math.floor(time);
      const minutes = ('' + (time - hours) * 60).padStart(2, '0');
      return hours > 23 ? hours == 24 ? `12:${minutes} AM` : `${hours-24}:${minutes} AM` : `${hours-12}:${minutes} PM`
  }

  const { name, subText, startTime, endTime, venue } = props.event;

  return (
    <div className="event" style={style}>
      <b>{name}</b><br />
      {subText && <span><i>{subText}</i><br /></span>}
      <br />
      {venue}<br />
      {getTime(startTime)} - {getTime(endTime)}
    </div>
  )
}

export default TimeLabel;