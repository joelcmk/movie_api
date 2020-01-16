
const http = require('http'),
  fs = require('fs'),
  url = require('url');

  http.createServer((request, response) => {
    var addr = request.url,
      q = url.parse(addr, true),
      filePath = '';
    if (q.pathname.includes('documentation')) {
      filePath = (__dirname + '/documentation.html');
      console.log('documentation');
    } else {
      filePath = 'index.html';
      console.log('index')
    }

    fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Added to log!')
      }
    });

  }).listen(8080)
