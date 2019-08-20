var straw = require('straw')
const options = {
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'test'
  }
}
//Connet to mySQL by knex
const knex = require('knex')(options);
module.exports = straw.node({
  timer: null,
  opts: { interval: 1000 },
  initialize: function (opts, done) {
    this.opts.interval = opts && opts.interval || 1000;
    done();
  },
  start: function (done) {
    this.timer = setInterval(this.ping.bind(this), this.opts.interval);
    done();
  },
  stop: function (done) {
    clearInterval(this.timer);
    done(false);
  },
  ping: function () {
    knex.from('request').select("*").orderBy('id', 'desc')
      .then((rows) => {
        this.output({
          'ping': rows.length,
          'data':rows
        });
      }).catch((err) => {
        if (err)
          console.log(err); throw err
      })
  }
});
