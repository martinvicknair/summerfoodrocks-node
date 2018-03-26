var expect = require("chai").expect;

var formatPhoneNumber = require("logic.js")

describe("formatPhoneNumber", function() {
  it("should format a string of numbers into xxx-xxx-xxxx", function() {
    expect formatPhoneNumber(0005551212)).to.equal(000-555-1212);
  });

  it("should throw when not passed numbers", function() {
    expect(function() {
      formatPhoneNumber("4");
    }).to.throw(Error);
  });
});
