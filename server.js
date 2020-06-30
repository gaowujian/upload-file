var moment = require("moment");
var express = require("express");
var multer = require("multer");
var cors = require("cors");
var path = require("path");
var bodyParser = require("body-parser");
var fs = require("fs");
var storage = multer.diskStorage({
  //文件存储路径
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "/uploadFiles"));
  },
  //修改上传文件的名字
  //file 是个文件对象 ,fieldname对应在客户端的name属性
  //存储的文件需要自己加上文件的后缀，multer并不会自动添加
  //这里直接忽略文件的后缀.
  filename: function (req, file, cb) {
    var date = new Date();
    cb(null, moment().format("YYYYMMDDhhmmss") + file.originalname);
  },
});
// multer接受的是multipart/form-data类型的数据
let upload = multer({ storage: storage });

const app = express();
// parse application/x-www-form-urlencoded
// axios的post默认请求会使用这个content-type
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// 跨域请求
app.use(cors());
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("上传成功");
  res.send("上传成功");
});

//  upload1接受的是application/x-www-form-urlencoded类型的数据
app.post("/upload1", (req, res) => {
  //接收前台POST过来的base64
  var imgData = JSON.stringify(req.body);
  //过滤data:URL
  var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
  console.log(base64Data);
  var dataBuffer = Buffer.from(base64Data, "base64");
  console.log("我收到了前端的数据");
  fs.writeFile("image.jpg", dataBuffer, function (err) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log("文件保存成功");
      res.send("保存成功！");
    }
  });
});

app.listen(8080, () => {
  console.log("server is running on 8080");
});
