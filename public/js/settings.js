//function to be fired when a wallet drop down item has been clicked
function selectedWalletType(e){
	try{
		//removing previous selection id
		document.getElementById("selectedWalletDropdown").removeAttribute("id");
		e.setAttribute("id","selectedWalletDropdown");
	}catch(err){
		//was no previous item selected set item
		e.setAttribute("id","selectedWalletDropdown")
	}
	document.getElementById("walletTypeInput").value = e.innerText;
}

//IFFE

//settings nav innertext when user visits settings page
(function(){
	document.getElementById("nav-name").innerText = "Settings";
})();
//adding event listeners for wallet type drop down items
(function(){
	let x = document.getElementsByClassName("wallet-dropdown-item");
	for(let i =0;i<x.length;i++){
		x[i].addEventListener("click",function(){
			console.log(x[i],"Was clicked");
			selectedWalletType(this);
		})
	}
})();