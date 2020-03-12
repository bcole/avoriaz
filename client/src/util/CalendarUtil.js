
export function getScheduleData(id, masterSchedule, setMasterSchedule, setFilteredSchedule) {
  const promises = [];

  // Get master schedule with all events
  if(!masterSchedule) {
    promises.push(
      fetch(`/api/schedule`)
        .then(res => res.json())
        .catch(err => {
          console.log(err);
        })
    );
  }

  // Get specific schedule, with IDs
  promises.push(
    fetch(`/api/schedule/saved?id=${id}`)
      .then(res => res.json())
      .catch(err => {
        console.log(err);
      })
  );

  Promise.all(promises).then(responses => {
    let mSchedule = masterSchedule;
    if(responses.length === 2) {
      setMasterSchedule(mSchedule = responses[0]);
    }

    const specificSchedule = responses[responses.length-1];
    
    setFilteredSchedule(
      mSchedule.schedule.map(({ name, longName, venues }) => {
        return {
          name,
          longName,
          events: venues.flatMap(venue => {
            return venue.events.map(event => ({...event, venue: venue.name}));
          }).filter(event => 
            specificSchedule[event.id]
          ).sort((a, b) => 
            a.startTime - b.startTime
          )
        };
      })
    )
  });
}