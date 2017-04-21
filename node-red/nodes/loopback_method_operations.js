var loopback = require('loopback');
var app = require('../../../server/server.js');
// var es = require('event-stream');
// var EventSource = require('eventsource');


module.exports = function (RED) {
  function method_operations(config) {
    RED.nodes.createNode(this, config);
    var node = this;


    this.on('input', function (msg) {
      var model_name = config.model;
      var verb = config.verb;

      if (model_name == undefined || verb == undefined) {
        error  = "Model name is required for preceeding";
        node.send(error);

      } else {
        //get model 
        var model = app.models[model_name];
        if (verb == "find") {
          model.find(function (err, obj) {
            if (err) node.send(err);;
            node.send(obj);
          })
        }
        //end of find...
        else if (verb == "create") {
          var data_post = config.data;

          if (data_post == undefined) {
            var error = "Data for post request is required for preceeding";
            node.send(error);
          } else {
            data_post = JSON.parse(data_post);
            model.create(data_post, function (err, obj) {
              if (err) node.send(err);;
              node.send(obj);
            })
          }
        }

        else if (verb == "findById" || verb == "deleteById" || verb == "updateById") {
          var object_id = config.object_id;
          var data_post = config.data;

          if (object_id == undefined) {
            var error = "Object Id is required for preceeding with these methods";
            node.send(error);
          } else {

            if (verb == "findById") {
              model.findById(object_id, function (err, obj) {
                if (err) node.send(err);;
                node.send(obj);
              })
            }
            //end of findById...

            if (verb == "deleteById") {
              model.deleteById(object_id, function (err, obj) {
                if (err) node.send(err);;
                node.send(obj);
              })
            }
            //end of deleteById...
            if (data_post != undefined) {
              data_post = JSON.parse(data_post);
              if (verb == "updateById") {
                model.replaceById(object_id, data_post, function (err, obj) {
                  if (err) node.send(err);;
                  node.send(obj);
                })
              }
            }
            else{
              var error = "post data is required for updateById method";
              node.send(error);
            }
            //end of updateById...
          }
        }
        //end of id verbs...
        else{
          var error = "Method name not exist";
          node.send(error);
        }
      }
      //end of else...
    });

  }
  RED.nodes.registerType("lb_method_operation", method_operations);
}
