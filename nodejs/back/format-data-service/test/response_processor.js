/**
 * Created by Quentin on 2/21/2016.
 */
var assert = require("assert"),
    processor = require("../response_processor");

describe("#handleState()", function() {

    context("with a ON value", function() {
       it("should be transformed into a 100", function() {
           var input = {values :[{value : 'ON', date:12}]};
           var response = processor.handleState(true, input, 0);
           assert.deepEqual(response, [12000, 100])
       });
    });

    context("with a OPEN value", function() {
       it("should be transformed into a  1", function() {
           var input = {values : [{value : 'OPEN', date : 1}]};
           var response = processor.handleState(true, input, 0);
           assert.deepEqual(response, [1000, 1]);
       });
    });

    context("with a OFF value", function() {
       it("should be transformed into a 0", function() {
           var input = { values : [{value : 'OFF', date : 1}]};
           var response = processor.handleState(true, input, 0);
           assert.deepEqual(response, [1000, 0]);
       });
    });
});

describe("#splittedInformation()", function() {

    context("with only one OPEN", function() {
        it("should be transformed in a 1 in the first list", function() {
            var input = { values : [{value : 'OPEN', date : 1}]};
            var response = processor.splittedInformation(input, [], []);
            assert.deepEqual(response, {data : [{open : [[1000, 1]]}, {close : []}]});
        });
    });

    context("with only on CLOSE", function() {
        it("should be transformed in a 0 in the second list", function() {
            var input = { values : [{value : 'CLOSE', date : 1}]};
            var response = processor.splittedInformation(input, [], []);
            assert.deepEqual(response, {data : [{open : []}, {close : [[1000, 0]]}]});
        });
    });
});