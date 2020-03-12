import React from 'react';
import Event from './Event';
import '../style/EventsContainer.css';

function EventsContainer(props) {
  const s = props.filteredSchedule.events;
  function buildConflictGraph() {
    return props.filteredSchedule.events.map((e, e_i) => {
      const conflictingEvents = [];

      // Look at events before this one.  Is its end time after this start time?
      for(let i=0; i<e_i; i++) {
        if(s[i].endTime > e.startTime) {
          conflictingEvents.push(i);
        }
      }

      // Look at events after this one.  Is it's start time before this end time?
      for(let i=e_i + 1; i<s.length; i++) {
        if(s[i].startTime < e.endTime) {
          conflictingEvents.push(i);
        }
      }

      return conflictingEvents;
    });
  }

  function buildMaxConflicts(g) {
    const maxConflicts = [];
    for(let i=0; i<g.length; i++) {
      // All conflicting events to this event.
      const conflicts = g[i];
      let max = 0;

      // For each conflict, check it's conflicts.
      for(let j=0; j<g[i].length; j++) {
        const conflictsConflicts = g[conflicts[j]];
        const commonConflicts = conflicts.filter(c => conflictsConflicts.includes(c));
        max = Math.max(commonConflicts.length + 1, max);
      }

      maxConflicts.push(max);
    }
    return maxConflicts;
  }

  function buildPositions(conflictGraph, maxConflicts) {
    const positions = new Array(conflictGraph.length).fill(-1);

    for(let i=0; i<conflictGraph.length; i++) {
      // Keep track of what positions are used.
      // const positionsUsed = new Array(maxConflicts[i]).map((p, p_i) => ({position: p_i, used: false}));
      const positionsUsed = new Array(maxConflicts[i] + 1).fill(false);

      const conflicts = conflictGraph[i];

      // Fill in already assigned positions.
      for(const conflict of conflicts) {
        if(positions[conflict] !== -1) {
          positionsUsed[positions[conflict]] = true;
        }
      }

      const freePosition = positionsUsed.findIndex(used => !used);
      positions[i] = freePosition;
    }

    return positions;
  }

  const conflictGraph = buildConflictGraph();
  const maxConflicts = buildMaxConflicts(conflictGraph);
  const positions = buildPositions(conflictGraph, maxConflicts);

  const events = props.filteredSchedule.events.map((event, i) => 
    <Event event={event} startTime={props.startTime} endTime={props.endTime} position={positions[i]} maxConflicts={maxConflicts[i]} />
  );

  return (
    <div id="eventsContainer"><div id="eventsPadding">
      {events}
    </div></div>
  )
}

export default EventsContainer;