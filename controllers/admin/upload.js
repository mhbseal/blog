module.exports = function (app, co) {
  var
    fs = require('fs'),
    path = require('path'),
    multer  = require('multer'),
    uploadPath = path.join(C.uploadPath, 'article'),
    storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(C.dir.resource, uploadPath))
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + F.date.format('YYYY-MM-DD-HH-mm-ss'))
      }
    }),
    upload = multer({ storage: storage});

  app // 上传,这里single参数要注意，需和前台form中的fieldName相同
    .post(C.adminPath + 'upload', upload.single('upfile'), function (req, res) {
      co(function *() {
        var fileName = req.file.filename;
        res.send(JSON.stringify({ // umeditor只接受Content-Type: 'text/html'
          url: C.uploadFixUrl + uploadPath + '/' + fileName,
          title: fileName,
          state: "SUCCESS"
        }));
      })
    })
};


