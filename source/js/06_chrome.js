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
function getAllAccounts(callback){
    var accounts = [];
    storage.get(null, function(items) {
        for (var key in items) {
            if (items.hasOwnProperty(key)) {
                var tobj = JSON.parse(items[key]);
                 if(tobj.type=='wallet')
                    accounts.push(key);
            }
        }
        callback(accounts);
    });
}
function addWalletToStorage(address, encprivkey, nickname, callback){
    nickname = nickname.replace(/(<([^>]+)>)/ig,"");
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
        wallets.sort(sortByNickName);
        callback(wallets);
    });
}
function deleteAccount(address,callback){
    storage.remove(address,function(){
        callback(address);
    });
}
function editNickName(address,newNick, callback){
    newNick = newNick.replace(/(<([^>]+)>)/ig,"");
    storage.get(address, function(account) {
        var accountInfo = account[address];
        accountInfo = JSON.parse(accountInfo);
        accountInfo['nick'] = newNick;
        account[address] = JSON.stringify(accountInfo);
        storage.set(account,function(){
            callback(newNick);
        });
    });
}
function sortByNickName(a, b){
    if(a.nick < b.nick) return -1;
    if(a.nick > b.nick) return 1;
    return 0;
}