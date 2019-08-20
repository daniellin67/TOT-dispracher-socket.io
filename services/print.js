var straw = require('straw')

/*
 * print received input to console
 */

module.exports = straw.node({
  process: function(msg, done) {
    console.log(msg.data[0].id);
    done(false);
  }
});
