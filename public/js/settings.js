//function to be fired when a wallet drop down item has been clicked
function selectedWalletType(e) {
    try {
        //removing previous selection id
        document.getElementById("selectedWalletDropdown").removeAttribute("id");
        e.setAttribute("id", "selectedWalletDropdown");
    } catch (err) {
        //was no previous item selected set item
        e.setAttribute("id", "selectedWalletDropdown")
    }
    document.getElementById("walletTypeInput").value = e.innerText;
}

function selectedNavItem(e) {
    //removing acitve classes
    document.getElementsByClassName("selected-settings-nav")[0].classList.remove("selected-settings-nav");
    document.getElementsByClassName("active-settings-item")[0].classList.remove("active-settings-item");
    //setting new ones
    e.classList.add("selected-settings-nav");
    console.log(e.innerText);
    switch (e.innerText.toLowerCase()) {
        case "profile":
            document.getElementById("profile-settings-wrapper").classList.add("active-settings-item");
            break;
        case "wallets":
            document.getElementById("add-wallet-wrapper").classList.add("active-settings-item");
            break;
        case "notifications":
            document.getElementById("notifications-settings-wrapper").classList.add("active-settings-item");
            break;
        default:
            document.getElementById("profile-settings-wrapper").classList.add("active-settings-item");
            break;
    }
}
//IFFE
//event listeners for settings nav items
(function() {
    let x = document.getElementsByClassName("settings-nav-li");
    for (let i = 0; i < x.length; i++) {
        x[i].addEventListener("click", function() {
            selectedNavItem(this);
        })
    }
})();

//adding event listeners for wallet type drop down items
(function() {
    let x = document.getElementsByClassName("wallet-dropdown-item");
    for (let i = 0; i < x.length; i++) {
        x[i].addEventListener("click", function() {
            console.log(x[i], "Was clicked");
            selectedWalletType(this);
        })
    }
})();
//adding event listeners for wallete delete buttons
(function() {
    $(".wallet-address-delete-btn").click(function(e) {
        e.preventDefault();
        let address = this.parentElement.getElementsByTagName("a")[0].innerText;
        console.log(address);
        $.ajax({
            url: "/profile/settings/" + address,
            method: "DELETE"
        }).then(function(data) {
            window.location.href = "/profile/settings";
        });
    });
})();

/*Notifications functions*/
//adds data to dropdown to carrier type & sets event listener for send code btn
(function(){
    var carrier = ["AT&T Enterprise Paging", "AT&T Wireless", "Alaska Communication Systems", "Alltel ", "Australia T-Mobile/Optus Zoo (Optus)↵", "Bell Mobility & Solo Mobile", "Bluegrass Cellular", "Boost Mobile", "Cellcom", "Cellular South", "Centennial Wireless", "Cincinnati Bell", "Cingular", "Cingular Prepaid", "Cox Wireless", "Cricket Wireless", "Digicel St. Lucia", "Fido", "Google Voice", "GCI Alask Digitel (GCI)", "IV Cellular (Illinois Valley Cellular)↵", "i wireless (iWireless)", "Koodo Mobile", "Lime", "Metro PCS", "Mobilicity", "MTS Mobility", "NET10", "Nex-Tech", "nTelos", "O2 (M-mail)", "O2 Powered Networks", "O2 UK", "Optus", "Orange", "PC Telecom", "PTel Mobile", "Pioneer Cellular", "Pocket Wireless", "Republic Wireless", "Rogers Wireless", "SaskTel", "Sprint", "Straight Talk", "Syringa Wireless", "T-Mobile", "T-Mobile UK", "Telstra", "Telus Mobility", "Three", "Tracfone", "US Cellular", "Unicel", "Verizon", "Viaero", "Virgin Mobile", "Virgin Mobile Canada", "Virgin Mobile UK", "Vodafone", "Wind Mobile"];
    var extension = ["page.att.net", "txt.att.net", "msg.acsalaska.com", "text.wireless.alltel.com", "optusmobile.com.au", "txt.bell.ca", "sms.bluecell.com", "myboostmobile.com", "cellcom.quiktxt.com", "cellularsouth1.com", "cwemail.com", "gocbw.com", "cingular.com", "cingulartext.com", "Discontinued 2012↵", "mms.cricketwireless.net", "digitextlc.com", "fido.ca", "Not an actual carrier ↵", "mobile.gci.net", "ivctext.com", "iwspcs.net", "msg.telus.com", "txt2lime.com", "mymetropcs.com", "No email-to-SMS service↵", "text.mtsmobility.com", "Determine NET10's carrier ↵", "sms.nextechwireless.com", "pcs.ntelos.com", "mmail.co.uk", " ", "o2imail.co.uk", "optusmobile.com.au↵Appears they charge for the service", "orange.net", "mobiletxt.ca", "tmomail.net ↵", "zsend.com", "sms.pocket.com", "text.republicwireless.com", "pcs.rogers.com", "sms.sasktel.com", "messaging.sprintpcs.com", "Determine Straight Talk's carrier", "rinasms.com", "tmomail.net", "t-mobile.uk.net", "onlinesms.telstra.com", "msg.telus.com", "three.co.uk", "Determine Tracfone's carrier↵", "email.uscc.net", "utext.com", "vtext.com", "viaerosms.com", "vmobl.com", "vmobile.ca", "vxtras.com", "No email-to-SMS service↵", "txt.windmobile.ca"];
    for(let i =0;i<carrier.length;i++){
        let a = document.createElement("a");
        a.setAttribute("class","carrier-dropdown-item dropdown-item");
        a.innerText = carrier[i];
        a.addEventListener("click",function(){
           document.getElementById("carrierTypeInput").value = this.getAttribute("extension");
        });
        a.setAttribute("extension",extension[i]);
        document.getElementsByClassName("carrier-type-dropdown")[0].appendChild(a);
    }

    $("#text-submit").click(function(e) {
        e.preventDefault();
        let address = document.getElementById("carrierTypeInput").value;
        if((address.indexOf("↵")&&address.indexOf("Not")&&address.indexOf("Discontinued") ) === -1){
            $.ajax({
                url: "/profile/settings/addphone/" + address,
                method: "POST"
            });
        }else{
            console.warn("Unsupported option was selected");
        }

    });
})();



//handle submit/verify button
