// var app = require('../../../../simple-workflow/server/server.js');

module.exports = function (RED) {
  function compareTo(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var match, not_match = null;


    function comparison(operator, compare, compareTo) {
      match = not_match = null;
      if (operator == "==") {
        if (compare == compareTo)
          match = true;
        else
          not_match = true;
      } else if (operator == "!=") {
        if (compare != compareTo)
          match = true;
        else
          not_match = true;
      } else if (operator == ">") {
        if (compare > compareTo)
          match = true;
        else
          not_match = true;
      } else if (operator == "<") {
        if (compare < compareTo)
          match = true;
        else
          not_match = true;
      } else if (operator == ">=") {
        if (compare >= compareTo)
          match = true;
        else
          not_match = true;
      } else if (operator == "<=") {
        if (compare <= compareTo)
          match = true;
        else
          not_match = true;
      }

      if (match == true) {
        msg = "matched";
        node.send([msg, null]);
      } else {
        msg = "not matched";
        node.send([null, msg]);
      }
    }

    this.on('input', function (msg) {
      var operator = config.operator;
      var compareTo = config.compare;
      var selector = config.selector;
      var compare = msg;

      if (operator != undefined && compareTo != undefined && compare != undefined) {

        //check compare dataType...
        if (typeof compare === 'object') {
          if (selector != undefined) {
            compareTo = JSON.parse(compareTo);
            compare = compare[selector];
            compare = JSON.parse(compare);

            comparison(operator, compare, compareTo);
          }
        } else if (typeof compare === 'number' || typeof compare === 'bolean' || typeof compare === 'string') {
          compareTo = JSON.parse(compareTo);
          compare = JSON.parse(compare);
          comparison(operator, compare, compareTo);
        }
      } else {
        var error = "Operator,compareTo value and compare with value is required for comparison";
        node.send([null, error]);
      }


    });
  }
  RED.nodes.registerType("compare_to", compareTo);
}
