const Parsed=require("./parsed.js");
const ParseInfo=require("./parseInfo.js");
const InvalidKeyError=require("./errors/invalidKeyError.js");

const containsMatchCase = function(list,key){
  return list.find(function(validKey){
    return key==validKey;
  });
}

const containsIgnoreCase = function(list,key){
  return list.find(function(validKey){
    return key.toLowerCase()==validKey.toLowerCase();
  });
}
const getContains = function(caseSensitive){
  if(caseSensitive){
    return containsMatchCase;
  }
  return containsIgnoreCase;
}

let contains = undefined;

var StrictParseInfo=function(initialParsingFunction,validKeys,caseSensitive) {
  ParseInfo.call(this,initialParsingFunction);
  this.validKeys=validKeys;
  contains = getContains(caseSensitive);
}


StrictParseInfo.prototype=Object.create(ParseInfo.prototype);
StrictParseInfo.prototype.pushKeyValuePair=function() {
  if(!contains(this.validKeys,this.currentKey))
    throw new InvalidKeyError("invalid key",this.currentKey,this.currentPos);
  this.parsedKeys[this.currentKey]=this.currentValue;
  this.resetKeysAndValues();
}

module.exports=StrictParseInfo;
