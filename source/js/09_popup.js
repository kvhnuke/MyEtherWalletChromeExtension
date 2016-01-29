function reloadPopupAccounts() {
	getWalletsArr(function(wallets) {
		$("#popupMainAccountTbl > tbody").empty();
		for (var i = 0; i < wallets.length; i++) {
			var cobj = wallets[i];
            if($('.quicksend').length)
                var tblRow = getQuickSendRow(i,cobj.addr,cobj.nick);
            else if($('.donate').length)
                var tblRow = getQuickSendRow(i,cobj.addr,cobj.nick);
            else if($(".bAction").length)
                var tblRow = getAccountInfoRow(i,cobj.addr,cobj.nick);
			$("#popupMainAccountTbl > tbody").append(tblRow);
            setWalletBalance('PopMB-'+i);
		}
	});
}