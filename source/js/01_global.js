var PrivKey = "";
var decryptType = "";
var SavedNickNames = [];
var SavedAccounts = [];
var usdval = 0;
var eurval = 0;
var btcval = 0;
var numBalanceReq = 0
$(document).ready(function() {
	bindElements();
	checkAndLoadPageHash();
});
$(window).load(function() {
	$('html,body').scrollTop(0);
	setTimeout(function() {
		$('html,body').scrollTop(0);
	}, 1);
});
function checkAndLoadPageHash() {
	if (window.location.hash) {
		var phash = window.location.hash.substr(1);
		$(".ptabs").each(function(index) {
			if ($(this).attr('id') == phash) {
				paneNavigate($(this).attr('showId'), this.id);
			}
		});
	}
}

function paneNavigate(showEleId, activeEleId) {
	location.hash = activeEleId;
	hideAllMainContainers();
	$("#" + showEleId).show();
	$("#" + activeEleId).parent().addClass('active');
	onTabOpen(activeEleId);
	$('html,body').scrollTop(0);
}

function onTabOpen(tabid) {
	if (tabid == 'add-wallet') {
		setNickNames();
		setAccounts();
	} else if (tabid == 'wallets') {
		reloadMainPageWallets();
	} else if (tabid == 'send-transaction') {
		setSendTransactionWallets();
	}
}

