module.exports = function (RED) {
  "use strict"
  var isUtf8 = require("is-utf8")

  function MQTTInJSONNode(n) {
    RED.nodes.createNode(this, n)
    this.topic = n.topic.trim()
    this.qos = parseInt(n.qos)
    if (isNaN(this.qos) || this.qos < 0 || this.qos > 2) {
      this.qos = 2
    }
    this.broker = n.broker
    this.brokerConn = RED.nodes.getNode(this.broker)
    this.ignoreEmpty = n.ignoreempty
    this.removeMqttConfig = n.removemqttconfig
    if (!/^(#$|(\+|[^+#]*)(\/(\+|[^+#]*))*(\/(\+|#|[^+#]*))?$)/.test(this.topic)) {
      return this.warn(RED._("mqtt.errors.invalid-topic"))
    }

    var status_topic = this.topic + "/controller/status";
    var pi_topic = this.topic + "/controller/status";

    var node = this
    if (this.brokerConn) {
      this.status({
        fill: "red",
        shape: "ring",
        text: "disconnected",
      })
      if (this.topic) {
        var subTopic = this.topic + "/#";
        node.brokerConn.register(this)
        this.brokerConn.subscribe(
          subTopic,
          this.qos,
          function (topic, payload, packet) {
            if (isUtf8(payload)) {
              try {
                payload = JSON.parse(payload.toString())
              } catch (err) {
                payload = payload.toString()
              }
            }
            var msg = {
              topic: topic,
              payload: payload,
              qos: packet.qos,
              retain: packet.retain,
            }
            if (payload === Object(payload) && "_payload" in payload) {
              for (const prop of Object.keys(payload._payload)) {
                msg[prop] = payload._payload[prop]
              }
              delete payload._payload
            }
            if (
              node.brokerConn.broker === "localhost" ||
              node.brokerConn.broker === "127.0.0.1"
            ) {
              msg._topic = topic
            }
            if (this.removeMqttConfig) {
              var delList = ["_topic", "qos", "retain", "topic"]
              for (const item of delList) {
                if (item in msg) {
                  delete msg[item]
                }
              }
            }

            if (msg.topic == pi_topic) {
              if (msg.payload.state.reported.switch_state == "STOP") {
                node.status({
                  fill: "red",
                  shape: "ring",
                  text: "connected" + " switch: stop",
                })
              } else {
                node.status({
                  fill: "green",
                  shape: "dot",
                  text: "connected" + " switch: run",
                })
              }

              var statusMSg = {
                payload:
                {
                  node_id: msg.payload.state.reported.node_id,
                  switch_state: msg.payload.state.reported.switch_state,
                  timestamp: msg.payload.state.reported.timestamp,
                  module_count: msg.payload.state.reported.module_count,
                }
              }
              delete(msg.payload.state.reported.node_id);
              delete(msg.payload.state.reported.switch_state);
              delete(msg.payload.state.reported.timestamp);
              delete(msg.payload.state.reported.module_count);

              node.send([statusMSg, msg]);
            }
            //node.send(msg)
          }.bind(this),
          this.id
        )
        if (this.brokerConn.connected) {
          node.status({
            fill: "green",
            shape: "dot",
            text: "node-red:common.status.connected",
          })
        }
      } else if (!this.ignoreEmpty) {
        this.error(RED._("mqtt.errors.not-defined"))
      }
      this.on("close", function (done) {
        if (node.brokerConn) {
          node.brokerConn.unsubscribe(node.topic, node.id)
          node.brokerConn.deregister(node, done)
        }
      })
    } else {
      this.error(RED._("mqtt.errors.missing-config"))
    }
  }
  RED.nodes.registerType("kbus in", MQTTInJSONNode)
}