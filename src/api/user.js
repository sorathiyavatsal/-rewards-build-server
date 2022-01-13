'use strict';

import {
    Router
} from "express";
import { getAllUsers, loginUser, registerUser, updateUser } from "./handlers/user";
import {
    log
} from "./middlewares/index";

export default class UserAPI {
    constructor () {
        this.router = Router();
        this.registerRoutes();
    }

    registerRoutes () {
        let router = this.router;
        router.post( '/', log, registerUser );
        router.put( '/', log, updateUser );
        router.get( '/', log, getAllUsers );
        router.post( '/login', log, loginUser );
    }

    getRouter () {
        return this.router;
    }

    getRouteGroup () {
        return '/user';
    }
}