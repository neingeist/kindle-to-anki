"use strict";

var clippings_file = "My Clippings 201406.txt";


var Exception = function() {}
Exception.prototype.toString = function() {
  var name = this.name || 'unknown';
  var message  = this.message || 'no description';
  return '[' + name + ']' + message;
};
function InvalidInputException(message) {
  this.name = 'Invalid input';
  this.message = message;
};
InvalidInputException.prototype = new Exception();

// XXX Document
var parse_clippings = function(clippings_text) {

  var clippings = [];

  // Remove U+FEFF
  clippings_text = clippings_text.replace(/^\ufeff/, '');

  // Split up clippings, the last one is empty, so throw it away.
  var clippings_texts = clippings_text.split("\r\n==========\r\n");
  clippings_texts = clippings_texts.slice(0, clippings_texts.length-1);

  // Parse clippings
  for(var i=0; i<clippings_texts.length; i++) {
    var clipping_text = clippings_texts[i];
    var clipping = {};

    var lines = clipping_text.split("\r\n");
    if (lines.length < 4) {
      throw new InvalidInputException("Clipping is too short:\n\n"
          + clipping_text);
    }

    // Parse the lines of a clipping
    clipping["book"] = lines[0];
    var meta = lines[1];
    if (lines[2] !== "")
      throw new InvalidInputException("Third line should be empty:\n\n"
          + clipping_text);
    clipping["text"] = lines.slice(3, lines.length).join("\n");

    // Actually, parse meta further
    var metas = meta.split("|");
    clipping["loc"] = metas.slice(0, metas.length-1).join()
      .replace(/-?\s*Highlight (on)?\s*/, '')
      .replace(/\s*$/, '');
    clipping["date"] = metas[metas.length-1]
      .replace(/\s*Added on\s*/, '');

    clippings.push(clipping);
  }

  return clippings;
};

var CSVify = function(array_of_hashes) {
  var csv = "";

  // Put double quotes around some text (which may contain quotes itself, which
  // are replaces by other quotes as Anki does not like quoted quotes...)
  var quotes = function(text) {
    return '"' + text.replace(/"/g, '“') + '"';
  }

  // Check input
  if (!(array_of_hashes instanceof Array))
    throw new InvalidInputException("Not an array");
  if (array_of_hashes.length===0)
    throw new InvalidInputException("Zero length array");
  // FIXME
  // for(var i=0; i<array_of_hashes.length; i++)
  //  if (!(array_of_hashes[i] instanceof Array))
  //    throw new InvalidInputException("Not an array of hashes");

  // First line decides the fields
  var fields = Object.keys(array_of_hashes[0]);

  // Build CSV text from data
  for(var i=0; i<array_of_hashes.length; i++) {
    csv += fields.map(function(field) {
      return quotes(array_of_hashes[i][field]);
    })
    .join("\t")
      + "\n";
  }

  return csv;
};

// CSVify(1);
// CSVify("foo");
// CSVify(["foo"]);
// FIXME CSVify([["foo"]]);

var fs = require('fs');
fs.readFile(clippings_file, 'utf-8', function(err, text) {
  if (err) {
    throw new InvalidInputException('Error opening "' + clippings_file + '"');
  } else {
    var clippings = parse_clippings(text);
    var csv = CSVify(clippings);

    process.stdout.write(csv);
  }
});

// FIXME: node clippings.js | head -1 => Unhandled 'error' event
