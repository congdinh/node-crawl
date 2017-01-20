var fs = require('fs');
var async = require('async');
var request = require('request');
var url = require('url');
var path = require('path');

var filename = 'thichucolinkko.txt';
var concurrency = 10;

function downloadFile(link, cb) {
    console.log(link);
    var filename = path.basename(url.parse(link).pathname);
    request.head(link, function(err, res, body) {	
        request(link).pipe(fs.createWriteStream(filename)).on('close', cb);
    });
};

function worker(link, cb) {
    console.log('download ' + link);
    downloadFile(link, cb);
}

var queue = async.queue(worker, concurrency);

queue.drain = function() {
    console.log('Done All !');
};

fs.readFile(filename, function(err, data) {
    if (err) throw err;
    var array = data.toString().split("\n");
    for (i in array)
        queue.push(array[i]);
});
