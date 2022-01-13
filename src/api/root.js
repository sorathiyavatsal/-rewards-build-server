'use strict';

import {
    Router
} from "express";
import {
    log,
    loggedIn
} from "../api/middlewares/index";
import {
    DefaultHandler
} from './handlers/root';
var multer = require( 'multer' )
var upload = multer( {
    dest: 'uploads/'
} )

export default class RootAPI {
    constructor () {
        this.router = Router();
        this.registerRoutes();
    }

    registerRoutes () {
        let router = this.router;
        router.post( '/', log, loggedIn, DefaultHandler );
    }

    getRouter () {
        return this.router;
    }

    getRouteGroup () {
        return '/';
    }
}