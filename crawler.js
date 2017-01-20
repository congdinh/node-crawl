var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var async = require('async');

link = fs.createWriteStream('saveathere.txt');

num_page = 151;
var concurrency = 30;

var url = 'https://vnexpress.net/';

function getLinkOnPage(page, cb) {

    console.log('page = ' + page);

    request(url + page, function(err, res, body) {
		if (!err && res.statusCode == 200) {
	    	var $ = cheerio.load(body);
	    	x = $('div.photoset-grid');
	    	x = x.toArray();
	    	x.forEach(function(y) {
	   			z = y['children'];
	   			z.forEach(function(f) {
	   				if (f['name'] == 'img') {
	   					link.write(f['attribs']['src'] + '\n');
	   				}
	   			})
	   		})
	  	}
	  	console.log('done page ' + page);
	  	cb();
	})
}

function worker(page, cb) {
    getLinkOnPage(page, cb);
}

var queue = async.queue(worker, concurrency);

queue.drain = function() {
    console.log('Done All !');
};

for (var i = 0; i <= num_page; i++) {
    queue.push(i);
};