function bindElements() {
	$(".ptabs").each(function(index) {
		$(this).click(function() {
			location.hash = this.id;
			location.reload();
			//	paneNavigate($(this).attr('showId'), this.id);
		});
	});
	$("#btndonate").click(function() {
		$("#sendtxaddress").val('0x7cb57b5a97eabe94205c07890be4c1ad31e486a8');
		$("#donateThanks").show();
		$("#sendtxaddress").trigger("keyup");
	});
	$("#btngeneratetranaction").click(function() {
		preCreateTransaction();
	});
	$("#btnapprovesend").click(function() {
		preSendTransaction();
	});
	$("#decryptAddWallet").click(function() {
		addDecryptedWallet();
	});
	$("#printqr").click(function() {
		printQRcode();
	});
	$("#btnapproveEdit").click(function() {
		var ethAccAddress = $("#editWalletAddress").val();
		var newNick = $("#walletName").val();
		editNickName(ethAccAddress, newNick, function() {
			reloadMainPageWallets();
			$("#walletName").val('');
			$("#editWallet").modal("hide");
		});
	});
	$("#hideWalletDetails").click(function() {
		$("#walletNickname").html('');
		$("#address").val('');
		$("#privkey").val('');
		$("#privkeyenc").val('');
		$("#qrcodeAdd").empty();
		$("#viewWalletDiv").hide();
		$("#qrcodeAdd").empty();
		$("#qrcode").empty();
		$("#encdownload").attr('href', '');
		$("#encdownload").attr('download', '');
		$("#unencdownload").attr('href', '');
		$("#unencdownload").attr('download', '');
	});
	$("#btnapproveView").click(function() {
		var ethAccAddress = $("#viewWalletAddress").val();
		var pin = $("#viewWalletPin").val();
		var nickname = $("#walletNicknameView").html();
		$("#viewWalletPin").val('');
		if (pin == "") {
			$("#viewWalletPopStatus").html(getErrorText("Please enter the password of the wallet")).fadeIn(50).fadeOut(3000);
		} else {
			getWalletFromStorage(ethAccAddress, function(data) {
				try {
					if (!chrome.runtime.lastError) {
						var encPriv = JSON.parse(data[ethAccAddress]).priv;
						var pkey = decryptTxtPrivKey(encPriv, pin);
						$("#walletNickname").html(nickname);
						$("#address").val(ethAccAddress);
						$("#privkey").val(pkey);
						$("#privkeyenc").val(encPriv);
						$("#qrcodeAdd").empty();
						$("#viewWalletDiv").show();
						$("#qrcodeAdd").empty();
						$('#addressIdenticon').css("background-image", 'url(' + blockies.create({
							seed: ethAccAddress,
							size: 8,
							scale: 16
						}).toDataURL() + ')');
						new QRCode($("#qrcodeAdd")[0], {
							text: ethAccAddress,
							width: $("#qrcode").width(),
							height: $("#qrcode").width(),
							colorDark: "#000000",
							colorLight: "#ffffff",
							correctLevel: QRCode.CorrectLevel.H
						});
						$("#qrcode").empty();
						new QRCode($("#qrcode")[0], {
							text: pkey,
							width: $("#qrcode").width(),
							height: $("#qrcode").width(),
							colorDark: "#000000",
							colorLight: "#ffffff",
							correctLevel: QRCode.CorrectLevel.H
						});
						var fileType = "text/json;charset=UTF-8";
						var encblob = new Blob([JSON.stringify({
							address: ethAccAddress,
							encrypted: true,
							locked: true,
							private: encPriv,
							hash: ethAccAddress
						})], {
							type: fileType
						});
						var unencblob = new Blob([JSON.stringify({
							address: ethAccAddress,
							encrypted: true,
							locked: false,
							private: pkey,
							hash: ethAccAddress
						})], {
							type: fileType
						});
						$("#encdownload").attr('href', window.URL.createObjectURL(encblob));
						$("#encdownload").attr('download', ethAccAddress + '-Encrypted.json');
						$("#unencdownload").attr('href', window.URL.createObjectURL(unencblob));
						$("#unencdownload").attr('download', ethAccAddress + '-Unencrypted.json');
						$("#viewWalletDetails").modal("hide");
					} else {
						throw chrome.runtime.lastError.message;
					}
				} catch (err) {
					$("#viewWalletPopStatus").html(getErrorText("Invalid password ")).fadeIn(50).fadeOut(3000);
				}
			});
		}
	});
	$("#btnapproveremove").click(function() {
		var ethAccAddress = $("#deleteWalletAddress").val();
		deleteAccount(ethAccAddress, function() {
			reloadMainPageWallets();
			$("#removeWallet").modal("hide");
		});
	});
	$("#transferAllBalance").click(function() {
		getMaxSendAmount($("#accountAddress1").html(), function(data) {
			$('#sendtxamount').val(data);
			$('input[type=radio][name=currencyRadio][value=ether]').prop("checked", true);
			$('#sendtxamount').trigger("keyup");
		}, function(err) {
			$("#txcreatestatus").html(getErrorText(err)).fadeIn(50).fadeOut(3000);
		});
	});
	$("#decryptdata").click(function() {
		$("#decryptStatus").html('<p class="text-center text-info"><strong> Please Wait...</strong></p>').fadeIn(10);
		setTimeout(function() {
			decryptFormData();
		}, 100);
	});
	$("#decryptSendTx").click(function() {
		$("#decryptStatusSendTx").html('<p class="text-center text-info"><strong> Please Wait...</strong></p>').fadeIn(10);
		setTimeout(function() {
			decryptSendTxData();
		}, 100);
	});
	$("#generateNewWallet").click(function() {
		generateSingleWallet();
	});
	$("#addWatchOnly").click(function() {
		addWatchOnlyAccount();
	});
	$('input[type=radio][name=typeOfKeyRadio]').change(function() {
		PrivKey = "";
		$('#fuploadStatus').empty();
		$('#walletfilepassword').val('');
		$('#privkeypassword').val('');
		$('.btn-file :file').val('');
		$('#manualprivkey').val('')
		$("#walletuploadbutton").hide();
		$("#walletPasdiv").hide();
		$("#divprikeypassword").hide();
		$("#addDecryptedWalletDiv").hide();
		$("#decryptStatus").hide();
		$("#selectedTypeKey").hide();
		$("#selectedUploadKey").hide();
		$("#selectedWatchOnlyAccount").hide();
		$("#selectedGenNewWallet").hide();
		$("#newWalletGenButtonDiv").hide();
		$("#walletpreview0").hide();
		$("#decryptwalletpin").val('');
		$("#decryptwalletnickname").val('');
		$("#ethgenpassword").val('');
		$("#newWalletNick").val('');
		$("#watchOnlyNick").val('');
		$("#watchOnlyAdd").val('');
		if (this.value == 'fileupload') {
			$("#selectedUploadKey").show();
			decryptType = "fupload";
		} else if (this.value == 'pasteprivkey') {
			$("#selectedTypeKey").show();
			decryptType = "privkey";
		} else if (this.value == 'gennewwallet') {
			$("#selectedGenNewWallet").show();
			$("#newWalletGenButtonDiv").show();
			decryptType = "newwallet";
		} else if (this.value == 'watchOnlyAccount') {
			$("#selectedWatchOnlyAccount").show();
		}
	});
	$('input[type=radio][name=currencyRadio]').change(function() {
		$("#sendtxamount").trigger("keyup");
	});
	$('#walletfilepassword').on('paste, keyup', function() {
		if ($('#walletfilepassword').val() != "") {
			$("#uploadbtntxt-wallet").show();
			$("#uploadbtntxt-privkey").hide();
			$("#walletuploadbutton").show();
		} else {
			$("#walletuploadbutton").hide();
		}
	});
	$('#sendtxamount').on('paste, keyup', function() {
		var amount = $('#sendtxamount').val();
		if ($('#sendtxamount').val() != "" && $.isNumeric(amount) && amount > 0) {
			var etherUnit = $('input[type=radio][name=currencyRadio]:checked').val();
			$("#weiamount").html('<p class="text-success"><strong>' + toWei(amount, etherUnit) + ' wei ( approximately ' + toFiat(amount, etherUnit, usdval) + ' USD/' + toFiat(amount, etherUnit, eurval) + ' EUR )</strong></p>');
		} else if ($('#sendtxamount').val() != "" && !$.isNumeric(amount)) {
			$("#weiamount").html(getErrorText('Invalid Amount'));
		} else {
			$("#weiamount").html('');
		}
	});
	$('#watchOnlyAdd').on('paste, keyup', function() {
		if (validateEtherAddress($('#watchOnlyAdd').val())) {
			$("#WatchOnlyAddressValidate").html(getSuccessText('Address is valid')).fadeIn(50);
		} else if ($('#watchOnlyAdd').val() == "") {
			$("#WatchOnlyAddressValidate").html('');
		} else {
			$("#WatchOnlyAddressValidate").html(getErrorText('Invalid address')).fadeIn(50);
		}
	});
	$('#sendtxaddress').on('paste, keyup', function() {
		if (validateEtherAddress($('#sendtxaddress').val())) {
			$("#addressvalidate").html(getSuccessText('Address is valid')).fadeIn(50);
		} else if ($('#sendtxaddress').val() == "") {
			$("#addressvalidate").html('');
		} else {
			$("#addressvalidate").html(getErrorText('Invalid address')).fadeIn(50);
		}
	});
	$('#privkeypassword').on('paste, keyup', function() {
		if ($('#privkeypassword').val().length > 6) {
			$("#uploadbtntxt-wallet").hide();
			$("#uploadbtntxt-privkey").show();
			$("#walletuploadbutton").show();
		} else {
			$("#walletuploadbutton").hide();
		}
	});
	$('#manualprivkey').on('paste, keyup', function() {
		$("#divprikeypassword").hide();
		$("#walletuploadbutton").hide();
		$("#uploadbtntxt-wallet").hide();
		$("#uploadbtntxt-privkey").hide();
		$("#manualprivkey").val($("#manualprivkey").val().replace(/(?:\r\n|\r|\n| )/g, ''));
		if ($('#manualprivkey').val().length == 128 || $('#manualprivkey').val().length == 132) {
			$("#divprikeypassword").show();
		} else if ($('#manualprivkey').val().length == 64) {
			$("#uploadbtntxt-wallet").hide();
			$("#uploadbtntxt-privkey").show();
			$("#walletuploadbutton").show();
		}
	});
	$('.btn-file :file').change(function() {
		if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
			alert('The File APIs are not fully supported in this browser. Please use a modern browser');
			return;
		}
		var input = $(this),
			numFiles = input.get(0).files ? input.get(0).files.length : 1,
			label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
		input.trigger('fileselect', [numFiles, label]);
	});
	$('.btn-file :file').on('fileselect', function(event, numFiles, label) {
		$('#fuploadStatus').empty();
		$('#walletfilepassword').val('');
		PrivKey = "";
		file = $('.btn-file :file')[0].files[0];
		var fr = new FileReader();
		fr.onload = function() {
			try {
				if (walletRequirePass(fr.result)) {
					$("#walletPasdiv").show();
					$("#walletuploadbutton").hide();
				} else {
					$("#walletPasdiv").hide();
					$("#walletuploadbutton").show();
					$("#uploadbtntxt-wallet").show();
					$("#uploadbtntxt-privkey").hide();
				}
			} catch (err) {
				$('#fuploadStatus').append(getErrorText(err));
			}
		};
		fr.readAsText(file);
		var input = $(this).parents('.input-group').find(':text'),
			log = numFiles > 1 ? numFiles + ' files selected' : label;
		if (input.length) {
			input.val(log);
		} else {
			if (log) {
				$('#fuploadStatus').append(getSuccessText('File Selected: ' + log));
			}
		}
	});
}

