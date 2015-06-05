module.exports = function() {
	return {
		method: 'all',
		path: C.adminPath + 'upload',
		handler: function* () {
			var
				fs = require('fs'),
				path = require('path'),
				parse = require('co-busboy'),
				parts, part, name, stream, body;

			parts = parse(this); // 来自github koa example
			this.type = 'text/html; charset=utf-8'; // umeditor只接受'text/html'
			if (part = yield parts) {
				name = Date.now() + '_' + part.filename;
				stream = fs.createWriteStream(path.join(C.dir.upload, 'article', name));
				part.pipe(stream);
				body = '{"url": "/upload/' + name + '", "title": "' + name + '", "state": "SUCCESS" }';
			} else {
				body = '{"url": "", "title": "", "state": "EORROR" }';
			}
			this.type = 'text/html; charset=utf-8'; // umeditor只接受'text/html'
			this.body = body;
		}
	}
};


