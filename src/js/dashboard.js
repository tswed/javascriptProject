window.onload = loadPageInfo;
var calendar;

function loadPageInfo() {
    //loadTopBibles();

    loadCalendar();
}

function loadCalendar() {
    var calDate = new Date();

    var div = document.createElement("div");
    calendar = document.createElement("table");
    calendar.id = "calendar_table";

    div.appendChild(calendar);

    writeCalTitle(calDate);
    writeDayNames();
    //writeCalDays(calDate);
    document.getElementById("calendarSpot").insertBefore(calendar, document.getElementById("calendarSpot").firstChild);
}

function writeCalTitle(calendarDay) {
    var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
        "November", "December"];

    var thisMonth = calendarDay.getMonth();
    var thisYear = calendarDay.getFullYear();

    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.id = "calendar_head";
    th.colSpan = 7;
    th.textContent = monthName[thisMonth] + " " + thisYear;

    th.appendChild(tr);
    calendar.appendChild(th);
}

function writeDayNames() {
    var dayName = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

    var tr = document.createElement("tr");
    var th = document.createElement("th");
    th.id = "calendar_weekdays";

    for (var i = 0; i < dayName.length; i++) {
        th.textContent = th.textContent + " " + dayName[i];
    }

    tr.appendChild(th);

    calendar.appendChild(tr);
}

function daysInMonth(calendarDay) {
    var thisYear = calendarDay.getFullYear();
    var thisMonth = calendarDay.getMonth();
    var dayCount = [31,28,31,30,31,30,31,31,30,31,30,31];

    if (thisYear % 4 == 0) {
        if ((thisYear % 100 != 0) || (thisYear % 400 == 0)) {
            dayCount[1] = 29; //Leap year
        }
    }

    return dayCount[thisMonth];  //return the number of days in the month
}

function writeCalDays(calendarDay) {
    var currentDay = calendarDay.getDate();

    //determine the starting day of the week
    var dayCount = 1;
    var totalDays = daysInMonth(calendarDay);
    calendarDay.setDate(1); //set the date to the first day of the month
    var weekDay = calendarDay.getDay(); //day of week of the first day

    //write blank cells preceding the starting day
    document.createElement("<tr>");
    for (var i=0; i < weekDay; i++) {
        document.createElement("<td></td>");
    }

    //write cells for each day of the month
    while (dayCount <= totalDays) {
        //write the table rows and cells
        if (weekDay == 0)
            document.createElement("<tr>");

        if (dayCount == currentDay) {
            //highlight the current day
            document.createElement("<td class='calendar_dates' id='calendar_today'>" + dayCount + "</td>");
        } else {
            //display the day as usual
            document.createElement("<td class='calendar_dates'>" + dayCount + "</td>");
        }

        if (weekDay == 6)
            document.createElement("</tr>");

        //move to the next day
        dayCount++;
        calendarDay.setDate(dayCount);
        weekDay = calendarDay.getDay();
    }

    document.write("</tr>");
}


function loadTopBibles() {
    var mysql = require('mysql');

    var connection = mysql.createConnection({
        host: 'peak.crossway.local',
        user: 'tswed',
        password: 'sKC7vVvPuxWe7fnaO6DcucAU',
        database: 'gnpcb'
    });

    connection.connect();

    connection.query('select * from', function(err, result) {
        //result is the query results
    });
}
