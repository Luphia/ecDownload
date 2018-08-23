const http = require('http');
const https = require('https');
const url = require('url');
const path = require('path');
const fs = require('fs');

const getFileNameFromURL = function (link) {
  if(typeof(link) != 'string') { return ''; }
  return path.parse(url.parse(link).pathname).base;
};

const ecDownload = function({ link, savePath, retry }) {
  return new Promise((resolve, reject) => {
    const retryTimes = retry > 0 ? retry : 0;
    const options = url.parse(link);
    const crawler = options.protocol == 'https:'? https: http;
    let downloadTo = savePath;
    options.rejectUnauthorized = false;
    if(typeof(downloadTo) != 'string') {
      downloadTo = getFileNameFromURL(link);
    } else if(downloadTo.endsWith('/')) {
      downloadTo = path.resolve(downloadTo, getFileNameFromURL(link));
    }
    const file = fs.createWriteStream(downloadTo);
    const request = crawler.get(options, function(response) {
      response.pipe(file);
      response.on('end', resolve);
    });
    request.on('error', function (e) {
      if(retry > 0 ) {
      	console.log(retry);
        setTimeout(() => {
          ecDownload({ link, downloadTo, retry: (retry - 1) }).then(resolve, reject);
        }, Math.random() * 3000);
      } else {
        const e = new Error('failed ' + link);
        reject(e);
      }
	});
  });
};

module.exports = ecDownload;