/**
 * Created by tswed on 4/28/16.
 */

window.onload = loadPage;

function loadPage() {
    loadCalendar();
    loadPieChart();
    loadBarChart();
}

function loadPieChart() {
    var studyTotal = Math.floor((Math.random() * 100) + 1);
    var journalingTotal = Math.floor((Math.random() * 100) + 1);
    var thinlineTotal = Math.floor((Math.random() * 100) + 1);
    var compactTotal = Math.floor((Math.random() * 100) + 1);
    var outreachTotal = Math.floor((Math.random() * 100) + 1);

    var topBibles = document.getElementById("topBibles");
    var pieChart = new Chart(topBibles, {
        type: 'pie',
        data: {
            labels: [
                "Study",
                "Journaling",
                "Thinline",
                "Compact",
                "Outreach"
            ],
            datasets: [
                {
                    data: [studyTotal, journalingTotal, thinlineTotal, compactTotal, outreachTotal],
                    backgroundColor: [
                        "#74828F",
                        "#96C0CE",
                        "#90C5A9",
                        "#525564",
                        "#BEB9B5"
                    ],
                    hoverBackgroundColor: [
                        "#5D4C46",
                        "#5D4C46",
                        "#5D4C46",
                        "#5D4C46",
                        "#5D4C46"
                    ]
                }]
        }
    });
}

function loadBarChart() {
    var accountCanvas = document.getElementById("topAccounts");

    var accounts = [];

    for (var i = 0; i < 5; i++) {
        accounts[i] = Math.floor((Math.random() * 100) + 1);
    }

    accounts.sort(function(a, b){return b-a});

    var barChart = new Chart(accountCanvas, {
        type: 'bar',
        data: {
            labels: ["Amazon", "CBD", "Lifeway", "Family Christian", "Ingram"],
            datasets: [{
                label: 'Top 5 Accounts',
                data: [accounts[0], accounts[1], accounts[2], accounts[3], accounts[4]],
                backgroundColor: [
                    "#BEB9B5",
                    "#525564",
                    "#90C5A9",
                    "#96C0CE",
                    "#74828F"
                ]
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}
