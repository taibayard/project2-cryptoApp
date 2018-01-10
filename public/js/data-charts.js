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