function addWatchOnlyAccount() {
	var wNick = $("#watchOnlyNick").val();
	var wAdd = $("#watchOnlyAdd").val();
	if (!validateEtherAddress(wAdd) || wAdd == "") {
		$("#watchOnlyWalletStatus").html(getErrorText("Invalid Address")).fadeIn(50).fadeOut(3000);
	} else if (wNick == "") {
		$("#watchOnlyWalletStatus").html(getErrorText("Invalid valid nick name")).fadeIn(50).fadeOut(3000);
	} else if ($.inArray(wNick, SavedNickNames) > -1) {
		$("#watchOnlyWalletStatus").html(getErrorText("Nick name already in use")).fadeIn(50).fadeOut(3000);
	} else {
		addWatchOnlyAddress(wAdd, wNick, function() {
			if (chrome.runtime.lastError) {
				$("#watchOnlyWalletStatus").html(getErrorText(chrome.runtime.lastError.message)).fadeIn(50).fadeOut(3000);
			} else {
				$("#watchOnlyWalletStatus").html(getSuccessText("New watch only address added, " + wNick + ":" + wAdd)).fadeIn(50).fadeOut(5000, function() {
					$("input[name=typeOfKeyRadio][value='gennewwallet']").prop("checked", true);
					$('input[type=radio][name=typeOfKeyRadio]').change();
					$('*[showid="paneWallets"]').click();
				});
				setNickNames();
			}
		});
	}
}

