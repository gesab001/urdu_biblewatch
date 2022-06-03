var pageID = "DonationPage";
function bindEvents() {

    setActivePage("DonationPage");
	tizen.preference.setValue("fromOptionsPage", false);

	var scanQRCode = LANG_JSON_DATA["TRANSLATIONS"]["DONATIONS_PAGE"]["scanQRCode"];
	document.getElementById("scanQRCode").innerHTML = scanQRCode;
}


window.onload = function() {
	bindEvents();
};