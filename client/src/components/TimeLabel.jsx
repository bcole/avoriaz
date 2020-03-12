import React from 'react';
import '../style/TimeLabel.css';

function TimeLabel(props) {
  function convertToFriendlyTime(h) {
    return h > 23 ? h === 24 ? "12:00 AM" : h-24 + ":00 AM" : h-12 + ":00 PM"
  }

  return (
    <div className="timeLabel">
      {convertToFriendlyTime(props.time)}
    </div>
  )
}

export default TimeLabel;