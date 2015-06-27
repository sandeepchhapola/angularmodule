var argv = require('optimist')
    .default('port', 3000)
    .default('dir', 'src')
    .default('file', 'index.html')
    .argv;
var express = require('express');
var currentDir = process.cwd();
var path = require('path');
var clc = require('cli-color');
var green = clc.green.bold;
var blue = clc.blue.bold;
var yellow = clc.yellow.bold;
var red = clc.red.bold;
var users = [
    {
        name: 'Sweetiepie',
        age: '25',
        salary: '25000'
    },
    {
        name: 'Sweetiepie prathma',
        age: '27',
        salary: '24200'
    },
    {
        name: 'Sweetiepie dviteeya',
        age: '24',
        salary: '28000'
    },
    {
        name: 'Sweetiepie triteeya',
        age: '28',
        salary: '23000'
    },
    {
        name: 'Cutiepie',
        age: '23',
        salary: '27000'
    },
    {
        name: 'Cutiepie prathma',
        age: '27',
        salary: '24700'
    },
    {
        name: 'Cutiepie dviteeya',
        age: '24',
        salary: '26500'
    },
    {
        name: 'Cutiepie triteeya',
        age: '26',
        salary: '23300'
    },
    {
        name: 'Honey',
        age: '24',
        salary: '24100'
    }, {
        name: 'Honey prathma',
        age: '29',
        salary: '27300'
    }, {
        name: 'Honey dviteeya',
        age: '21',
        salary: '23700'
    }, {
        name: 'Honey triteeya',
        age: '23',
        salary: '24600'
    },
    {
        name: 'Sweetie',
        age: '21',
        salary: '26000'
    },
    {
        name: 'baby',
        age: '25',
        salary: '22500'
    },
    {
        name: 'dolly',
        age: '23',
        salary: '23800'
    },
    {
        name: 'mona',
        age: '27',
        salary: '27300'
    },
    {
        name: 'sona',
        age: '22',
        salary: '24800'
    },
    {
        name: 'neelu',
        age: '21',
        salary: '25500'
    },
    {
        name: 'honey',
        age: '24',
        salary: '28100'
    },
    {
        name: 'Sweetie prathma',
        age: '25',
        salary: '21700'
    },
    {
        name: 'Sweetie dviteeya',
        age: '26',
        salary: '29000'
    },
    {
        name: 'honey dviteeya',
        age: '25',
        salary: '26600'
    },
    {
        name: 'Cutiebee prathma',
        age: '23',
        salary: '23200'
    },
    {
        name: 'Cutiebee dviteeya',
        age: '22',
        salary: '24000'
    }];
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
function _define(name, value) {
    Object.defineProperty(global, name, {
        value: value,
        enumerable: true,
        writable: false,
        configurable: false
    });
}
var server = require('http').createServer(app);
_define('app', app);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer());
app.use(express.static(path.resolve(currentDir, argv.dir)));
app.set('appPath', path.resolve(currentDir, argv.dir));
//Serve (index.html) file for each route call
app.route('/').get(function (req, res) {
    res.sendFile(path.resolve(app.get('appPath'), argv.file));
});

app.get('/app/users/all/v1', function (req, res) {
    res.send(users).end();
});

app.get('/app/user/v1/:name', function (req, res) {
    var _user = null;
    users.forEach(function (user) {
        if (user.name === req.params.name) {
            _user = user;
        }
    });
    console.log(blue('Searched User: ', JSON.stringify(_user)));
    res.send({data: _user}).end();
});

function stopWebServer() {
    server.close(function () {
        console.log(red('Webserver shutdown'));
        process.exit();
    });
}
var gracefulShutdown = function () {
    console.log(blue("Received kill signal, shutting down Webserver gracefully."));
    stopWebServer();
    // if after
    setTimeout(function () {
        console.log(red("Could not close connections in time, forcefully shutting down webserver"));
        process.exit();
    }, 10 * 1000);
};

// Ctrl + C
process.on('SIGINT', gracefulShutdown);

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

process.on('uncaughtException', function (err) {
    console.log(red("Uncaught Exception: " + err));
    console.log(blue("Stack: " + err.stack));
    process.exit(1);
});

server.listen(argv.port, function () {
    console.log('');
    console.log(yellow('############################## Server Started ##############################'));
    console.log(blue('Angular App Directory Path: '), green(app.get('appPath')));
    console.log(blue('Angular App File Path: '), green(path.resolve(app.get('appPath'), argv.file)));
    console.log(blue('Server Listening on PORT: '), green(argv.port));
    console.log(yellow('############################################################################'));
});