function setNickNames() {
	getAllNickNames(function(data) {
		SavedNickNames = data;
	});
}

function setAccounts() {
	getAllAccounts(function(data) {
		SavedAccounts = data;
	});
}

function preSendTransaction() {
	sendTransaction($("#tasignedtx").val(), function(data) {
		$("#txsendstatus").html(getSuccessText('Transaction submitted. TX ID: ' + data));
		setWalletBalance(1);
	}, function(err) {
		$("#txsendstatus").html(getErrorText(err));
	});
	$('#sendTransaction').modal('hide');
}

function preCreateTransaction() {
	try {
		$("#tarawtx").val("");
		$("#tasignedtx").val("");
		$("#txsendstatus").html('')
		var toAddress = $('#sendtxaddress').val();
		if (PrivKey.length != 64) throw "Invalid Private key, try again";
		if (formatAddress(strPrivateKeyToAddress(PrivKey), 'hex') == toAddress) throw "You cannot send ether to yourself";
		if (!validateEtherAddress(toAddress)) throw "Invalid to Address, try again";
		if (!$.isNumeric($('#sendtxamount').val()) || $('#sendtxamount').val() <= 0) throw "Invalid amount, try again";
		var etherUnit = $('input[type=radio][name=currencyRadio]:checked').val();
		var weiAmount = toWei($('#sendtxamount').val(), etherUnit);
		createTransaction(PrivKey, toAddress, weiAmount, function(data) {
			$("#tarawtx").val(data.raw);
			$("#tasignedtx").val(data.signed);
			$("#txcreatestatus").html(getSuccessText('Transaction generated')).fadeIn(50);
			$("#divtransactionTAs").show();
			$("#divsendtranaction").show();
			$("#confirmAmount").html($('#sendtxamount').val());
			$("#confirmCurrancy").html(etherUnit);
			$("#confirmAddress").html(toAddress);
		}, function(err) {
			$("#txcreatestatus").html(getErrorText(err)).fadeIn(50).fadeOut(3000);
			$("#divtransactionTAs").hide();
			$("#divsendtranaction").hide();
		});
	} catch (err) {
		$("#txcreatestatus").html(getErrorText(err)).fadeIn(50).fadeOut(3000);
		$("#divtransactionTAs").hide();
		$("#divsendtranaction").hide();
	}
}

function getErrorText(err) {
	return '<p class="text-center text-danger"><strong> ' + err + '</strong></p>';
}

function getSuccessText(text) {
	return '<p class="text-center text-success"><strong> ' + text + '</strong></p>';
}

function setSendTransactionWallets() {
	getWalletsArr(function(wallets) {
		$("#tblsendtransactionWallets > tbody").empty();
		for (var i = 0; i < wallets.length; i++) {
			var cobj = wallets[i];
			var tblRow = '<tr><td><label><input type="radio" name="selectedWallet" value="' + cobj.addr + '">' + cobj.nick + '</label></td><td id="walBalance-' + i + '">loading</td></tr>';
			$("#tblsendtransactionWallets > tbody").append(tblRow);
			updateTableRowBalance(cobj.addr, 'walBalance-' + i);
		}
	});
}

