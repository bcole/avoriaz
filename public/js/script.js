
function initSchedule() {
    let schedule, startTime, endTime, granularity, savedSchedule;
    const container = document.getElementById("container");
    let modalDiv = null;

    // Get schedule from backend
    const request = new XMLHttpRequest();
    request.open('GET', '/api/schedule', true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            ({schedule, startTime, endTime, granularity} = JSON.parse(this.response));
            
            // Render calendar
            addDayPicker();
            addHeading();
            addBody(0);
        } else {
            // We reached our target server, but it returned an error
            console.log("ERROR1");
        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
        console.log("ERROR2");
    };

    request.send();

    savedSchedule = JSON.parse(localStorage.getItem("schedule")) || {};
    // savedSchedule = {
    //     event1: true,
    //     event2: true
    // }
    
    function addDayPicker() {
        const dayPicker = document.getElementById("dayPicker");
        let curSelectedDay = 0;
        const daySpans = [];

        for(let i=0; i<schedule.length; i++) {
            function spanClickHandler(e) {
                // Should dropdown?
                if(this.classList.contains("selectedDay") && this.classList.contains("dayLongSpan")) {
                    for(const span of daySpans) {
                        if(span.longSpan.classList.contains("selectedDay")) continue;
                        span.longSpan.style.display = (span.longSpan.style.display === "block") ? "none" : "block";
                    }
                } else {    // Should select
                    for(const span of daySpans) {
                        span.longSpan.style.display = "";
                    }
                    daySpans[curSelectedDay].shortSpan.classList.remove("selectedDay");
                    daySpans[curSelectedDay].longSpan.classList.remove("selectedDay");
                    daySpans[i].shortSpan.classList.add("selectedDay");
                    daySpans[i].longSpan.classList.add("selectedDay");
                    curSelectedDay = i;
                    addBody(i);
                }
            }

            const day = schedule[i];
            const daySpan = document.createElement("span");
            const dayLongSpan = document.createElement("span");
            daySpan.appendChild(document.createTextNode(day.name));
            dayLongSpan.appendChild(document.createTextNode(day.longName));
            daySpan.classList.add("daySpan");
            dayLongSpan.classList.add("dayLongSpan");
            if(i === 0) {
                daySpan.classList.add("selectedDay");
                dayLongSpan.classList.add("selectedDay");
            }
            daySpan.addEventListener("click", spanClickHandler);
            dayLongSpan.addEventListener("click", spanClickHandler);
            dayPicker.appendChild(daySpan);
            dayPicker.appendChild(dayLongSpan);
            daySpans.push({shortSpan: daySpan, longSpan: dayLongSpan});
        }
    }

    function addHeading() {
        const scheduleHead = document.getElementById("scheduleHead");
        const headingRow = document.createElement("tr");

        // Empty cell
        headingRow.appendChild(document.createElement("td"));

        for(let i=startTime; i<=endTime; i++) {
            const headingCell = document.createElement("th");
            const headingText = document.createTextNode(i > 23 ? i == 24 ? "12:00 AM" : i-24 + ":00 AM" : i-12 + ":00 PM");
            headingCell.appendChild(headingText);
            headingCell.setAttribute("colspan", granularity);
            headingRow.appendChild(headingCell);
        }

        scheduleHead.appendChild(headingRow);
    }

    function addBody(day) {
        const scheduleBody = document.getElementById("scheduleBody");
        scheduleBody.innerHTML = "";
        if(modalDiv) {
            modalDiv.parentElement.removeChild(modalDiv);
            modalDiv = null;
        }
        for(const venue of schedule[day].venues) {
            const newRow = document.createElement("tr");
            const newHeading = document.createElement("th");
            const newHeadingText = document.createTextNode(venue.name);
            newHeading.appendChild(newHeadingText);
            newRow.appendChild(newHeading);

            let curTime=startTime;
            for(const eventData of venue.events) {
                // Add any beginning empty cells
                for(let i=Math.ceil(curTime); i<Math.floor(eventData.startTime); i++) {
                    const emptyCell = document.createElement("td");
                    emptyCell.setAttribute("colspan", granularity);
                    newRow.appendChild(emptyCell);
                    curTime = i+1;
                }
                const partialStart=curTime*granularity;
                const partialFinish=eventData.startTime*granularity;
                if(partialFinish > partialStart) {
                    const emptyCell = document.createElement("td");
                    emptyCell.setAttribute("colspan", partialFinish-partialStart);
                    if(partialFinish % granularity != 0) {
                        emptyCell.className = "partialCell"
                    }
                    newRow.appendChild(emptyCell);
                }

                // Add real "data" cell
                const colspan = (eventData.endTime - eventData.startTime) * granularity;
                const newCell = document.createElement("td");
                const newDiv = document.createElement("div");
                const newText = document.createTextNode(eventData.name);
                newDiv.appendChild(newText);
                if(eventData.subText) {
                    const subText = document.createElement("small");
                    subText.appendChild(document.createTextNode(eventData.subText));
                    newDiv.appendChild(subText);
                }
                newDiv.classList.add("hasSet");
                if(savedSchedule[eventData.id]) {
                    newDiv.classList.add("savedSet");
                }
                newDiv.addEventListener('click', function(clickEvent) {
                    if(modalDiv) {
                        modalDiv.parentElement.removeChild(modalDiv);
                    }
                    container.appendChild(modalDiv = createInfoModal(eventData, venue, clickEvent));
                    clickEvent.stopPropagation();
                });
                eventData.div = newDiv;
                newCell.appendChild(newDiv);
                newCell.setAttribute("colspan", colspan);
                if(eventData.endTime % 1 != 0) {
                    newCell.className = "partialCell"
                }
                newRow.appendChild(newCell);
                curTime = eventData.endTime;
            }

            // Add final empty cells
            const lastEndTime = (venue.events.length) ? venue.events[venue.events.length-1].endTime : 0;
            if(lastEndTime%1 !== 0) {
                const partialStart = lastEndTime*granularity;
                const partialFinish = Math.ceil(lastEndTime) * granularity;
                const emptyCell = document.createElement("td");
                emptyCell.setAttribute("colspan", partialFinish-partialStart);
                newRow.appendChild(emptyCell);
                curTime = Math.ceil(lastEndTime);
            }
            for(let i=curTime; i<=endTime; i++) {
                const emptyCell = document.createElement("td");
                emptyCell.setAttribute("colspan", granularity);
                newRow.appendChild(emptyCell);
            }

            scheduleBody.appendChild(newRow);
        }

        document.addEventListener('click', function() {
            if(modalDiv) {
                modalDiv.parentElement.removeChild(modalDiv);
                modalDiv = null;
            }
        });
    }

    function createInfoModal(eventData, venue, clickEvent) {
        const div = document.createElement("div");
        div.className = "infoModal";
        div.appendChild(document.createTextNode(eventData.name));
        div.style.top = clickEvent.y;
        div.style.left = Math.min(clickEvent.x, window.innerWidth-220); // Don't let modal be pushed too far right.

        if(eventData.subText) {
            const subP = document.createElement("p");
            subP.appendChild(document.createTextNode(eventData.subText));
            div.appendChild(subP);
        }

        const timeP = document.createElement("p");
        timeP.appendChild(document.createTextNode(getTime(eventData.startTime) + " - " + getTime(eventData.endTime)));
        div.appendChild(timeP);

        const venueP = document.createElement("p");
        venueP.appendChild(document.createTextNode(venue.name));
        div.appendChild(venueP);

        const saveDiv = document.createElement("div");
        saveDiv.className = 'saveContainer';
        const saveButton = document.createElement("button");
        const saveText = document.createTextNode(savedSchedule[eventData.id] ? "Remove from Schedule" : "Add to Schedule");
        saveButton.appendChild(saveText);
        saveButton.addEventListener('click', function() {
            if(!savedSchedule[eventData.id]) {
                eventData.div.classList.add("savedSet");
                savedSchedule[eventData.id] = true;
                saveText.nodeValue = "Remove from Schedule";
            } else {
                eventData.div.classList.remove("savedSet");
                savedSchedule[eventData.id] = false;
                saveText.nodeValue = "Add to Schedule";
            }
            localStorage.setItem("schedule", JSON.stringify(savedSchedule));
        });
        saveDiv.appendChild(saveButton);
        div.appendChild(saveDiv);

        const xDiv = document.createElement("div");
        xDiv.className = 'x';
        xDiv.appendChild(document.createTextNode("\u2715"));
        xDiv.addEventListener('click', function() {
            div.parentElement.removeChild(div);
            modalDiv = null;
        });
        div.appendChild(xDiv);
        div.addEventListener('click', e => e.stopPropagation());

        return div;
    }

    function getTime(time) {
        const hours = Math.floor(time);
        const minutes = ('' + (time - hours) * 60).padStart(2, '0');
        return hours > 23 ? hours == 24 ? `12:${minutes} AM` : `${hours-24}:${minutes} AM` : `${hours-12}:${minutes} PM`
    }
}


function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

  ready(initSchedule);