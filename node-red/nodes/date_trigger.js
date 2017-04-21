module.exports = function (RED) {
  function dateTrigger(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    this.on('input', function (msg) {
      date_func();
    });


    //function Date :: main function which initiate trigger and send date to other functions...
    function date_func() {
      var fromDate,hour,minute = null;
      var error = false;

      fromDate = config.from_date;
      hour = config.hour;
      minute = config.minute;

      if (fromDate == "") {
        error = "Starting Date is compulsory for initiating date trigger.";
        sendError(error)
      } else {
        fromDate = new Date(fromDate);

        if (hour != "") fromDate.setHours(hour);
        if (minute != "") fromDate.setMinutes(minute);

        error = validateDate(fromDate);

        if (error == false) {
          var CronJob = require('cron').CronJob;
          var job = new CronJob(fromDate, function () {
            var msg = "Trigger Start on : " + fromDate;

            sendResult(msg);
          }, function () {}, true);
        }
      }
    }
    //end...


    //validate Date function...
    function validateDate(fromDate) {
      var errorMessage = null;
      var error = false;
      var today = new Date();
      today = today.getTime();

      fromDate = fromDate.getTime();

      if (fromDate <= today) {
        if (fromDate < today) {
          error = true;
          errorMessage = "starting date must be greater than today.";
          sendError(errorMessage);
        } else {
          error = true;
          errorMessage = "Use Time trigger for todays actions.";
          sendError(errorMessage)
        }
      }
      return (error);
    }
    //end

    function sendError(errorMessage) {
      node.send([null, errorMessage]);
    }

    function sendResult(result) {
      node.send([result, null]);
    }
  }
  RED.nodes.registerType("date_trigger", dateTrigger);
}
