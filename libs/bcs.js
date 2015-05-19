/*
 * BCS
 * @author zhangyaodong <zhangyaodong@baidu.com>
 */

var http = require('http');
var crypto = require('crypto');
var qs = require('querystring');
var path = require('path');
var fs = require('fs');
var stream = require('stream');

//set agent for http request
var agent = new http.Agent();
agent.maxSockets = 100;

/*
 * @desc To generate http request method (PUT/GET/DELETE/HEAD) with http.request
 */
var requestApi = {
  general: function (host, method, url, data, headers, cb) {
    var options = {
      method: method,
      host: host,
      path: url,
      headers: headers,
      agent: agent
    };
    var req = http.request(options, function(res) {
                cb && cb(null, res);
              }).on('error', function(err) {
                cb && cb(err);
              });

    if(data) {
      req.write(data);
    }
    req.end();
  },
  get: function(host, url, headers, cb) {
    requestApi.general(host, 'GET', url, null, headers, cb);
  },
  put: function(host, url, data, headers, cb) {
   if(data && !headers['Content-Length']){
      //headers['Content-Length'] = data.length;
      if (typeof data === 'string') {
        headers['Content-Length'] = Buffer.byteLength(data, 'utf-8');
      } else {
        headers['Content-Length'] = data.length;
      }

      //console.log(headers['Content-Length']);
    }
    if(!data) {
      headers['Content-Length'] = 0;
    }
    requestApi.general(host, 'PUT', url, data, headers, cb);
  },
  del: function(host, url, headers, cb) {
    headers['Content-Length'] = 0;
    requestApi.general(host, 'DELETE', url, null, headers, cb);
  },
  head: function(host, url, headers, cb) {
    requestApi.general(host, 'HEAD', url, null, headers, cb);
  },
  handleRes: function(res, tag, cb) {
    // handle HEAD reponse
    if (tag === 'HEAD') {
      if (res.statusCode !== 200) {
        cb && cb('head failed, statusCode is: ' + res.statusCode);
        return;
      }
      cb && cb(null, res.headers);
      return;
    }

    var buff = '';
    res.on('data', function(body) {
      buff += body;
    });
    res.on('end', function() {
      if (res.statusCode !== 200 && res.statusCode !== 206) {
        cb && cb(buff);
        return;
      }
      // handle PUT/DELETE response
      if (tag === 'PUT' || tag === 'DELETE') {
        cb && cb(null, JSON.stringify(res.headers));
      } else {
        // handle GET response
        cb && cb(null, buff);
      }
    });

    res.on('error', function (err) {
      cb && cb(err);
    });
  }
};

/*
 * File download and upload
 * @param {String} host BCS server hostname
 * @param {String} method Request method, in this function method = [GET/PUT]
 * @param {String} filename Upload or download file
 * @parm {Object} headers Http request headers options
 * @param {function} cb Get a response result
 */
function fileRequest(host,  method, url, file_stream, headers, cb) {
  var req = http.request({
    method: method,
    host: host,
    path: url,
    headers: headers,
    agent: agent
  }, function (res) {    
    res.on('error', function(err) {
      cb && cb(err);
    });
    if (method === 'GET') {
      getRes(res, cb);
    } else {
      putRes(res, cb);
    }
  }).on('error', function(err) {
    cb && cb(err);
  });
  
  req.on('socket', function(socket) {
    socket.setTimeout(10000);
    socket.on('timeout', function() {
      req.abort();
    });
  });

  if (method === 'PUT') {
    var read_stream = file_stream;
    read_stream.pipe(req);
    read_stream.on('end', function() {
      req.end();
    });
  } else {
    req.end();
  }
  
  function getRes(res, cb) {
    if (res.statusCode !== 200 && res.statusCode !== 206) {
      var buff = '';
      res.on('data', function(data) {
        buff += data;
      });
      res.on('end', function() {
        cb && cb(buff);
      });
    } else {
      //var write_stream = fs.createWriteStream(filename);
      // return res to user
      if(!file_stream){
        cb && cb(null, res);
        return;
      }
      var write_stream = file_stream;
      res.pipe(write_stream);
      res.on('end', function() {
        cb && cb(null);
      });
    }
  }

  function putRes(res, cb) {
    var buff = '';
    res.on('data', function(body) {
      buff += body;
    });
    res.on('end', function() {
      //console.log('statusCode: ', res.statusCode);
      if (res.statusCode !== 200 && res.statusCode !== 206) {
        cb && cb(buff);
        return;
      }
      cb && cb(null);
    });
  }
}

