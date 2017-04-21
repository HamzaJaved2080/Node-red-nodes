var app = require('../../../../simple-workflow/server/server.js');
var es = require('event-stream');
var EventSource = require('eventsource');

module.exports = function (RED) {
  function change_stream(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    // this.on('input', function (msg) {
    var url = config.url;
    var model_name = config.model;
    var change_on = config.changed_on;
    if (url != undefined && model_name != undefined) {
      var src = new EventSource(url);
      var model = app.models[model_name];
      src.addEventListener('data', function (msg) {
        var data = JSON.parse(msg.data);
        console.log(data.type);
        if (change_on == "all") {
          node.send(data.data);
        } else if (change_on == "create" && data.type == "create") {
            node.send(data.data);
        } else if (change_on == "update" && data.type == "update") {
            node.send(data.data);
        } else if (change_on == "delete" && data.type == "delete") {
            node.send(data.data);
        }
      });
    } else {
      var error = "url for event-stream and model name is required for set live event streaming on model.";
      node.send(error);
    }
    // });
  }
  RED.nodes.registerType("loopback_change_stream", change_stream);
}
//http://localhost:3000/api/ceos/change-stream
