let coinValues = [];
let coinOwned = [];
let coinNames = [];
let unsupportedCoins = [];
let walletValue = 0;
//run at start : it will seperate unsupported coins & handle arrays to be used with graphs
(function(){
    for (let i = 0; i < coins.length; i++) {
        if(coins[i].value===null||coins[i].value<0){
            unsupportedCoins.push(coins[i]);
        }else{
            coinNames.push(coins[i].name);
            coinOwned.push(coins[i].owned);
            coinValues.push(parseFloat(coins[i].value)*parseFloat(coins[i].owned));
            walletValue = walletValue + parseFloat(coins[i].value)*parseFloat(coins[i].owned);
        }
    }
}());

//rest of code
function randomColor(){
    let colors =["RGBA(205, 92, 92,1)","RGB(240, 128, 128)","RGB(250, 128, 114)","RGB(233, 150, 122)","RGB(255, 160, 122)","RGB(220, 20, 60)","RGB(255, 0, 0)","RGB(178, 34, 34)","RGB(139, 0, 0)","RGB(255, 192, 203)","RGB(255, 182, 193)","RGB(255, 105, 180)","RGB(255, 20, 147)","RGB(199, 21, 133)","RGB(219, 112, 147)","RGB(255, 160, 122)","RGB(255, 127, 80)","RGB(255, 99, 71)","RGB(255, 69, 0)","RGB(255, 140, 0)","RGB(255, 165, 0)","RGB(255, 215, 0)","RGB(255, 255, 0)","RGB(255, 255, 224)","RGB(255, 250, 205)","RGB(250, 250, 210)","RGB(255, 239, 213)","RGB(255, 228, 181)","RGB(255, 218, 185)","RGB(238, 232, 170)","RGB(240, 230, 140)","RGB(189, 183, 107)","RGB(230, 230, 250)","RGB(216, 191, 216)","RGB(221, 160, 221)","RGB(238, 130, 238)","RGB(218, 112, 214)","RGB(255, 0, 255)","RGB(255, 0, 255)","RGB(186, 85, 211)","RGB(147, 112, 219)","RGB(102, 51, 153)","RGB(138, 43, 226)","RGB(148, 0, 211)","RGB(153, 50, 204)","RGB(139, 0, 139)","RGB(128, 0, 128)","RGB(75, 0, 130)","RGB(106, 90, 205)","RGB(72, 61, 139)","RGB(123, 104, 238)","RGB(173, 255, 47)","RGB(127, 255, 0)","RGB(124, 252, 0)","RGB(0, 255, 0)","RGB(50, 205, 50)","RGB(152, 251, 152)","RGB(144, 238, 144)","RGB(0, 250, 154)","RGB(0, 255, 127)","RGB(60, 179, 113)","RGB(46, 139, 87)","RGB(34, 139, 34)","RGB(0, 128, 0)","RGB(0, 100, 0)","RGB(154, 205, 50)","RGB(107, 142, 35)","RGB(128, 128, 0)","RGB(85, 107, 47)","RGB(102, 205, 170)","RGB(143, 188, 139)","RGB(32, 178, 170)","RGB(0, 139, 139)","RGB(0, 128, 128)","RGB(0, 255, 255)","RGB(0, 255, 255)","RGB(224, 255, 255)","RGB(175, 238, 238)","RGB(127, 255, 212)","RGB(64, 224, 208)","RGB(72, 209, 204)","RGB(0, 206, 209)","RGB(95, 158, 160)","RGB(70, 130, 180)","RGB(176, 196, 222)","RGB(176, 224, 230)","RGB(173, 216, 230)","RGB(135, 206, 235)","RGB(135, 206, 250)","RGB(0, 191, 255)","RGB(30, 144, 255)","RGB(100, 149, 237)","RGB(123, 104, 238)","RGB(65, 105, 225)","RGB(0, 0, 255)","RGB(0, 0, 205)","RGB(0, 0, 139)","RGB(0, 0, 128)","RGB(25, 25, 112)","RGB(255, 248, 220)","RGB(255, 235, 205)","RGB(255, 228, 196)","RGB(255, 222, 173)","RGB(245, 222, 179)","RGB(222, 184, 135)","RGB(210, 180, 140)","RGB(188, 143, 143)","RGB(244, 164, 96)","RGB(218, 165, 32)","RGB(184, 134, 11)","RGB(205, 133, 63)","RGB(210, 105, 30)","RGB(139, 69, 19)","RGB(160, 82, 45)","RGB(165, 42, 42)","RGB(128, 0, 0)","RGB(255, 255, 255)","RGB(255, 250, 250)","RGB(240, 255, 240)","RGB(245, 255, 250)","RGB(240, 255, 255)","RGB(240, 248, 255)","RGB(248, 248, 255)","RGB(245, 245, 245)","RGB(255, 245, 238)","RGB(245, 245, 220)","RGB(253, 245, 230)","RGB(255, 250, 240)","RGB(255, 255, 240)","RGB(250, 235, 215)","RGB(250, 240, 230)","RGB(255, 240, 245)","RGB(255, 228, 225)","RGB(220, 220, 220)","RGB(211, 211, 211)","RGB(192, 192, 192)","RGB(169, 169, 169)","RGB(128, 128, 128)","RGB(105, 105, 105)","RGB(119, 136, 153)","RGB(112, 128, 144)","RGB(47, 79, 79)","RGB(0, 0, 0)"];
    let ranMax = Math.floor((Math.random() * colors.length-1) + 10)
    let superRandom = Math.floor((Math.random() * ranMax) + 1);
    return colors[superRandom];
}
function randomColorsArray(n){
    let colors = [];
    while(n>0){
        colors.push(randomColor());
        n--;
    }
    return colors;
}
//doughnut
(function() {
    var ctxD = document.getElementById("dash-doughnut").getContext('2d');
    let backgroundColors = randomColorsArray(coins.length);
    var myLineChart = new Chart(ctxD, {
        type: 'doughnut',
        data: {
            labels: coinNames,
            datasets: [{
                data: coinValues,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: backgroundColors
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

document.getElementById("user-worth").innerText = "$" + walletValue.toFixed(2);