/*
 * @name BaeBCS
 * @class BCS service in nodejs
 * @constructor
 * @param {Object} option BCS init option
 * @param {String} option.host BCS server hostname
 * @param {String} option.ak User API Key
 * @param {String} option.sk User Secret Key
 */
function BaeBCS(option) {
  var self = this;

  self.host = option.host || process.env.BAE_ENV_ADDR_BCS;
  self.ak = option.ak;
  self.sk = option.sk;

  if (!(self.host && self.ak && self.sk)) {
    throw new Error('BCS server hostname, ak or sk is invalid');
  }
}

/*
 * Check param {bname, oname} is valid
 * @param {String} bname Bucket name in BCS
 * @param {String} oname Object name in Bucket
 * @desc If param is not valid, throw TypeError
 */
function checkName(bname, oname) {
  if (arguments.length === 2) {
    if (!(typeof bname === 'string' && oname && typeof oname === 'string')) {
      throw new TypeError('bname or oname must be string');
    }
    if (oname && oname[0] !== '/') {
      throw new TypeError('oname must be started with "/"');
    }
  }
  if (arguments.length === 1) {
    if (typeof bname !== 'string') {
      throw new TypeError('bname must be string');
    }
  }
}

/*
 * Put a object on BCS server
 * @param {String} bname Bucket name in BCS
 * @param {String} oname Object name in Bucket
 * @param {Buffer|String} data The data will be put on BCS
 * @param {function} cb cb(err, result) return result of putObj(...)
 */
BaeBCS.prototype.putObj = function (bname, oname, data, cb) {
  var self = this;

  checkName(bname, oname);
  if (typeof data !== 'string' && !Buffer.isBuffer(data)) {
    throw new TypeError('Put data must be a string or Buffer');
  }
  var url = self._generateUrl('PUT', bname, oname);
  requestApi.put(self.host, url, data, {}, function(err, res) {
    if (err) {
      cb && cb(err);
      return;
    }
    requestApi.handleRes(res, 'PUT', cb);
  });
}


/*
 * get a object from BCS server
 * @param {String} bname Bucket name in BCS
 * @param {String} oname Object name in Bucket
 * @param {function} cb cb(err, result) return result of getObj(...)
 */
BaeBCS.prototype.getObj = function(bname, oname, cb) {
  var self = this;

  checkName(bname, oname);
  var url = self._generateUrl('GET', bname, oname);
  requestApi.get(self.host, url, {}, function(err, res) {
    if (err) {
      cb && cb(err);
      return;
    }
    requestApi.handleRes(res, 'GET', cb);
  });
}

/*
 * List all buckets with user created
 * @param {function} cb cb(err, result) return result of listBuckets(...)
 */
BaeBCS.prototype.listBuckets = function(cb) {
  var self = this;

  var url = self._generateUrl('GET', '', '/');
  requestApi.get(self.host, url, {}, function(err, res) {
    if (err) {
      cb && cb(err);
      return;
    }
    requestApi.handleRes(res, 'GET', cb);
  });
}

/*
 * Create bucket in BCS server
 * @param {String} bname The name of bucket in BCS server
 * @param {JSON String} acl
 * @param {String} cb cb(err) return result of createBuckets(...)
 */