function reloadMainPageWallets() {
    numBalanceReq = 0;
	getWalletsArr(function(wallets) {
		$("#tblwalletsmain > tbody").empty();
		for (var i = 0; i < wallets.length; i++) {
			var cobj = wallets[i];
			var tblRow = getMainPageWalletRow(i + 1, cobj.nick, cobj.addr);
			$("#tblwalletsmain > tbody").append(tblRow);
			setWalletBalance('MainTbl-' + (i + 1));
		}
		addEditEvents();
	});
	getWatchOnlyArr(function(wallets) {
		$("#tblWatchOnlyMain > tbody").empty();
		if (wallets.length == 0) $("#secWatchOnlyMain").hide();
		else $("#secWatchOnlyMain").show();
		for (var i = 0; i < wallets.length; i++) {
			var cobj = wallets[i];
			var tblRow = getMainPageWatchOnlyRow(i + 1, cobj.nick, cobj.addr);
			$("#tblWatchOnlyMain > tbody").append(tblRow);
			setWalletBalance('WatchOnly-' + (i + 1));
		}
		addEditEvents();
	});
}

function updateTableRowBalance(address, rawid) {
	getBalance(address, function(result) {
		if (!result.error) {
			var bestCurAmount = getBestEtherKnownUnit(result.data.balance);
			$("#" + rawid).html(bestCurAmount.amount + " " + bestCurAmount.unit);
		}
	});
}

function addEditEvents() {
	$(".mainWalletEdit").unbind().click(function() {
		var editval = $(this).attr('editval');
		var nickname = $("#accountNickMainTbl-" + editval).html();
		var walAddress = $("#accountAddressMainTbl-" + editval).html();
		$("#walletNicknameEdit").html(nickname);
		$('#editWalletAddress').val(walAddress);
		$("#editWallet").modal("show");
	});
	$(".mainWalletDelete").unbind().click(function() {
		var deleteVal = $(this).attr('deleteVal');
		var nickname = $("#accountNickMainTbl-" + deleteVal).html();
		var walAddress = $("#accountAddressMainTbl-" + deleteVal).html();
		$("#walletNicknameDelete").html(nickname);
		$('#deleteWalletAddress').val(walAddress);
		$("#removeWallet").modal("show");
	});
	$(".WatchOnlyWalletDelete").unbind().click(function() {
		var deleteVal = $(this).attr('deleteVal');
		var walAddress = $("#accountAddressWatchOnly-" + deleteVal).html();
		deleteAccount(walAddress, function() {
			reloadMainPageWallets();
		});
	});
	$(".mainWalletView").unbind().click(function() {
		var viewVal = $(this).attr('viewVal');
		var nickname = $("#accountNickMainTbl-" + viewVal).html();
		var walAddress = $("#accountAddressMainTbl-" + viewVal).html();
		$("#walletNicknameView").html(nickname);
		$('#viewWalletAddress').val(walAddress);
		$("#viewWalletDetails").modal("show");
	});
}

