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
function selectedNavItem(e){
    //removing acitve classes
    document.getElementsByClassName("selected-settings-nav")[0].classList.remove("selected-settings-nav");
    document.getElementsByClassName("active-settings-item")[0].classList.remove("active-settings-item");
    //setting new ones
    e.classList.add("selected-settings-nav");
    console.log(e.innerText);
    switch(e.innerText.toLowerCase()){
        case "profile":
            document.getElementById("profile-settings-wrapper").classList.add("active-settings-item");
        break;
        case "wallets":
            document.getElementById("add-wallet-wrapper").classList.add("active-settings-item");
        break;
        default:
            document.getElementById("profile-settings-wrapper").classList.add("active-settings-item");
        break;
    }
}
//IFFE
//event listeners for settings nav items
(function(){
    let x = document.getElementsByClassName("settings-nav-li");
    for(let i=0;i<x.length;i++){
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
			url : "/profile/settings/"+address,
			method:"DELETE"
		}).then(function(data){
			window.location.href="/profile/settings";
		});
	});
})();