BaeBCS.prototype.createBucket = function(bname, acl, cb) {
  var self = this;

  checkName(bname);
  var data = null;
  if (typeof acl === 'function') {
    cb = acl;
  } else {
    data = acl;
  }

  var url = self._generateUrl('PUT', bname, '');
  requestApi.put(self.host, url, data, {}, function(err, res) {
    if (err) {
      cb && cb(err);
      return;
    }
    requestApi.handleRes(res, 'PUT', cb);
  });
}

/*
 * Delete bucket in BCS server
 * @param {String} bname The name of bucket in BCS server
 * @param {String} cb cb(err) return result of deleteBuckets(...)
 */
BaeBCS.prototype.deleteBucket = function(bname, cb) {
  var self = this;

  checkName(bname);
  var url = self._generateUrl('DELETE', bname, '');
  requestApi.del(self.host, url, {}, function(err, res) {
    if (err) {
      cb && cb(err);
      return;
    }
    requestApi.handleRes(res, 'DELETE', cb);
  });
}

/*
 * Delete a object from BCS server
 * @param {String} bname Bucket name in BCS
 * @param {String} oname Object name in Bucket
 * @param {function} cb cb(err) return result of deleteObj(...)
 */
BaeBCS.prototype.deleteObj = function(bname, oname, cb){
  var self = this;

  checkName(bname, oname);
  var url = self._generateUrl('DELETE', bname, oname);
  requestApi.del(self.host, url, {}, function(err, res){
    if(err){
      cb && cb(err);
      return;
    }
    requestApi.handleRes(res, 'DELETE', cb);
  });
}

/*
 * Copy a /bucket/object to /other_bucket/other_object
 * @param {String} src_bname Source bucket name in BCS
 * @param {String} src_oname Source object name in Source bucket
 * @param {String} dst_bname Destination bucket name in BCS
 * @param {String} dst_oname Destination object name in Destination bucket
 * @param {function} cb cb(err) return result of copyObj(...)
 */
BaeBCS.prototype.copyObj = function(src_bname, src_oname, dst_bname, dst_oname, cb){
  var self = this;
  checkName(src_bname, src_oname);
  checkName(dst_bname, dst_oname);

  var headers = {
    'x-bs-copy-source': 'bs://' + src_bname +  src_oname,
    'x-bs-copy-source-directive': 'copy'
  };
  var url = self._generateUrl('PUT', dst_bname, dst_oname);
  requestApi.put(self.host, url, '', headers, function(err, res) {
    if(err){
      cb && cb(err);
      return;
    }
    requestApi.handleRes(res, 'DELETE', cb);
  });
}

/*
 * list some objects in bucket from BCS server
 * @param {String} bname Bucket name in BCS
 * @param {Object} opt The rules of listing some objects
 * @param {Number} opt.start List object starting index
 * @param {Number} opt.limit The number of list objects
 * @param {String} opt.prefix prefix of will be lised objects, started with '/'
 * @param {function} cb cb(err, result) return result of listObj(...)
 */
BaeBCS.prototype.listObj = function(bname, opt, cb){
  var self = this;

  checkName(bname);
  var option = {
    start: 0,
    limit: 100
  };

  if (opt && typeof opt !== 'function') {
    for (var i in opt) {
      if (opt.hasOwnProperty(i)) {
        option[i] = opt[i];
      }
    }
  }

  if (typeof opt === 'function') {
    cb = opt;
  }

  var opt_query = qs.stringify(option);
  var url = self._generateUrl('GET', bname, '/') + '&' + opt_query;
  requestApi.get(self.host, url, {}, function(err, res) {
    if(err){
      cb && cb(err);
      return;
    }
    requestApi.handleRes(res, 'GET', cb);
  });
}

/*
 * Head object infomation in bucket
 * @param {String} Bucket name in BCS
 * @param {String} Object name in bucket
 * @param {function} cb cb(err, result) return result of headObj(...)
 */
