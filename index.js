var express = require("express");
var fs = require('fs');
var jwt = require('jsonwebtoken');
var querystring = require('querystring');
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
const fetch = require('node-fetch');
var fs = require("fs");
var request = require('request');
var bodyParser = require('body-parser')
var cors = require('cors')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(cors())
server.listen(process.env.PORT || 5000, function () {
    console.log('Server is listening at port 5000');
});
io.on('connection', function (socket) {
    socket.on('CLIENT-ADD-DATA', function (data) {
        io.sockets.emit('SERVER-ADD-DATA-RESPONSE', data);
    });
})

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get('/hienhanhs', function (req, res) {
    console.log(req.headers.authorization)
    fetch('http://localhost:3000/hienhanhs')
        .then(res => res.json())
        .then(function (body) {
            res.send(body);
        });
})
app.get('/chotcos', function (req, res) {
    fetch('http://localhost:3000/chotcos')
        .then(res => res.json())
        .then(function (body) {
            res.send(body);
        });
})
app.get('/hengios', function (req, res) {
    fetch('http://localhost:3000/hengios')
        .then(res => res.json())
        .then(function (body) {
            res.send(body);
        });
})
app.post('/hienhanhs', function (req, res) {
    request.post({
        url: 'http://localhost:3000/hienhanhs',
        body: req.body,
        json: true
    }, function (error, response, body) {
        if (!error) {
            res.send(response)
        }
        else {
            res.sendStatus(response.statusCode);
        }
    });
})
app.get('/log-in', function (req, res) {
    res.sendFile(__dirname + "/index.html");
})
app.post('/token', function (req, res) {
    qs = querystring.stringify(req.body)
    fetch(`http://localhost:3000/nguoidungs?${qs}`)
        .then(res => res.json())
        .then(function (body) {
            if (body[0]) {
                let privateKey = fs.readFileSync('./private.pem', 'utf8');
                let token = jwt.sign({ "body": "stuff" }, privateKey, { algorithm: 'HS256' });
                res.send({ access_token: token, status: 200, username: body[0].fullname, message:'Đăng nhập thành công' });
            }
            else {
                res.send({ access_token: null, status: 403, username: null, message:'Sai tên đăng nhập hoặc mật khẩu' });
            }
        });
})
app.get('/jwt', (req, res) => {
    let privateKey = fs.readFileSync('./private.pem', 'utf8');
    let token = jwt.sign({ "body": "stuff" }, privateKey, { algorithm: 'HS256' });
    res.send(token);
})


function isAuthenticated(req, res, next) {
    if (req.headers.authorization) {
        // retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization;
        console.log(token)
        let privateKey = fs.readFileSync('./private.pem', 'utf8');
        // Here we validate that the JSON Web Token is valid and has been 
        // created using the same private pass phrase
        jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {

            // if there has been an error...
            if (err) {
                // shut them out!
                res.status(500).json({ error: "Not Authorized" });
                throw new Error("Not Authorized");
            }
            // if the JWT is valid, allow them to hit
            // the intended endpoint
            return next();
        });
    } else {
        // No authorization header exists on the incoming
        // request, return not authorized and throw a new error 
        res.status(500).json({ error: "Not Authorized" });
        throw new Error("Not Authorized");
    }
}