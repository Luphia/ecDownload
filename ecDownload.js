const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

var getFileNameFromURL = function (link) {
	if(typeof(link) != 'string') { return ''; }
	return path.parse(url.parse(link).pathname).base;
};
var ecDownload = function () {};
ecDownload.download = function (link, savePath) {
	if(typeof(savePath != 'string')) { savePath = getFileNameFromURL(link); }
	var file = fs.createWriteStream(savePath);
	var request = http.get(link, function(response) {
		response.pipe(file);
	});
};

module.exports = ecDownload;