BaeBCS.prototype.headObj = function(bname, oname, cb) {
  var self = this;

  checkName(bname, oname);
  var url = self._generateUrl('HEAD', bname, oname);
  requestApi.head(self.host, url, {}, function(err, res) {
    if (err) {
      cb && cb(err);
      return;
    }
    requestApi.handleRes(res, 'HEAD', cb);
  });
}

/*
 * Merge some objects in BCS
 * @param {String} Bucket name in BCS after merger
 * @param {String} Object name in bucket after merger
 * @param {Array} bolist this consists of {bname, oname, etag}, like this [{bname: 'foo', oname: 'bar', etag: 'hello'}]
 * @param {function} cb cb(err) return result of putSuperfile(...)
 * @desc use to reserve big data file
 */
BaeBCS.prototype.putSuperfile = function(bname, oname, bolist, cb) {
  var self = this;

  checkName(bname, oname);
  if (!Array.isArray(bolist) || bolist.length < 2) {
    throw new TypeError('bolist must be a array and length >=2 ');
  }

  var files = [];
  var i = 0;
  var count = 0;
  for (i = 0; i < bolist.length; i++) {
    /*
    // bolist not include etag
    (function(l) {
      // head every obj to get etag info
      self.headObj(bolist[l]['bname'], bolist[l]['oname'], function(err, result) {
        if (err) {
          throw new Error('get ' + bolist[l]['oname'] +' etag faild');
        }
        var etag = result.etag
        var tmp = '"part_' + count + '": {"url": "bs://' + bolist[l]['bname'] + bolist[l]['oname'] +  '", "etag":"'+ etag + '"}';
        files.push(tmp);
        ++count;

        // must get etag info from all object in bolist
        if (count === bolist.length) {
          var data = '{"object_list": {'+ files.join(',') + '}}';
          var url = self._generateUrl('PUT', bname, oname) + '&superfile=1'
          //console.log(data);
          requestApi.put(self.host, url, data, {}, function(err, res) {
            if (err) {
              cb && cb(err);
              return;
            }
            requestApi.handleRes(res, 'PUT', cb);
          });
        }
      });
    })(i);
     */

    // bolist include etag
    var etag = bolist[i].etag
    var tmp = '"part_' + count + '": {"url": "bs://' + bolist[i]['bname'] + bolist[i]['oname'] +  '", "etag":"'+ etag + '"}';
    files.push(tmp);
    ++count;

    // must get etag info from all object in bolist
    if (count === bolist.length) {
      var data = '{"object_list": {'+ files.join(',') + '}}';
      var url = self._generateUrl('PUT', bname, oname) + '&superfile=1'
      //console.log(data);
      requestApi.put(self.host, url, data, {}, function(err, res) {
        if (err) {
          cb && cb(err);
          return;
        }
        requestApi.handleRes(res, 'PUT', cb);
      });
    }
  }
}

/*
 * Upload file to BCS server
 * @param {String} Bucket name in BCS
 * @param {String} Object name in bucket
 * @param {Object} option set filename or Stream to option.file and file size to option.size
 * @param {String} option.file filename or stream  will be uploaded
 * @param {String} option.size file size. Note: if option.file is Stream, option.size is must and options.file is filename, options.size is invaild
 * @param {function} cb cb(err) return result of uploadFile(...)
 * @desc use to upload big data file or Stream
 */
BaeBCS.prototype.uploadFile = function (bname, oname, option, cb) {
  var self = this;
  var file_stream;
  var headers = {};
  checkName(bname, oname);

  if (option.file instanceof stream.Stream) {
    if (!option.size || typeof option.size !== 'number') {
      throw new Error('option.size must be valid and number type');
    }
    headers['Content-Length'] = option.size;
    file_stream = option.file;
  } else if (typeof option.file === 'string') {
    var pathname = path.resolve(option.file);
    //console.log('path: ', pathname);
    try {
      var stats = fs.statSync(pathname);
      if (!stats || !stats.isFile()) {
        throw new Error('filename error or filename is not file');
      }
    } catch(err) {
      throw new Error('filename error or filename is not file');
    }
    
    headers['Content-Length'] = stats.size;
    //console.dir(stats);
    file_stream = fs.createReadStream(pathname);
  } else {
    throw new Error('option.file must be Stream or filename with String type');
  }

  var url = self._generateUrl('PUT', bname, oname);
  fileRequest(self.host, 'PUT', url, file_stream, headers, cb);
}

