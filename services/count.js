var straw = require('straw')

/*
 * emits cumulative count of messages received.
 */

module.exports = straw.node({
  total: 0,
  process: function (msg, done) {
    if (this.total != msg.ping) {
      this.total = msg.ping;
      this.output({ count: msg.ping, data: msg.data }, done);
    }
    else{
      done()
    }
  }
});
