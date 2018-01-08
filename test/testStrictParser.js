const src = function(filePath) {
  return "../src/" + filePath
};
const errors = function(filePath) {
  return "../src/errors/" + filePath
};

const chai = require('chai').assert;
const Parsed=require(src('parsed.js'));
const StrictParser = require(src('index.js')).StrictParser;
const InvalidKeyError = require(errors('invalidKeyError.js'));

var invalidKeyErrorChecker = function(key, pos) {
  return function(err){
    if (err instanceof InvalidKeyError && err.invalidKey == key && err.position == pos)
    throw new Error
  }
}

describe("strict parser", function() {
  it("should only parse keys that are specified for a single key", function() {
    let kvParser = new StrictParser(["name"]);
    chai.throws(()=>{
      try {
        var p = kvParser.parse("age=23");
      } catch (e) {
        invalidKeyErrorChecker("age", 5)(e);
      }
    })
  });

  it("should only parse keys that are specified for multiple keys", function() {
    let expected = new Parsed();
    let kvParser = new StrictParser(["name", "age"]);
    let actual = kvParser.parse("name=john age=23");
    expected.name =  "john",
    expected.age =  "23"
    chai.deepEqual(expected, actual);
    chai.throws(
      ()=>{
        try {
          var p = kvParser.parse("color=blue");
        } catch (e) {
          invalidKeyErrorChecker("color", 9)(e);
        }
      });
  });

  it("should throw an error when one of the keys is not valid", function() {
    chai.throws(
      ()=>{
        try {
          let kvParser = new StrictParser(["name", "age"]);
          kvParser.parse("name=john color=blue age=23");
        } catch (e) {
          invalidKeyErrorChecker("color", 20)(e);
        }
      }
    )
  });

  it("should throw an error on invalid key when there are spaces between keys and assignment operators", function() {
    chai.throws(
      ()=>{
        try {
          let kvParser = new StrictParser(["name", "age"]);
          kvParser.parse("color   = blue");
        } catch (e) {
          invalidKeyErrorChecker("color", 13)(e);
        }
      })
  });

  it("should throw an error on invalid key when there are quotes on values", function() {
    chai.throws(
      ()=>{
        try {
          let kvParser = new StrictParser(["name", "age"]);
          kvParser.parse("color   = \"blue\"");
        } catch (e) {
          invalidKeyErrorChecker("color", 15) (e);
        }
      })
  });

  it("should throw an error on invalid key when there are cases of both quotes and no quotes", function() {
    chai.throws(
      ()=>{
        try {
          let kvParser = new StrictParser(["name", "age"]);
          kvParser.parse("name = john color   = \"light blue\"");
        } catch (e) {
          invalidKeyErrorChecker("color", 33)(e);
        }
      })
  });

  it("should throw an error when no valid keys are specified", function() {
    chai.throws(
      ()=>{
        try {
          let kvParser = new StrictParser([]);
          kvParser.parse("name=john");
        } catch (e) {

          invalidKeyErrorChecker("name", 8,)(e);
        }
      })
  });

  it("should throw an error when no array is passed", function() {
    chai.throws(
      ()=>{
        try {
          let kvParser = new StrictParser();
          kvParser.parse("name=john");
        } catch (e) {
          invalidKeyErrorChecker("name", 8)(e);
        }
      })
  });

});