/*
 * download file to BCS server
 * @param {String} Bucket name in BCS
 * @param {String} Object name in bucket
 * @param {String} file filename will be download to local or stream
 * @param {function} cb cb(err) return result of downloadFile(...)
 * @desc use to download big data file or Stream
 */
BaeBCS.prototype.downloadFile = function (bname, oname, file, cb) {
  var self = this;
  var file_stream;
  checkName(bname, oname);

  if (arguments.length === 3 && typeof file === 'function') {
    cb = file;
    file_stream = null;
  } else if(arguments.length === 4 && typeof file === 'string') {
    file_stream = fs.createWriteStream(file);
  } else {
    throw new Error('argument error');
  }

  var url = self._generateUrl('GET', bname, oname);
  fileRequest(self.host, 'GET', url, file_stream, {}, cb);
}


/*
 * Get ACL info from object
 * @param {String} Bucket name in BCS
 * @param {String} Object name in bucket
 * @param {function} cb cb(err, result) return result of getACL(...)
 */
BaeBCS.prototype.getACL = function(bname, oname, cb){
  var self = this;

  checkName(bname, oname);
  var url = self._generateUrl('GET', bname, oname) + '&acl=1';
  requestApi.get(self.host, url, {}, function(err, res){
    if(err){
      cb && cb(err);
      return;
    }
    requestApi.handleRes(res, 1, cb);
  });
}

/*
 * Set ACL of a object
 * @param {String} Bucket name in BCS
 * @param {String} Object name in bucket
 * @param {JSON String} acl See developer.baidu.com BCS
 * @param {function} cb cb(err) return result of setACL(...)
 */
BaeBCS.prototype.putACL = function(bname, oname, acl, cb){
  var self = this;

  checkName(bname, oname);
  var url = self._generateUrl('PUT', bname, oname) + '&acl=1';
  requestApi.put(self.host, url, acl, {}, function(err, res){
    if(err){
      cb && cb(err);
      return;
    }
    requestApi.handleRes(res, 0, cb);
  });
}



/*
 * sign
 * @param {String} M request method [PUT\GET\POST\DELETE\HEAD]
 * @param {String} B Bucket name
 * @param {String} O object name
 * @param {number} T time=1312956443
 * @param {String} I ip=192.168.0.1
 * @param {number} S size=100
 * @api private
 */
 BaeBCS.prototype._generateUrl = function(M, B, O, T, I, S){
  var self = this;

  var flag = '';
  var content = ''
  if(M){
    flag += 'M';
    content += ('Method=' + M +'\n');
  }
  if(B){
    flag += 'B';
    content += ('Bucket=' + B + '\n');
  }
  if(O){
    flag += 'O';
    content += ('Object=' + O + '\n');
  }
  if(T){
    flag += 'T';
    content += ('Time=' + T + '\n');
  }
  if(I){
    flag += 'I';
    content += ('Ip=' + I + '\n');
  }
  if(S){
    flag += 'S';
    content += ('Size=' + S + '\n');
  }

  content = flag + '\n' + content;

  var signture = crypto.createHmac('sha1', self.sk).update(content).digest('base64');
  var sign_o = {tag: signture};
  signture = qs.stringify(sign_o);
  sign = signture.slice(signture.indexOf('=') + 1);

  var sign = '?Sign=' + flag + ':' + self.ak + ':' + sign;
  var url = '/' + B + O + sign;
  if(T){
    url += '&time=' + T;
  }
  if(I){
    url += '&ip=' + I;
  }
  if(S){
    url += '&size' + S;
  }
  return url;
}

module.exports = BaeBCS;