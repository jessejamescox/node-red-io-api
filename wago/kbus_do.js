module.exports = function (RED) {
  "use strict";

  function digitalOutput(n) {
    RED.nodes.createNode(this, n);
    var node = this;
    var moduleNum = n.module;
    var channelNum = n.channel;

    this.on("input", function (msg) {
      node.status({ fill: "green", shape: "ring", text: 'State : ' + msg.payload });
      // channel strings for the object creation
      var moduleStr = "module" + moduleNum;
      var channelStr = "channel" + channelNum;

      if (msg.payload === true || msg.payload === false) {
        var o = {
          payload: {
            state: {
              desired: {
                modules: {
                  [moduleStr]: {
                    process_data: {
                      outputs: {
                        [channelStr]: {
                          value: msg.payload,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        };
        node.send(o);
      }
    });
  }
  RED.nodes.registerType("digital output", digitalOutput);
};
