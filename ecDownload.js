const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');

var getFileNameFromURL = function (link) {
	if(typeof(link) != 'string') { return ''; }
	return path.parse(url.parse(link).pathname).base;
};
var ecDownload = function () {};
ecDownload.download = function (link, savePath, cb, retry) {
	var self = this;
	var options = url.parse(link);
	var crawler = options.protocol == 'https:'? https: http;
	options.rejectUnauthorized = false;
	if(typeof(savePath) != 'string') { savePath = getFileNameFromURL(link); }
	var file = fs.createWriteStream(savePath);
	var request = crawler.get(options, function(response) {
		response.pipe(file);
		cb = typeof(cb) == 'function'? cb: function () {};
		response.on('end', cb);
	});
	request.on('error', function (e) {
		retry = retry > 0? retry + 1: 1;
		if(retry < 4 ) { setTimeout(function () { self.download(link, savePath, cb, retry); }, Math.random() * 3000); }
		else { var e = new Error('failed ' + link); cb(e); }
	});
};

module.exports = ecDownload;