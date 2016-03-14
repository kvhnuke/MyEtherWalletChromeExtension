$(document).ready(function() {
	bindPopElements();
	pageBasedOnLoads();
});

function pageBasedOnLoads() {
	if ($("#popupMainAccountTbl").length) {
		reloadPopupAccounts();
		$("#popupConfirmSend").hide();
	}
}

function bindPopElements() {
	$("#popPreSend").click(function() {
		try {
			var selectedAcc = $("input[name=selectedWallet]:checked").val();
            var nickName = $("input[name=selectedWallet]:checked").parent().text();
			var toAddress = $('#sendtxaddress').val();
			var sendAmount = $('#sendtxamount').val();
			if (typeof selectedAcc == 'undefined') throw "Whoops. An account was not selected.";
			if (!validateEtherAddress(toAddress)) throw "Invalid To: Address. Please check the address and try again.";
			if (!$.isNumeric(sendAmount) || sendAmount <= 0) throw "Invalid Amount. Please try again.";
			var etherUnit = $('input[type=radio][name=currencyRadio]:checked').val();
			var weiAmount = toWei(sendAmount, etherUnit);
			$("#confirmAmount").html(sendAmount);
			$("#confirmCurrancy").html(etherUnit);
			$("#confirmAddress").html(toChecksumAddress(toAddress));
            $("#popupNickName").html(nickName);
			$("#popupConfirmSend").show();
			$("#sendTransMain").hide();
		} catch (err) {
			$("#popwalletselectstatus").html('<p class="text-center text-danger"><strong> ' + err + '</strong></p>').fadeIn(50).fadeOut(3000);
		}
	});
	$("#transferAllBalancePop").click(function() {
		var selectedAcc = $("input[name=selectedWallet]:checked").val();
		$('#sendtxamount').val('');
		if (typeof selectedAcc == 'undefined') {
			$("#popwalletselectstatus").html('<p class="text-center text-danger"><strong>No account selected</strong></p>').fadeIn(50).fadeOut(3000);
			return;
		}
		getMaxSendAmount(selectedAcc, function(data) {
			$('#sendtxamount').val(data);
			$('input[type=radio][name=currencyRadio][value=ether]').prop("checked", true);
			$('#sendtxamount').trigger("keyup");
		}, function(err) {
			$("#popwalletselectstatus").html('<p class="text-center text-danger"><strong> ' + err + '</strong></p>').fadeIn(50).fadeOut(3000);
		});
	});
	$("#cancelTransaction").click(function() {
		$("#popupConfirmSend").hide();
		$("#sendTransMain").show();
	});
	$("#approveTransaction").click(function() {
	   if(!$("#approveTransaction").hasClass('disabled'))
		  decryptAndSendTx();
	});
}

function decryptAndSendTx() {
	var addr = $('input[type=radio][name=selectedWallet]:checked').val().toLowerCase();
	var pin = $('#sendTransactionPin').val();
	if (addr == "") {
		$("#decryptStatus1").html(getErrorText("Please select a wallet.")).fadeIn(50).fadeOut(3000);
	} else if (pin == "") {
		$("#decryptStatus1").html(getErrorText("Please enter the password of the wallet.")).fadeIn(50).fadeOut(3000);
	} else {
		getWalletFromStorage(addr, function(data) {
			try {
				if (!chrome.runtime.lastError) {
					PrivKey = decryptTxtPrivKey(JSON.parse(data[addr]).priv, pin);
					var toAddress = $('#sendtxaddress').val();
					var sendAmount = $('#sendtxamount').val();
					var etherUnit = $('input[type=radio][name=currencyRadio]:checked').val();
					var weiAmount = toWei(sendAmount, etherUnit);
                    $("#approveTransaction").addClass('disabled');
					createTransaction(PrivKey, toAddress, weiAmount, function(data) {
						var signedtx = data.signed;
						sendTransaction(signedtx, function(data) {
							$("#decryptStatus1").html('<p class="text-center text-success"><strong> Success! Transaction submitted. TX ID: ' + data + '</strong></p>').fadeIn(50);
						}, function(err) {
							$("#decryptStatus1").html('<p class="text-center text-danger"><strong>' + err + '</strong></p>').fadeIn(50).fadeOut(3000);
						});
					}, function(err) {
						$("#decryptStatus1").html('<p class="text-center text-danger"><strong> ' + err + '</strong></p>').fadeIn(50).fadeOut(3000);
					});
				} else {
					throw chrome.runtime.lastError.message;
				}
			} catch (err) {
				walletDecryptFailed(1, "Invalid Password " + err);
			}
		});
	}
}

function reloadPopupAccounts() {
	getWalletsArr(function(wallets) {
		$("#popupMainAccountTbl > tbody").empty();
		for (var i = 0; i < wallets.length; i++) {
			var cobj = wallets[i];
			if ($('.quicksend').length) var tblRow = getQuickSendRow(i, cobj.addr, cobj.nick);
			else if ($('.donate').length) var tblRow = getQuickSendRow(i, cobj.addr, cobj.nick);
			else if ($(".bAction").length) var tblRow = getAccountInfoRow(i, cobj.addr, cobj.nick);
			$("#popupMainAccountTbl > tbody").append(tblRow);
			setWalletBalance('PopMB-' + i);
		}
        if(wallets.length==0){
            $("#popupMainAccountTbl > tbody").append("<tr><td colspan=\"2\">You don't have any wallets saved yet! Click the <a class=\"text-primary\" href=\"/wallet.html#add-wallet\" target=\"_blank\">\"Add Wallet\"</a> button to add one!</td></tr>");
        }
	});
}
