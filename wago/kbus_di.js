module.exports = function (RED) {
    "use strict";

    function digitalInput(n) {
        RED.nodes.createNode(this, n);
        var node = this;
        var moduleNum = n.module;
        var channelNum = n.channel;

        this.on("input", function (msg) {

            var moduleStr = "module" + moduleNum;
            var channelStr = "channel" + channelNum;

            //if (msg.payload.state.reported.controller.modules.hasOwnProperty(moduleStr)) {
                //if (msg.payload.state.reported.controller.modules[moduleStr].channels.hasOwnProperty(channelStr)) {

                try {
                    // copy in the channel value
                    var rawInput = msg.payload.state.reported.modules[moduleStr].process_data.inputs[channelStr].value;

                    // create the output object    
                    var outputMsg = {};
                    
                    // copy the value to the output
                    outputMsg.payload = rawInput;
                    
                    // send it
                    node.status({fill: "green", shape: "ring", text: 'State : ' + outputMsg.payload });
                    node.send(outputMsg);
                //}
            } catch {
                // do something cool
            }
        });
    }
    RED.nodes.registerType("digital input", digitalInput);
};
