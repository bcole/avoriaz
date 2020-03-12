import React from 'react';
import TimeLabel from './TimeLabel';
import '../style/TimeLabelContainer.css';

function TimeLabelContainer(props) {

  const timeLabels = [];
  for(let t = props.startTime; t <= props.endTime; t++) {
    timeLabels.push(<TimeLabel time={t} />);
  }

  return (
    <div id="timeLabelContainer">
      {timeLabels}
    </div>
  )
}

export default TimeLabelContainer;