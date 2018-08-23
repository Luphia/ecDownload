# ecDownload
an easy way to download file

## Install
```shell
npm install ecDownload
```

## Use
```node
const ecdownload = require('ecdownload');
ecdownload({
  url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  savePath: './',
  retry: 0
}).then(console.log, console.log);
```
