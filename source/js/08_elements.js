function getMainPageWalletRow(rid, nick,address){
    var str = "<tr>\
              <td>"+rid+"</td>\
              <td id=\"accountNickMainTbl-"+rid+"\">"+nick+"</td>\
              <td id=\"accountAddressMainTbl-"+rid+"\">"+address+"</td>\
              <td>\
                <strong class=\"text-success\" id=\"accountBalanceMainTbl-"+rid+"\"></strong>\
                <br />\
                <small><span id=\"accountBalanceBtcMainTbl-"+rid+"\"></span> &nbsp;&nbsp; <span id=\"accountBalanceUsdMainTbl-"+rid+"\"></span> &nbsp;&nbsp; <span id=\"accountBalanceEurMainTbl-"+rid+"\"></span></small>\
              </td>\
              <td> <a editVal='"+rid+"' class='mainWalletEdit'> Edit </a></td>\
              <td> <a viewVal='"+rid+"' class='text-warning mainWalletView'> View Wallet Details </a></td>\
              <td> <a deleteVal='"+rid+"' class='mainWalletDelete text-danger'> Remove </a></td>\
            </tr>";
    return str;
}
function getMainPageWatchOnlyRow(rid, nick,address){
    var str = "<tr>\
              <td>"+rid+"</td>\
              <td id=\"accountNickWatchOnly-"+rid+"\">"+nick+"</td>\
              <td id=\"accountAddressWatchOnly-"+rid+"\">"+address+"</td>\
              <td>\
                <strong class=\"text-success\" id=\"accountBalanceWatchOnly-"+rid+"\"></strong>\
                <br />\
                <small><span id=\"accountBalanceBtcWatchOnly-"+rid+"\"></span> &nbsp;&nbsp; <span id=\"accountBalanceUsdWatchOnly-"+rid+"\"></span> &nbsp;&nbsp; <span id=\"accountBalanceEurWatchOnly-"+rid+"\"></span></small>\
              </td>\
              <td> <a deleteVal='"+rid+"' class='WatchOnlyWalletDelete text-danger'> Remove </a></td>\
            </tr>";
    return str;
}
function getAccountInfoRow(rid,address, nick){
    var str = "<tr>\
        <td>\
        <div style='display:none;' id='accountAddressPopMB-"+rid+"'>"+address+"</div>\
          <label>"+nick+"</label>\
        </td>\
        <td id='accountBalancePopMB-"+rid+"'></td>\
      </tr>";
    return str;
}
function getQuickSendRow(rid,address, nick){
    var str = "<tr>\
        <td>\
          <label><label><input type=\"radio\" name=\"selectedWallet\" value=\""+address+"\"><strong>"+nick+"</strong></label>\
          <div class=\"quicksend-address\" id='accountAddressPopMB-"+rid+"'>"+address+"</div>\
        </td>\
        <td id='accountBalancePopMB-"+rid+"'></td>\
      </tr>";
    return str;
}
