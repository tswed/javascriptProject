window.onload = loadPageInfo;
var calendar;
var th;

function loadPageInfo() {
    loadCalendar();
    loadSalesTables();
}

function loadCalendar() {
    var calDate = new Date();

    var div = document.createElement("div");
    calendar = document.createElement("table");
    calendar.id = "calendar_table";

    div.appendChild(calendar);

    writeCalTitle(calDate);
    writeDayNames();
    writeCalDays(calDate);
    document.getElementById("calendarSpot").insertBefore(calendar, document.getElementById("calendarSpot").firstChild);
}

function writeCalTitle(calendarDay) {
    var monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
        "November", "December"];

    var thisMonth = calendarDay.getMonth();
    var thisYear = calendarDay.getFullYear();

    var tr = document.createElement("tr");
    th = document.createElement("th");
    th.id = "calendar_head";
    th.colSpan = 7;
    th.innerHTML = monthName[thisMonth] + " " + thisYear;

    tr.appendChild(th);
    calendar.appendChild(tr);
}

function writeDayNames() {
    var dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    var tr2 = document.createElement("tr");

    for (var i = 0; i < dayName.length; i++) {
        var weekDays = document.createElement("th");
        weekDays.className = "calendar_weekdays";
        weekDays.innerHTML = dayName[i] + " ";
        tr2.appendChild(weekDays);
    }

    calendar.appendChild(tr2);
}

function writeCalDays(calendarDay) {
    var currentDay = calendarDay.getDate();

    //determine the starting day of the week
    var dayCount = 1;
    var totalDays = daysInMonth(calendarDay);
    calendarDay.setDate(1); //set the date to the first day of the month
    var weekDay = calendarDay.getDay(); //day of week of the first day

    //write blank cells preceding the starting day
    var tr = document.createElement("tr");
    var td;


    for (var i = 0; i < weekDay; i++) {
        td = document.createElement("td");
        tr.appendChild(td);
    }

    calendar.appendChild(tr);
    var newTR = document.createElement("tr");
    var currentRow = tr;

    //write cells for each day of the month
    while (dayCount <= totalDays) {
        if (weekDay == 0) {
            newTR = document.createElement("tr");
            currentRow = newTR;
        }

        if (dayCount == currentDay) {
            //highlight the current day
            var td2 = document.createElement("td");
            td2.innerHTML = dayCount;
            td2.className = "calendar_dates";
            td2.id = "calendar_today";
            newTR.appendChild(td2);
        } else {
            //display the day as usual
            var dayNum = document.createElement("td");
            dayNum.className = "calendar_dates";
            dayNum.innerHTML = dayCount;
            currentRow.appendChild(dayNum);
        }

        if (weekDay == 6) {
            calendar.appendChild(currentRow);
        }

        //move to the next day
        dayCount++;
        calendarDay.setDate(dayCount);
        weekDay = calendarDay.getDay();
    }
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

function loadSalesTables() {
    var bibleTable = document.createElement("table");
    var bookTable = document.createElement("table");
    bibleTable.className = "table table-striped";
    bookTable.className = "table table-striped";

    bibleTable.appendChild(createHeader());
    bookTable.appendChild(createHeader());

    var bookRowNum = 0;
    var bibleRowNum = 0;
    var i = 0;

    while (bibleRowNum < 10) {
        var tr = document.createElement("tr");
        var titleData = document.createElement("td");
        titleData.innerHTML = sales[i].Title;

        var isbnData = document.createElement("td");
        isbnData.innerHTML = sales[i].ISBN;

        var netUnitsData = document.createElement("td");
        netUnitsData.innerHTML = sales[i].Net_Units;

        var netSalesData = document.createElement("td");
        netSalesData.innerHTML = sales[i].Net_Sales;

        tr.appendChild(titleData);
        tr.appendChild(isbnData);
        tr.appendChild(netUnitsData);
        tr.appendChild(netSalesData);

        if (sales[i++].Type == "Bible") {
            bibleTable.appendChild(tr);
            bibleRowNum++;
        } else if (bookRowNum < 10) {
            bookTable.appendChild(tr);
            bookRowNum++;
        }
    }

    document.getElementById("bibleDashboardTable").appendChild(bibleTable);
    document.getElementById("bookDashboardTable").appendChild(bookTable);
}

function createHeader() {
    var rowHead = document.createElement("tr");

    var title = document.createElement("th");
    title.innerHTML = "Title";

    var isbn = document.createElement("th");
    isbn.innerHTML = "ISBN";

    var netUnits = document.createElement("th");
    netUnits.innerHTML = "Net Units";

    var netSales = document.createElement("th");
    netSales.innerHTML = "Net Sales";

    rowHead.appendChild(title);
    rowHead.appendChild(isbn);
    rowHead.appendChild(netUnits);
    rowHead.appendChild(netSales);

    return rowHead;
}

