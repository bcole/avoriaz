
function initSchedule() {
    let schedule, startTime, endTime, granularity;

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
        for(const rowData of schedule[day].venues) {
            const newRow = document.createElement("tr");
            const newHeading = document.createElement("th");
            const newHeadingText = document.createTextNode(rowData.name);
            newHeading.appendChild(newHeadingText);
            newRow.appendChild(newHeading);

            let curTime=startTime;
            for(const eventData of rowData.events) {
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
                newDiv.className = "hasSet";
                newCell.appendChild(newDiv);
                newCell.setAttribute("colspan", colspan);
                if(eventData.endTime % 1 != 0) {
                    newCell.className = "partialCell"
                }
                newRow.appendChild(newCell);
                curTime = eventData.endTime;
            }

            // Add final empty cells
            const lastEndTime = (rowData.events.length) ? rowData.events[rowData.events.length-1].endTime : 0;
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