import express from 'express';
import config from './conf';
import http from 'http';
import Api from './api';
import {
    log
} from './api/middlewares/index'
import {
    join
} from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {
    DefaultHandler
} from './api/handlers/root.js'
import {} from './models/index';
const https = require('https');

// const credentials = {
// 	key: privateKey,
// 	cert: certificate,
// 	ca: ca
// };



// var Raven = require('raven');
let port = config.app['port'];
// let port2 = config.app['port2'];
let app = express();
let whitelist = Object.keys(config.whitelist).map(k => config.whitelist[k]);

// Raven.config(config.sentry['key']).install();
// app.use(Raven.requestHandler());


app.set("port", port);
app.use(bodyParser.json({
    limit: config.app['bodyLimit']
}));
app.use(cookieParser(config.app['cookie_secret']));

app.use(cors({
    origin: (origin, callback) => {
        console.log(origin);
        let originIsWhitelisted = whitelist.indexOf(origin) !== -1 || typeof origin === "undefined";
        console.log('Is IP allowed: ' + originIsWhitelisted);
        let failureResp = 'You are not authorized to perform this action';
        callback(originIsWhitelisted ? null : failureResp, originIsWhitelisted);
    }
}));

new Api(app).registerGroup();

app.use('/static', express.static(join(__dirname, 'static')));
app.use('/reward', express.static('uploads/rewards'));
app.use('/', log, DefaultHandler);


// app.use(Raven.errorHandler());
app.use(function onError(err, req, res, next) {
    res.statusCode = 500;
    res.end('{"success": false}');
    // res.end(res.sentry + '\n');
});

http
    .createServer(app)
    .on('error', function () {
        console.log('Can\'t connect to server.');
    })
    .listen(port, () => console.log(`Server Started :: ${port}`));

// https.createServer(credentials, app)
// .on('error', function () {
//     console.log('Can\'t connect to secure server.');
// })
// .listen(port2, () => console.log(`Server Started :: ${port2}`));