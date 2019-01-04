const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const http = require('http');
const container = require('./container');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');



container.resolve(function (user) {

    mongoose.promise = global.Promise;
    mongoose.connect('mongodb://localhost/footballkik', {useNewUrlParser: true});
    const app = setupExpress();

    function setupExpress() {
        const app = express();
        const server = http.createServer(app);
        server.listen(3000, () => {
            console.log('listening on port 3000');
        });

        configureExpress(app);

        const router = require('express-promise-router')();
        user.setRouting(router);

        app.use(router);
    }

    function configureExpress(app) {
        app.use(express.static('public'));
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.set('view engine', 'ejs');

        app.use(validator());
        app.use(session({
            secret: 'q0QQCCmec',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));

        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
    }

});