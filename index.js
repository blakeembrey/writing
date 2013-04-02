var connect = require('connect');

connect()
  .use(connect.compress())
  .use(connect.static('build'))
  .use(function (req, res, next) {
    var url = req.url,
    host    = req.headers.host;
    if (host.substr(0, 4) === 'www.') {
      return res.redirect(301, '//' + host.substr(4) + url);
    }
    next();
  })
  .listen(process.env.PORT || 3000);