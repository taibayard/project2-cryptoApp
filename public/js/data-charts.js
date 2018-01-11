//using iify functions for variable scopes.

//doughnut
(function() {
    var ctxD = document.getElementById("dash-doughnut").getContext('2d');
    var myLineChart = new Chart(ctxD, {
        type: 'doughnut',
        data: {
            labels: ["Bitcoin", "BitcoinCash", "Ethereum", "Litecoin", "Kin"],
            datasets: [{
                data: [3002.38, 12.93, 1120.00, 50.01, 120.00],
                backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
                hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
            }]
        },
        options: {
            responsive: false
        }
    });
}());
(function() {
        //line
        var ctxL = document.getElementById("dash-line").getContext('2d');
        var myLineChart = new Chart(ctxL, {
            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "Account Worth (USD)",
                    backgroundColor: "rgba(50, 160, 52,0.2)",
                    borderWidth: 2,
                    borderColor: "rgba(50, 160, 52,1)",
                    pointBackgroundColor: "rgba(50, 160, 52,1)",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 1,
                    pointRadius: 4,
                    pointHoverBackgroundColor: "rgba(50, 160, 52,1)",
                    pointHoverBorderColor: "rgba(50, 160, 52,1)",
                    data: [332, 120, 209, 90, 330, 345, 330]
                }]
            },
            options: {
                responsive: false
            }
        });
}());