function setWalletBalance(id) {
    setTimeout(function(){
            getBalanceRequest(id)
        },numBalanceReq*300);
    numBalanceReq++;
}
function getBalanceRequest(id){
    getBalance($("#accountAddress" + id).html(), function(result) {
		if (!result.error) {
			var bestCurAmount = getBestEtherKnownUnit(result.data.balance);
			$("#accountBalance" + id).html(bestCurAmount.amount + " " + bestCurAmount.unit);
			if (usdval == 0) {
				getETHvalue('USD', function(value) {
					usdval = value;
					tusdval = toFiat(bestCurAmount.amount, bestCurAmount.unit, value);
					$("#accountBalanceUsd" + id).html(formatCurrency(parseFloat(tusdval), '$') + " USD");
				});
			} else {
				tusdval = toFiat(bestCurAmount.amount, bestCurAmount.unit, usdval);
				$("#accountBalanceUsd" + id).html(formatCurrency(parseFloat(tusdval), '$') + " USD");
			}
			if (eurval == 0) {
				getETHvalue('EUR', function(value) {
					eurval = value;
					teurval = toFiat(bestCurAmount.amount, bestCurAmount.unit, value);
					$("#accountBalanceEur" + id).html(formatCurrency(parseFloat(teurval), '&euro;') + " EUR");
				});
			} else {
				teurval = toFiat(bestCurAmount.amount, bestCurAmount.unit, eurval);
				$("#accountBalanceEur" + id).html(formatCurrency(parseFloat(teurval), '&euro;') + " EUR");
			}
			if (btcval == 0) {
				getETHvalue('BTC', function(value) {
					btcval = value;
					tbtcval = toFiat(bestCurAmount.amount, bestCurAmount.unit, value);
					$("#accountBalanceBtc" + id).html(tbtcval + " BTC");
				});
			} else {
				tbtcval = toFiat(bestCurAmount.amount, bestCurAmount.unit, btcval);
				$("#accountBalanceBtc" + id).html(tbtcval + " BTC");
			}
		} else
		alert(result.msg);
	});
}
function formatCurrency(n, currency) {
	return currency + " " + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

function walletDecryptSuccess(id) {
	$("#accountAddress" + id).html(formatAddress(strPrivateKeyToAddress(PrivKey), 'hex'));
	setWalletBalance(id);
	$("#decryptStatus" + id).html(getSuccessText('Wallet successfully decrypted')).fadeIn(2000).fadeOut(5000);
	$("#walletpreview" + id).show();
}

function walletDecryptFailed(id, err) {
	$("#decryptStatus" + id).html(getErrorText(err)).fadeIn(50).fadeOut(3000);
	$("#walletpreview" + id).hide();
}

function addDecryptedWallet() {
	var password = $("#decryptwalletpin").val();
	var nickname = stripScriptTags($("#decryptwalletnickname").val());
	if (password == "") {
		$("#AddDecryptedWalletStatus").html(getErrorText("You must enter a password")).fadeIn(50).fadeOut(3000);
	} else if (password.length < 8) {
		$("#AddDecryptedWalletStatus").html(getErrorText("Your password must be at least 8 characters")).fadeIn(50).fadeOut(3000);
	} else if (nickname == "") {
		$("#AddDecryptedWalletStatus").html(getErrorText("You must enter a nickname for your wallet")).fadeIn(50).fadeOut(3000);
	} else if ($.inArray(nickname, SavedNickNames) > -1) {
		$("#AddDecryptedWalletStatus").html(getErrorText("Nickname is in use, please select different nickname")).fadeIn(50).fadeOut(3000);
	} else if (PrivKey == "" || PrivKey.length != 64) {
		$("#AddDecryptedWalletStatus").html(getErrorText("Invalid Private key try to decrypt the wallet again")).fadeIn(50).fadeOut(3000);
	} else if (password == nickname) {
		$("#generatedWallet").html(getErrorText("Password cannot be same as the the nickname")).fadeIn(50).fadeOut(3000);
	} else {
		var address = formatAddress(strPrivateKeyToAddress(PrivKey), 'hex');
		if ($.inArray(address, SavedAccounts) > -1) {
			$("#AddDecryptedWalletStatus").html(getErrorText("Account already exists")).fadeIn(50).fadeOut(3000);
			return;
		}
		var encprivkey = encryptPrivKey(PrivKey, password);
		addWalletToStorage(address, encprivkey, nickname, function() {
			if (chrome.runtime.lastError) {
				$("#AddDecryptedWalletStatus").html(getErrorText(chrome.runtime.lastError.message)).fadeIn(50).fadeOut(3000);
			} else {
				$("#AddDecryptedWalletStatus").html(getSuccessText("New Wallet Generated! " + nickname + ":" + address)).fadeIn(50).fadeOut(5000, function() {
					$("input[name=typeOfKeyRadio][value='gennewwallet']").prop("checked", true);
					$('input[type=radio][name=typeOfKeyRadio]').change();
					$('*[showid="paneWallets"]').click();
				});
				setNickNames();
			}
		});
	}
}

function decryptFormData() {
	PrivKey = "";
	if (decryptType == 'fupload') {
		file = $('.btn-file :file')[0].files[0];
		var fr = new FileReader();
		fr.onload = function() {
			try {
				var passVal = $('#walletfilepassword').val();
				PrivKey = getWalletFilePrivKey(fr.result, passVal);
				if (passVal == '') $("#pindiv").show();
				else
				$("#decryptwalletpin").val(passVal);
				walletDecryptSuccess(0);
			} catch (err) {
				walletDecryptFailed(0, err);
			}
		};
		fr.readAsText(file);
	} else if (decryptType == 'privkey') {
		try {
			var passVal = $('#privkeypassword').val();
			PrivKey = decryptTxtPrivKey($('#manualprivkey').val(), passVal);
			if (passVal == '') $("#pindiv").show();
			else
			$("#decryptwalletpin").val(passVal);
			walletDecryptSuccess(0);
		} catch (err) {
			walletDecryptFailed(0, "Invalid password");
		}
	}
}

function decryptSendTxData() {
	var addr = $('input[type=radio][name=selectedWallet]:checked').val();
	var pin = $('#sendTransactionPin').val();
	if (addr == "") {
		$("#decryptStatus1").html(getErrorText("Please select a wallet")).fadeIn(50).fadeOut(3000);
	} else if (pin == "") {
		$("#decryptStatus1").html(getErrorText("Please enter the password of the wallet")).fadeIn(50).fadeOut(3000);
	} else {
		getWalletFromStorage(addr, function(data) {
			try {
				if (!chrome.runtime.lastError) {
					PrivKey = decryptTxtPrivKey(JSON.parse(data[addr]).priv, pin);
					walletDecryptSuccess(1);
				} else {
					throw chrome.runtime.lastError.message;
				}
			} catch (err) {
				walletDecryptFailed(1, "Invalid password " + err);
			}
		});
	}
}

function hideAllMainContainers() {
	$("#paneWallets").hide();
	$("#paneAddWallet").hide();
	$("#paneWalgen").hide();
	$("#paneBulkgen").hide();
	$("#paneSendTrans").hide();
	$("#panePopContracts").hide();
	$("#paneHelp").hide();
	$("#paneContact").hide();
	$("#panePrint").hide();
	$("#wallets").parent().removeClass('active');
	$("#add-wallet").parent().removeClass('active');
	$("#bulk-generate").parent().removeClass('active');
	$("#generate-wallet").parent().removeClass('active');
	$("#send-transaction").parent().removeClass('active');
	$("#popular-contracts").parent().removeClass('active');
	$("#help").parent().removeClass('active');
	$("#contact").parent().removeClass('active');
}

function generateSingleWallet() {
	var password = $("#ethgenpassword").val();
	var nickname = stripScriptTags($("#newWalletNick").val());
	if (password == "") {
		$("#generatedWallet").html(getErrorText("You must enter a password.")).fadeIn(50).fadeOut(3000);
	} else if (password.length < 8) {
		$("#generatedWallet").html(getErrorText("Your password must be at least 8 characters.")).fadeIn(50).fadeOut(3000);
	} else if (nickname == "") {
		$("#generatedWallet").html(getErrorText("You must enter a nickname for your wallet.")).fadeIn(50).fadeOut(3000);
	} else if ($.inArray(nickname, SavedNickNames) > -1) {
		$("#generatedWallet").html(getErrorText("Nickname is already in use. Please use different nickname.")).fadeIn(50).fadeOut(3000);
	} else if (password == nickname) {
		$("#generatedWallet").html(getErrorText("Password cannot be same as the the nickname")).fadeIn(50).fadeOut(3000);
	} else {
		var acc = new Accounts();
		var newAccount = acc.new();
		var address = newAccount.address;
		var encprivkey = encryptPrivKey(newAccount.private, password);
		addWalletToStorage(address, encprivkey, nickname, function() {
			if (chrome.runtime.lastError) {
				$("#generatedWallet").html(getErrorText(chrome.runtime.lastError.message)).fadeIn(50).fadeOut(3000);
			} else {
				$("#generatedWallet").html(getSuccessText("New Wallet Generated! " + nickname + ":" + address)).fadeIn(50).fadeOut(5000);
				setNickNames();
				$("input[name=typeOfKeyRadio][value='gennewwallet']").prop("checked", true);
				$('input[type=radio][name=typeOfKeyRadio]').change();
				$('*[showid="paneWallets"]').click();
			}
		});
		acc.clear();
	}
}

function stripScriptTags(str) {
	var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	while (SCRIPT_REGEX.test(str)) {
		str = str.replace(SCRIPT_REGEX, "");
	}
	return str;
}

function openPrintPaperWallets(strjson) {
	var win = window.open("about:blank");
	data = "<html>\r\n<head>\r\n  <link href=\"css\/etherwallet-ext-master.min.css\" rel=\"stylesheet\" type=\"text\/css\">\r\n  <script src=\"js\/jquery.js\"><\/script>\r\n  <script src=\"js\/etherwallet-ext-static.min.js\"><\/script>\r\n  <script src=\"js\/etherwallet-ext-master.min.js\"><\/script>\r\n<script type=\"text\/javascript\">\r\nfunction generateWallets(){\r\n    var json = JSON.parse($(\"#printwalletjson\").html());\r\n    for(var i=0;i<json.length;i++){\r\n        var walletTemplate = $(\'<div\/>\').append($(\"#print-container\").clone());\r\n        new QRCode($(walletTemplate).find(\"#paperwalletaddqr\")[0], {\r\n\t\t  text: json[i][\'address\'],\r\n\t\t  colorDark: \"#000000\",\r\n\t\t  colorLight: \"#ffffff\",\r\n\t\tcorrectLevel: QRCode.CorrectLevel.H\r\n\t   });\r\n       new QRCode($(walletTemplate).find(\"#paperwalletprivqr\")[0], {\r\n\t\t  text: json[i][\'private\'],\r\n\t\t  colorDark: \"#000000\",\r\n\t\t  colorLight: \"#ffffff\",\r\n\t\tcorrectLevel: QRCode.CorrectLevel.H\r\n\t   });\r\n       $(walletTemplate).find(\"#paperwalletadd\").html(json[i][\'address\']);\r\n       $(walletTemplate).find(\"#paperwalletpriv\").html(json[i][\'private\']);\r\n       walletTemplate = $(walletTemplate).find(\"#print-container\").show();\r\n       $(\"body\").append(walletTemplate);\r\n    }\r\n    setTimeout(function(){window.print();},2000);\r\n}\r\n<\/script>\r\n<\/head>\r\n<body>\r\n<span id=\"printwalletjson\" style=\"display: none;\">{{WALLETJSON}}<\/span>\r\n<div class=\"print-container\" style=\"display: none; margin-bottom: 28px;\" id=\"print-container\">\r\n        <img src=\"images\/logo-1.png\" class=\"ether-logo-1\" height=\"100%\" width=\"auto\"\/>\r\n        <img src=\"images\/logo-2.png\" class=\"ether-logo-2\"\/>\r\n        <img src=\"images\/ether-title.png\" height=\"100%\" width=\"auto\" class=\"print-title\"\/>\r\n          <div class=\"print-qr-code-1\">\r\n          <div id=\"paperwalletaddqr\"><\/div>\r\n            <p class=\"print-text\" style=\"padding-top: 25px;\">YOUR ADDRESS<\/p>\r\n          <\/div>\r\n          <div class=\"print-qr-code-2\">\r\n            <div id=\"paperwalletprivqr\"><\/div>\r\n            <p class=\"print-text\" style=\"padding-top: 30px;\">YOUR PRIVATE KEY<\/p>\r\n          <\/div>\r\n          <div class=\"print-notes\">\r\n            <img src=\"images\/notes-bg.png\" width=\"90%;\" height=\"auto\" class=\"pull-left\" \/>\r\n            <p class=\"print-text\">AMOUNT \/ NOTES<\/p>\r\n          <\/div>\r\n        <div class=\"print-address-container\">\r\n          <p>\r\n            <strong>Your Address:<\/strong><br \/>\r\n            <span id=\"paperwalletadd\"><\/span>\r\n          <\/p>\r\n          <p>\r\n            <strong>Your Private Key:<\/strong><br \/>\r\n            <span id=\"paperwalletpriv\"><\/span>\r\n        <\/p>\r\n    <\/div>\r\n<\/div>\r\n<\/body>\r\n<\/html>";
	data = data.replace("{{WALLETJSON}}", strjson);
	$(win).ready(function() {
		win.document.write(data);
		win.document.write("<script>generateWallets();</script>");
	});
}

function printQRcode() {
	var address = $("#address").val();
	var privkey = $("#privkey").val();
	var jsonarr = [];
	jsonarr.push({
		address: address,
		private: privkey
	});
	openPrintPaperWallets(JSON.stringify(jsonarr));
}

$(document).ready(function() {
	// collapsing elements on offline tx and help
	$(".collapsePanel.collapsed").slideUp();
	$(".collapseButton").click(function() {
		var collapseButton = $(this);
		var collapseContainer = $(this).parents(".collapseContainer");
		var collapsePanel = collapseContainer.children( ".collapsePanel" );
		collapsePanel.slideToggle();
		if ( collapseButton.html() == "-") {
			collapseButton.html("+");
		} else {
			collapseButton.html("-");
		}
	});

	// ontap hovers
	$(".account-help-icon").click(function() {
		$(this).children( ".account-help-text" ).toggle();
	});
});
