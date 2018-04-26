var compression = require('compression');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var PythonShell = require('python-shell');
const multer = require('multer')
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'images_with_labels/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});
var upload = multer({ storage: storage }).any();
const fs = require('fs');


// // Middlewares
app.disable('view cache');
//Compress our responses
app.use(compression());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 8000);

app.use(express.static(path.join(__dirname, 'frontend'), { maxAge: 3600000 }));
app.use('/bower_components',  express.static(__dirname + '/frontend/bower_components'));
app.use('/images_with_labels',  express.static(__dirname + '/images_with_labels'));

var options = {pythonPath: '/usr/bin/python2.7',mode: 'text',pythonOptions: ['-u']}

router.post('/doIt',function(req,res){
	var directory = './images_with_labels'
	fs.readdir(directory, (err, files) => {
		if (err) throw err;
		console.log(files.length)
		if(files.length>0){
			console.log('if')
			fs.unlink(path.join(directory, files[0]), err => {
				if (err) throw err;
				upload(req,res,function(err){
					console.log('started...')
					PythonShell.run('object_detection_tutorial.py',options, function (err) {
						console.log('finished');
						res.send(req.files[0].filename)
					});
				})
			});
		}else{
			console.log('else')
			upload(req,res,function(err){
				console.log('started...')
				PythonShell.run('object_detection_tutorial.py',options, function (err) {
					console.log('finished');
					res.send(req.files[0].filename)
				});
			})
		}

	})
})




app.use('/',router)


// // Start server
var server = app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
