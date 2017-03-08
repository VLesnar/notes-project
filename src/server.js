const http = require('http');
const url = require('url');
const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl === '/addNote') {
    const res = response;

    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      jsonHandler.addNote(request, res, bodyParams);
    });
  }
  console.log('success');
};

const handleGet = (request, response, parsedUrl) => {
  switch (parsedUrl.pathname) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getStyle(request, response);
      break;
    case '/background.png':
      htmlHandler.getBackground(request, response);
      break;
    default:
      jsonHandler.notFound(request, response);
      break;
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (request.method === 'GET') {
    handleGet(request, response, parsedUrl);
  } else {
    handlePost(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on port: ${port}`);
