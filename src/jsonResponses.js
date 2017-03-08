const crypto = require('crypto');

const notes = {};

let etag = crypto.createHash('sha1').update(JSON.stringify(notes));
let digest = etag.digest('hex');

const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const addNote = (request, response, body) => {
  const responseJSON = {
    message: 'Please add text to the note',
  };

  if (!body.text) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (notes[body.text]) {
    responseCode = 204;
  } else {
    notes[body.text] = {};
  }

  notes[body.text].text = body.text;

  etag = crypto.createHash('sha1').update(JSON.stringify(notes));
  digest = etag.digest('hex');

  responseJSON.message = 'Created successfully';
  return respondJSON(request, response, responseCode, responseJSON);
};

module.exports = {
  notFound,
  addNote,
};

