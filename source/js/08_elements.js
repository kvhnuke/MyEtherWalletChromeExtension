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
              <td> <a deleteVal='"+rid+"' class='mainWalletDelete' class=\"text-danger\"> Remove </a></td>\
            </tr>";
    return str;
}