var storage = chrome.storage.sync;
function getAllNickNames(callback){
    var nickNames = [];
    storage.get(null, function(items) {
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                var tobj = JSON.parse(items[key]);
                 if(tobj.type=='wallet')
                    nickNames.push(tobj.nick);
            }
        }
        callback(nickNames);
    });
}
function addWalletToStorage(address, encprivkey, nickname, callback){
    var value = {nick:nickname, priv:encprivkey, type:'wallet'};
    var keyname = address;
    var obj= {};
    obj[keyname] = JSON.stringify(value);
    storage.set(obj,callback);
}
function getWalletFromStorage(address, callback){
    storage.get(address,callback);
}
function getWalletsArr(callback){
    var wallets = [];
    storage.get(null, function(items) {
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                var tobj = JSON.parse(items[key]);
                 if(tobj.type=='wallet'){
                    tobj['addr']=key;
                    wallets.push(tobj);
                 }
            }
        }
        callback(wallets);
    });
}