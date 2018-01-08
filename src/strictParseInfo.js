const Parsed=require("./parsed.js");
const ParseInfo=require("./parseInfo.js");
const InvalidKeyError=require("./errors/invalidKeyError.js");

const compareValidKeysCaseSens = function(list,key){
  return list.find(function(validKey){
    return key==validKey;
  });
}

const compareValidKeysWithoutCaseSens = function(list,key){
  return list.find(function(validKey){
    return key.toLowerCase()==validKey.toLowerCase();
  });
}
const getContains = function(caseSensitive){
  if(caseSensitive){
    return compareValidKeysCaseSens
  }else{
    return compareValidKeysWithoutCaseSens;
  }
}

var StrictParseInfo=function(initialParsingFunction,validKeys,caseSensitive) {
  ParseInfo.call(this,initialParsingFunction);
  this.validKeys=validKeys;
  this.contains = getContains(caseSensitive);
}


StrictParseInfo.prototype=Object.create(ParseInfo.prototype);
StrictParseInfo.prototype.pushKeyValuePair=function() {
  if(!this.contains(this.validKeys,this.currentKey))
    throw new InvalidKeyError("invalid key",this.currentKey,this.currentPos);
  this.parsedKeys[this.currentKey]=this.currentValue;
  this.resetKeysAndValues();
}

module.exports=StrictParseInfo;
